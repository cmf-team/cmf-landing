#!/usr/bin/env bash
#
# deploy.sh — build, ship and verify the site in one command.
#
# The GitHub Actions workflow only copies files, so a green checkmark proves
# nothing about whether the site actually works. This builds first (so a syntax
# error fails locally, not in production), then verifies the deployed bytes
# match what was built.
#
#   ./deploy.sh              build, commit, push, watch, verify
#   ./deploy.sh --help       everything else
#
set -euo pipefail
cd "$(dirname "$0")"

BRANCH="master"
WORKFLOW="static.yml"

[ -f deploy.conf ] && . ./deploy.conf
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-}"
REPO="${REPO:-}"

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
if [ -t 1 ]; then
  B=$'\033[1m'; DIM=$'\033[2m'; R=$'\033[31m'; G=$'\033[32m'; Y=$'\033[33m'; C=$'\033[36m'; X=$'\033[0m'
else
  B=''; DIM=''; R=''; G=''; Y=''; C=''; X=''
fi

STAGE=0
step()  { STAGE=$((STAGE+1)); printf "\n%s[%d/%d]%s %s\n" "$B" "$STAGE" "$TOTAL" "$X" "$1"; }
ok()    { printf "  %s✓%s %s\n" "$G" "$X" "$1"; }
warn()  { printf "  %s!%s %s\n" "$Y" "$X" "$1"; }
info()  { printf "  %s%s%s\n" "$DIM" "$1" "$X"; }
die()   { printf "  %s✗%s %s\n" "$R" "$X" "$1" >&2; exit 1; }

sha256() {
  if command -v shasum >/dev/null 2>&1; then shasum -a 256 | cut -d' ' -f1
  else sha256sum | cut -d' ' -f1; fi
}

# ---------------------------------------------------------------------------
# Repo / URL resolution
# ---------------------------------------------------------------------------
if [ -z "$REPO" ]; then
  remote_url="$(git remote get-url origin 2>/dev/null || true)"
  [ -n "$remote_url" ] || die "no git remote 'origin'; set REPO in deploy.conf"
  REPO="$(printf '%s' "$remote_url" | sed -E 's#^(git@|ssh://git@|https://)github\.com[:/]##; s#\.git$##')"
fi
OWNER="${REPO%%/*}"
NAME="${REPO##*/}"

if [ -n "$CUSTOM_DOMAIN" ]; then
  SITE_URL="https://$CUSTOM_DOMAIN"
else
  SITE_URL="https://$OWNER.github.io/$NAME"
fi

GH_PAGES_IPS="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
GH_PAGES_IPV6="2606:50c0:8000::153 2606:50c0:8001::153 2606:50c0:8002::153 2606:50c0:8003::153"

usage() {
  cat <<EOF
${B}deploy.sh${X} — build, ship and verify ${C}$REPO${X}

  ${B}./deploy.sh${X}                  Full deploy: build, commit, push, watch, verify
  ${B}./deploy.sh -m "message"${X}     Same, with the commit message supplied
  ${B}./deploy.sh --dry-run${X}        Build and pre-flight only; nothing is pushed
  ${B}./deploy.sh --check${X}          Verify the live site matches a local build
  ${B}./deploy.sh --rollback [sha]${X} Revert the last deploy (or [sha]) and ship that
  ${B}./deploy.sh --skip-checks${X}    Skip pre-flight (emergency escape hatch)
  ${B}./deploy.sh --domain-setup${X}   Configure the custom domain in deploy.conf
  ${B}./deploy.sh --domain-status${X}  Report DNS, TLS and redirect health
  ${B}./deploy.sh --help${X}           This message

Currently deploying to: ${C}$SITE_URL${X}
EOF
}

# ---------------------------------------------------------------------------
# Stages
# ---------------------------------------------------------------------------
preflight() {
  step "Pre-flight"

  for c in git gh curl node npm; do
    command -v "$c" >/dev/null 2>&1 || die "missing required command: $c"
  done
  gh auth status >/dev/null 2>&1 || die "gh not authenticated — run 'gh auth login'"
  ok "dependencies and GitHub auth"

  local current
  current="$(git rev-parse --abbrev-ref HEAD)"
  [ "$current" = "$BRANCH" ] || die "on branch '$current'; deploys run from '$BRANCH'"

  git ls-remote --exit-code origin >/dev/null 2>&1 || die "cannot reach origin"

  git fetch origin "$BRANCH" --quiet 2>/dev/null || true
  local behind
  behind="$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo 0)"
  [ "$behind" = "0" ] || die "$behind commit(s) behind origin/$BRANCH — pull first"
  ok "on $BRANCH, up to date with origin"

  # The build is the syntax check: a broken .jsx fails here rather than
  # shipping a blank page under a green checkmark.
  npm run build --silent >/dev/null 2>&1 || {
    printf "\n"
    npm run build --silent || true
    die "build failed — nothing pushed"
  }
  ok "build succeeded"

  [ -s dist/index.html ] || die "dist/index.html missing or empty"
  grep -q 'app\..*\.js' dist/index.html || die "dist/index.html does not reference the bundle"
  if grep -q 'text/babel' dist/index.html; then die "dist/index.html still contains dev script tags"; fi
  ok "dist/ output looks correct"
}

commit_and_push() {
  step "Commit & push"

  if [ -n "$(git status --porcelain)" ]; then
    git status --short | sed 's/^/    /'
    printf "\n"
    git diff --stat HEAD | tail -1 | sed 's/^/    /'

    if [ -z "$MESSAGE" ]; then
      [ -t 0 ] || die "working tree dirty and no -m supplied (not a terminal)"
      printf "\n  commit message (empty to abort): "
      IFS= read -r MESSAGE || true
      [ -n "$MESSAGE" ] || die "aborted — nothing committed or pushed"
    fi

    git add -A
    git commit -q -m "$MESSAGE"
    ok "committed: $MESSAGE"
  else
    ok "working tree clean"
  fi

  if [ -z "$(git rev-list "origin/$BRANCH..HEAD" 2>/dev/null)" ]; then
    warn "nothing new to push — verifying what is already live"
    PUSHED_SHA="$(git rev-parse HEAD)"
    SKIP_WATCH=1
    return
  fi

  git push -q origin "$BRANCH"
  PUSHED_SHA="$(git rev-parse HEAD)"
  ok "pushed ${PUSHED_SHA:0:8} -> origin/$BRANCH"
}

watch_run() {
  step "GitHub Actions"

  local run_id="" waited=0
  printf "  waiting for the run to appear"
  while [ "$waited" -lt 90 ]; do
    run_id="$(gh run list --repo "$REPO" --workflow "$WORKFLOW" --limit 20 \
      --json databaseId,headSha --jq \
      ".[] | select(.headSha==\"$PUSHED_SHA\") | .databaseId" 2>/dev/null | head -1)"
    [ -n "$run_id" ] && break
    printf "."
    sleep 3
    waited=$((waited+3))
  done
  printf "\n"
  [ -n "$run_id" ] || die "no workflow run found for ${PUSHED_SHA:0:8} after ${waited}s"

  info "run $run_id"
  gh run watch "$run_id" --repo "$REPO" --exit-status >/dev/null 2>&1 \
    && ok "workflow succeeded" \
    || die "workflow failed — see: gh run view $run_id --repo $REPO --log-failed"
}

# Pick a base URL that actually works right now. During a domain cutover two
# things are temporarily false: HTTPS fails until GitHub issues the cert, and
# the local resolver may still hold the old address. Pinning to a Pages IP and
# falling back to http keeps verification honest instead of failing spuriously.
resolve_base() {
  BASE="$SITE_URL"; CURL_OPTS=""
  [ -n "$CUSTOM_DOMAIN" ] || return 0

  local gh_ip="${GH_PAGES_IPS%% *}" code
  local pin="--resolve $CUSTOM_DOMAIN:443:$gh_ip --resolve $CUSTOM_DOMAIN:80:$gh_ip"

  code="$(curl -s -o /dev/null -m 15 $pin -w '%{http_code}' "https://$CUSTOM_DOMAIN/" 2>/dev/null || true)"
  if [ "$code" = "200" ]; then
    BASE="https://$CUSTOM_DOMAIN"; CURL_OPTS="$pin"; return 0
  fi

  code="$(curl -s -o /dev/null -m 15 $pin -w '%{http_code}' "http://$CUSTOM_DOMAIN/" 2>/dev/null || true)"
  if [ "$code" = "200" ]; then
    BASE="http://$CUSTOM_DOMAIN"; CURL_OPTS="$pin"
    warn "TLS certificate not issued yet — verifying over http for now"
    return 0
  fi

  die "cannot reach $CUSTOM_DOMAIN over https or http (last code $code)"
}

verify_live() {
  step "Verify live"

  resolve_base

  local code
  code="$(curl -s -o /dev/null -m 15 $CURL_OPTS -w '%{http_code}' "$BASE/")"
  [ "$code" = "200" ] || die "$BASE/ returned HTTP $code"
  ok "200 $BASE/"

  # Hash-compare every built file against what is actually being served.
  # esbuild is version-pinned and CI runs `npm ci`, so CI output should be
  # byte-identical to the local build.
  local files attempt=0 mismatched
  files="$(cd dist && find . -type f ! -name CNAME | sed 's#^\./##' | sort)"

  while [ "$attempt" -lt 6 ]; do
    mismatched=""
    local f local_h live_h
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      local_h="$(sha256 < "dist/$f")"
      live_h="$(curl -s -m 30 $CURL_OPTS "$BASE/$f?cb=$(date +%s)-$RANDOM" | sha256)"
      [ "$local_h" = "$live_h" ] || mismatched="$mismatched $f"
    done <<EOF
$files
EOF

    [ -z "$mismatched" ] && break
    attempt=$((attempt+1))
    [ "$attempt" -lt 6 ] && { info "CDN still propagating, retrying in 10s...";  sleep 10; }
  done

  if [ -n "$mismatched" ]; then
    for f in $mismatched; do printf "  %s✗%s stale or missing: %s\n" "$R" "$X" "$f"; done
    die "live site does not match the local build"
  fi
  ok "$(printf '%s\n' "$files" | grep -c .) file(s) byte-identical to local build"

  if [ -n "$CUSTOM_DOMAIN" ]; then
    local redir
    redir="$(curl -s -o /dev/null -w '%{redirect_url}' "https://$OWNER.github.io/$NAME/" || true)"
    case "$redir" in
      *"$CUSTOM_DOMAIN"*) ok "github.io redirects to $CUSTOM_DOMAIN" ;;
      *) warn "github.io does not yet redirect to $CUSTOM_DOMAIN" ;;
    esac
  fi
}

summary() {
  step "Done"
  local elapsed=$(( $(date +%s) - START ))
  ok "deployed ${PUSHED_SHA:0:8} in ${elapsed}s"
  printf "  %s%s%s\n" "$C" "$SITE_URL/" "$X"
}

# ---------------------------------------------------------------------------
# Rollback
# ---------------------------------------------------------------------------
do_rollback() {
  local target="${1:-HEAD}"
  TOTAL=4
  printf "\n%sRolling back%s %s\n" "$B" "$X" "$(git log -1 --oneline "$target")"
  [ -t 0 ] && { printf "  revert this commit? [y/N] "; IFS= read -r a || true; case "$a" in y|Y) ;; *) die "aborted";; esac; }

  step "Revert"
  # A revert, never a reset: pushed history is not rewritten.
  git revert --no-edit "$target" >/dev/null || die "revert failed (conflict?) — resolve manually"
  ok "reverted $(git rev-parse --short "$target")"

  git push -q origin "$BRANCH"
  PUSHED_SHA="$(git rev-parse HEAD)"
  ok "pushed ${PUSHED_SHA:0:8}"

  npm run build --silent >/dev/null 2>&1 || die "build failed after revert"
  watch_run
  verify_live
  summary
}

# ---------------------------------------------------------------------------
# Custom domain
# ---------------------------------------------------------------------------
domain_kind() {
  # Heuristic: 2 labels is an apex; 3 labels is an apex only when the last two
  # form a known multi-part TLD. Printed back so a wrong guess is obvious.
  local d="$1" labels
  labels="$(printf '%s' "$d" | tr '.' '\n' | grep -c .)"
  local last2="${d#*.}"
  case "$last2" in
    co.uk|org.uk|ac.uk|com.au|net.au|org.au|co.nz|co.jp|com.br|co.za) [ "$labels" -eq 3 ] && { echo apex; return; } ;;
  esac
  [ "$labels" -eq 2 ] && echo apex || echo subdomain
}

domain_setup() {
  local domain="${1:-$CUSTOM_DOMAIN}"
  [ -n "$domain" ] || die "no domain given — pass one (--domain-setup example.com) or set CUSTOM_DOMAIN"
  local kind; kind="$(domain_kind "$domain")"

  printf "\n%sConfiguring%s %s%s%s (detected: %s)\n" "$B" "$X" "$C" "$domain" "$X" "$kind"

  # DNS must point at GitHub BEFORE the custom domain is registered. Once it
  # is, GitHub 301s github.io -> the custom domain, so activating early takes
  # the site offline until DNS propagates. Check first, activate second.
  # Ask public resolvers, not just the local one: a stale local cache would
  # otherwise report the old address and block activation indefinitely.
  local resolved pointing=0
  resolved="$( { dig +short "$domain" A;
                 dig @1.1.1.1 +short "$domain" A;
                 dig @8.8.8.8 +short "$domain" A; } 2>/dev/null | sort -u | tr '\n' ' ')"
  for ip in $GH_PAGES_IPS; do
    case " $resolved " in *" $ip "*) pointing=1 ;; esac
  done

  if [ "$pointing" = "0" ]; then
    warn "DNS is not pointing at GitHub Pages yet"
    [ -n "${resolved// /}" ] && info "currently resolves to: $resolved"
    printf "\n%sStep 1 — add these DNS records at your registrar:%s\n\n" "$B" "$X"
    if [ "$kind" = "apex" ]; then
      for ip in $GH_PAGES_IPS;  do printf "    A      @      %s\n" "$ip"; done
      for ip in $GH_PAGES_IPV6; do printf "    AAAA   @      %s\n" "$ip"; done
      printf "\n  %sOptional, so www also works:%s\n" "$DIM" "$X"
      printf "    CNAME  www    %s.github.io\n" "$OWNER"
    else
      printf "    CNAME  %-6s %s.github.io\n" "${domain%%.*}" "$OWNER"
    fi
    cat <<EOF

  ${Y}Leave any MX records alone${X} — they carry email and are unaffected by
  the records above. (This is also why an apex uses A records: a CNAME at the
  apex would collide with MX.)

  ${B}Step 2${X} — once the records are live, re-run:
      ./deploy.sh --domain-setup $domain

  ${DIM}Nothing has been changed yet. The site stays on
  $SITE_URL until DNS is ready.${X}
EOF
    return 0
  fi

  ok "DNS points at GitHub Pages ($resolved)"

  if ! grep -q "^CUSTOM_DOMAIN=\"$domain\"" deploy.conf 2>/dev/null; then
    sed -i.bak "s|^CUSTOM_DOMAIN=.*|CUSTOM_DOMAIN=\"$domain\"|" deploy.conf && rm -f deploy.conf.bak
    ok "deploy.conf updated"
  fi

  gh api -X PUT "repos/$REPO/pages" -f "cname=$domain" >/dev/null 2>&1 \
    && ok "GitHub Pages custom domain set" \
    || warn "could not set via API — set it in Settings > Pages manually"

  printf "\n%sDNS records (for reference):%s\n\n" "$B" "$X"
  if [ "$kind" = "apex" ]; then
    for ip in $GH_PAGES_IPS;  do printf "    A      @      %s\n" "$ip"; done
    for ip in $GH_PAGES_IPV6; do printf "    AAAA   @      %s\n" "$ip"; done
    printf "\n  %sOptional, so www also works:%s\n" "$DIM" "$X"
    printf "    CNAME  www    %s.github.io\n" "$OWNER"
  else
    printf "    CNAME  %-6s %s.github.io\n" "${domain%%.*}" "$OWNER"
  fi

  cat <<EOF

  ${DIM}DNS can take minutes to hours to propagate. GitHub issues the TLS
  certificate only after it resolves, so HTTPS stays unavailable until then —
  that is expected, not a misconfiguration.${X}

  Next:  ./deploy.sh            ${DIM}# ship, so the CNAME file is published${X}
         ./deploy.sh --domain-status  ${DIM}# check progress${X}

  ${Y}Recommended:${X} verify the domain at
  https://github.com/organizations/$OWNER/settings/pages
  so nobody else can claim it if this repo is renamed or deleted.
EOF
}

domain_status() {
  [ -n "$CUSTOM_DOMAIN" ] || die "CUSTOM_DOMAIN is empty — set it in deploy.conf first"
  printf "\n%sDomain status%s for %s%s%s\n\n" "$B" "$X" "$C" "$CUSTOM_DOMAIN" "$X"

  local resolved
  resolved="$( { dig @1.1.1.1 +short "$CUSTOM_DOMAIN" A;
                 dig @8.8.8.8 +short "$CUSTOM_DOMAIN" A; } 2>/dev/null | sort -u | tr '\n' ' ' || true)"
  if [ -n "${resolved// /}" ]; then ok "DNS resolves: $resolved"; else warn "DNS does not resolve yet"; fi

  local cert enforced
  cert="$(gh api "repos/$REPO/pages" --jq '.https_certificate.state // "none"' 2>/dev/null || echo none)"
  enforced="$(gh api "repos/$REPO/pages" --jq '.https_enforced // false' 2>/dev/null || echo false)"

  case "$cert" in
    approved) ok "TLS certificate issued" ;;
    none)     warn "no certificate yet (waiting on DNS)" ;;
    *)        info "certificate state: $cert" ;;
  esac

  if [ "$enforced" = "true" ]; then
    ok "HTTPS enforced"
  elif [ "$cert" = "approved" ]; then
    gh api -X PUT "repos/$REPO/pages" -F https_enforced=true >/dev/null 2>&1 \
      && ok "HTTPS enforcement enabled" \
      || warn "could not enable HTTPS enforcement"
  else
    warn "HTTPS not enforced yet — needs the certificate first"
  fi

  local code
  code="$(curl -s -o /dev/null -m 15 -w '%{http_code}' "https://$CUSTOM_DOMAIN/" 2>/dev/null || true)"
  [ -n "$code" ] || code="000"
  if [ "$code" = "200" ]; then
    ok "https://$CUSTOM_DOMAIN/ serves 200"
  else
    warn "https://$CUSTOM_DOMAIN/ not serving yet (code $code)"
  fi
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
MESSAGE=""; DRY_RUN=0; CHECK_ONLY=0; SKIP_CHECKS=0; ROLLBACK=""; DO_ROLLBACK=0
PUSHED_SHA=""; SKIP_WATCH=0; START="$(date +%s)"

while [ $# -gt 0 ]; do
  case "$1" in
    -m|--message)     MESSAGE="${2:-}"; shift 2 ;;
    --dry-run)        DRY_RUN=1; shift ;;
    --check)          CHECK_ONLY=1; shift ;;
    --skip-checks)    SKIP_CHECKS=1; shift ;;
    --rollback)
      DO_ROLLBACK=1
      case "${2:-}" in
        ""|-*) ROLLBACK="HEAD"; shift ;;
        *)     ROLLBACK="$2";   shift 2 ;;
      esac ;;
    --domain-setup)
      case "${2:-}" in
        ""|-*) domain_setup ;;
        *)     domain_setup "$2" ;;
      esac
      exit 0 ;;
    --domain-status)  domain_status; exit 0 ;;
    -h|--help)        usage; exit 0 ;;
    *)                die "unknown option: $1  (try --help)" ;;
  esac
done

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
printf "%sDeploying%s %s -> %s%s%s\n" "$B" "$X" "$REPO" "$C" "$SITE_URL" "$X"

if [ "$DO_ROLLBACK" = "1" ]; then do_rollback "$ROLLBACK"; exit 0; fi

if [ "$CHECK_ONLY" = "1" ]; then
  TOTAL=2
  step "Build"
  npm run build --silent >/dev/null 2>&1 || die "build failed"
  ok "built locally"
  verify_live
  exit 0
fi

if [ "$DRY_RUN" = "1" ]; then
  TOTAL=1
  preflight
  printf "\n  %sdry run — nothing pushed%s\n" "$DIM" "$X"
  exit 0
fi

TOTAL=5
if [ "$SKIP_CHECKS" = "1" ]; then
  warn "pre-flight skipped"
  TOTAL=4
  npm run build --silent >/dev/null 2>&1 || die "build failed"
else
  preflight
fi

commit_and_push
if [ "$SKIP_WATCH" = "1" ]; then STAGE=$((STAGE+1)); else watch_run; fi
verify_live
summary
