#!/usr/bin/env bash
#
# build.sh — compile the site into plain JS/CSS in dist/
#
# The sources are classic scripts sharing one global scope (no import/export).
# This concatenates them in the order index.html loads them, hands the result
# to esbuild as a single unit, and bundles React in. Root index.html is left
# working as-is for local dev, so you can still just open it in a browser.
#
set -euo pipefail
cd "$(dirname "$0")"

ROOT="$(pwd)"
BUILD=".build"
OUT="dist"

[ -f deploy.conf ] && . ./deploy.conf
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-}"

ESBUILD="node_modules/.bin/esbuild"
if [ ! -x "$ESBUILD" ]; then
  echo "error: esbuild not found — run 'npm ci' first" >&2
  exit 1
fi

rm -rf "$OUT" "$BUILD"
mkdir -p "$OUT" "$BUILD"

# ---------------------------------------------------------------------------
# 1. Source list, taken from index.html so it cannot drift out of sync.
# ---------------------------------------------------------------------------
# (read loop rather than mapfile — macOS ships bash 3.2, which lacks it)
SOURCES=()
while IFS= read -r line; do
  [ -n "$line" ] && SOURCES+=("$line")
done < <(
  awk '/<!-- build:js -->/,/<!-- \/build:js -->/' index.html \
    | grep 'type="text/babel"' \
    | sed -E 's/.*src="([^"]+)".*/\1/'
)

if [ "${#SOURCES[@]}" -eq 0 ]; then
  echo "error: no text/babel sources found between the build:js markers" >&2
  exit 1
fi
echo "  sources: ${SOURCES[*]}"

for f in "${SOURCES[@]}"; do
  [ -f "$f" ] || { echo "error: index.html references missing file: $f" >&2; exit 1; }
done

# ---------------------------------------------------------------------------
# 2. Re-export onto window anything that a classic script would have put there.
#
# In a classic script a top-level `function Foo(){}` becomes window.Foo for
# free; inside a bundle it does not. Today every such name is already assigned
# explicitly in the sources (window.Landing = Landing, etc.), so this is a
# no-op safety net rather than a fix — but it means a future file that relies
# on the old auto-global behaviour won't silently render undefined.
#
# Intersection of "declared at top level" and "mentioned as window.X".
# ---------------------------------------------------------------------------
DECLARED="$(cat "${SOURCES[@]}" | grep -oE '^(function|const|let|var|class) +[A-Za-z0-9_$]+' | awk '{print $2}' | sort -u)"
WINDOW_READS="$(cat "${SOURCES[@]}" | grep -ohE 'window\.[A-Za-z_$][A-Za-z0-9_$]*' | sed 's/^window\.//' | sort -u)"
EXPORTS="$(comm -12 <(echo "$DECLARED") <(echo "$WINDOW_READS") | tr '\n' ' ')"

if [ -n "${EXPORTS// /}" ]; then
  echo "  window exports: $EXPORTS"
fi

# ---------------------------------------------------------------------------
# 3. Assemble the entry point.
# ---------------------------------------------------------------------------
ENTRY="$BUILD/app.jsx"
{
  # react-dom/client because app.jsx calls ReactDOM.createRoot (React 18).
  echo 'import * as React from "react";'
  echo 'import * as ReactDOM from "react-dom/client";'
  echo
  for f in "${SOURCES[@]}"; do
    echo "// ---- $f ----"
    cat "$f"
    echo
  done
  if [ -n "${EXPORTS// /}" ]; then
    echo "// ---- generated: preserve classic-script window globals ----"
    echo "Object.assign(window, { $(echo "$EXPORTS" | sed 's/ *$//' | tr ' ' ',' | sed 's/,/, /g') });"
  fi
} > "$ENTRY"

# ---------------------------------------------------------------------------
# 4. Bundle.
#
# --define process.env.NODE_ENV is what selects React's production build and
# lets dead-code elimination strip the dev-only paths; without it the bundle
# both breaks at runtime and stays ~1MB.
# --jsx=transform (classic) because content.js already calls React.createElement.
# ---------------------------------------------------------------------------
# esbuild reports positions in the concatenated entry file, which is useless
# for debugging. Translate them back to the original source and line.
remap_errors() {
  awk -v entry="$ENTRY" '
    BEGIN {
      while ((getline line < entry) > 0) {
        ln++
        if (line ~ /^\/\/ ---- .* ----$/) {
          f = line; sub(/^\/\/ ---- /, "", f); sub(/ ----$/, "", f)
          n++; mline[n] = ln; mfile[n] = f
        }
      }
    }
    {
      while (match($0, /\.build\/app\.jsx:[0-9]+:[0-9]+/)) {
        tok = substr($0, RSTART, RLENGTH)
        split(tok, p, ":"); L = p[2]; C = p[3]
        src = "?"; rel = L
        for (i = 1; i <= n; i++) if (mline[i] < L) { src = mfile[i]; rel = L - mline[i] }
        $0 = substr($0, 1, RSTART-1) src ":" rel ":" C substr($0, RSTART+RLENGTH)
      }
      print
    }
  '
}

if ! "$ESBUILD" "$ENTRY" \
  --bundle \
  --minify \
  --format=iife \
  --jsx=transform \
  --target=es2018 \
  --define:process.env.NODE_ENV='"production"' \
  --entry-names='[name].[hash]' \
  --outdir="$OUT" \
  --log-level=warning 2> "$BUILD/esbuild.err"
then
  remap_errors < "$BUILD/esbuild.err" >&2
  echo >&2
  echo "  (line numbers above are mapped back to the original source files;" >&2
  echo "   the code frames come from the concatenated $ENTRY)" >&2
  exit 1
fi

"$ESBUILD" styles.css \
  --minify \
  --entry-names='[name].[hash]' \
  --outdir="$OUT" \
  --log-level=warning

JS_FILE="$(cd "$OUT" && ls app.*.js)"
CSS_FILE="$(cd "$OUT" && ls styles.*.css)"

# ---------------------------------------------------------------------------
# 5. Generate dist/index.html by swapping the marked blocks.
# ---------------------------------------------------------------------------
# Production CSP: no 'unsafe-eval' and no unpkg, since nothing is transpiled or
# fetched at runtime any more. 'unsafe-inline' stays in style-src only because
# the components use style={{...}}, which React renders as inline attributes.
# Note: frame-ancestors is deliberately absent — browsers ignore it in a meta
# tag, and GitHub Pages cannot set real HTTP headers.
CSP="default-src 'self'; \
script-src 'self' https://cdn.jsdelivr.net; \
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; \
font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; \
img-src 'self' data:; \
connect-src 'self'; \
base-uri 'self'; \
form-action 'self'; \
object-src 'none'"

awk -v js="$JS_FILE" -v css="$CSS_FILE" -v csp="$CSP" '
  /<!-- build:css -->/ { print "  <link rel=\"stylesheet\" href=\"" css "\" />"; skip=1; next }
  /<!-- \/build:css -->/ { skip=0; next }
  /<!-- build:js -->/ { print "  <script src=\"" js "\" defer></script>"; skip=1; next }
  /<!-- \/build:js -->/ { skip=0; next }
  /<!-- build:csp -->/ { print "  <meta http-equiv=\"Content-Security-Policy\" content=\"" csp "\" />"; skip=1; next }
  /<!-- \/build:csp -->/ { skip=0; next }
  !skip { print }
' index.html > "$OUT/index.html"

# ---------------------------------------------------------------------------
# 6. Static assets. screenshots/ and uploads/ are deliberately excluded —
#    ~3MB the site never references.
# ---------------------------------------------------------------------------
cp -R assets "$OUT/assets"

# content.json is the CMS-edited source of truth, fetched at runtime.
[ -f content.json ] || { echo "error: content.json missing" >&2; exit 1; }
node -e 'JSON.parse(require("fs").readFileSync("content.json","utf8"))' \
  || { echo "error: content.json is not valid JSON" >&2; exit 1; }
cp content.json "$OUT/content.json"

if [ -n "$CUSTOM_DOMAIN" ]; then
  echo "$CUSTOM_DOMAIN" > "$OUT/CNAME"
  echo "  CNAME: $CUSTOM_DOMAIN"
fi

rm -rf "$BUILD"

# ---------------------------------------------------------------------------
# 7. Summary.
# ---------------------------------------------------------------------------
human() { awk -v b="$1" 'BEGIN{ if(b>1048576) printf "%.1fMB",b/1048576; else printf "%.0fKB",b/1024 }'; }
js_raw=$(wc -c < "$OUT/$JS_FILE"); js_gz=$(gzip -c "$OUT/$JS_FILE" | wc -c)
css_raw=$(wc -c < "$OUT/$CSS_FILE"); css_gz=$(gzip -c "$OUT/$CSS_FILE" | wc -c)

echo
printf "  %-22s %8s raw  %8s gzipped\n" "$JS_FILE"  "$(human $js_raw)"  "$(human $js_gz)"
printf "  %-22s %8s raw  %8s gzipped\n" "$CSS_FILE" "$(human $css_raw)" "$(human $css_gz)"
printf "  %-22s %8s raw  %8s gzipped\n" "total" "$(human $((js_raw+css_raw)))" "$(human $((js_gz+css_gz)))"
echo
echo "  built -> $OUT/"
