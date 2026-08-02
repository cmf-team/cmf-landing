# CMS setup

The content editor at <https://cmf.ynvrsty.com/admin/> edits `content.json` and opens
a **pull request** for every change — nothing reaches the live site unreviewed.

> This site lives on the `cmf.` subdomain, not the apex. `ynvrsty.com` is a
> separate site in [`cmf-team/ynvrsty-home`](https://github.com/cmf-team/ynvrsty-home),
> because a GitHub Pages repository can claim only one custom domain. Anywhere
> below that names a domain, the subdomain is the one that matters.

Signing in needs one piece of server-side code: GitHub's token endpoint refuses
browser requests (CORS), and the OAuth client secret must never reach a browser.
We use [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth),
the project's official Cloudflare Worker, rather than a hand-rolled one.

Do the steps in this order — step 2 needs the URL from step 1.

---

## 1. Deploy the authenticator Worker

Open <https://github.com/sveltia/sveltia-cms-auth> and use the **Deploy to
Cloudflare** button (or clone it and run `npx wrangler deploy`).

Note the resulting URL from the Cloudflare dashboard:

```
https://sveltia-cms-auth.<your-subdomain>.workers.dev
```

Call this `<WORKER_URL>` below.

## 2. Create the GitHub OAuth App — in the organization

<https://github.com/organizations/cmf-team/settings/applications> → **New OAuth App**

| Field | Value |
|---|---|
| Application name | `CMF content editor` |
| Homepage URL | `https://cmf.ynvrsty.com` |
| Authorization callback URL | `<WORKER_URL>/callback` |

The callback must match **exactly**, including `/callback` — a mismatch is the
most common failure, and GitHub's error message doesn't say so clearly.

Create it, then **Generate a new client secret**. Copy both values now; the
secret is only shown once.

> Create it under the organization, not your personal account. The site is org
> infrastructure — a personal app is orphaned if that account changes hands, and
> no one else can rotate the secret. Note that org ownership does not restrict
> *who* can sign in; access comes from each user's own repo permissions.

## 3. Configure the Worker

Cloudflare dashboard → Workers → `sveltia-cms-auth` → **Settings → Variables**:

| Name | Type | Value |
|---|---|---|
| `GITHUB_CLIENT_ID` | plain text | from step 2 |
| `GITHUB_CLIENT_SECRET` | **encrypted** | from step 2 |
| `ALLOWED_DOMAINS` | plain text | `cmf.ynvrsty.com` |

`ALLOWED_DOMAINS` matters: without it the Worker will hand a token to any origin
that opens the popup. That token can write to the repo, and this repo deploys to
production automatically — so treat it as required, not optional.

Mark the secret as **Encrypt**, not plain text.

## 4. Point the site at the Worker

In `deploy.conf`:

```sh
OAUTH_BROKER="https://sveltia-cms-auth.<your-subdomain>.workers.dev"
```

Then `./deploy.sh`. The build substitutes it into `admin/config.yml` and into the
admin page's CSP `connect-src`.

## 5. Check it end to end

1. <https://cmf.ynvrsty.com/admin/> → **Sign In with GitHub** → approve in the popup
2. Edit any field, then **Save**
3. A PR appears at <https://github.com/cmf-team/cmf-landing/pulls>
4. Approve and merge it
5. The deploy workflow runs and the change is live in ~35s

## Editing without any of this

Sveltia can edit your local checkout directly through the browser's file system
API — no Worker, no OAuth. Open `/admin/`, click **Work with Local Repository**,
select the repo folder, edit, then `./deploy.sh`.

Only useful on a machine with the repo cloned; the Worker is what lets other
editors work from anywhere.

---

## How content is stored

`content/` is the source of truth and what the CMS edits:

```
content/
  settings.json        brand, navigation, footer
  home.json            the home page
  pages.json           about / contact / apply / index pages
  programs/*.json      one file per program   -> "Programs" collection
  projects/*.json      one file per project   -> "Projects" collection
```

`content.json` at the repo root is a **build artifact** (gitignored) — the
build merges `content/` into it so the site still fetches a single file.
Never edit it; your changes will be overwritten.

Programs and projects are separate files so the CMS can offer real collections:
a browsable list, create, duplicate, delete. Site ordering comes from the
`order` field on each entry (lower first); the merge strips it before the site
sees it.

## Changing the content structure

`admin/config.yml` is generated, not hand-written, so the schema cannot
silently drift from the data — a misnamed field doesn't error, it just drops
that content on save.

After changing the *shape* of content (new keys, not new values):

```sh
node scripts/gen-cms-schema.js > admin/config.yml
```
