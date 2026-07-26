# CMS OAuth broker

A ~90-line Cloudflare Worker whose only job is to exchange a GitHub OAuth code
for a token. It exists because GitHub's token endpoint refuses browser requests
(CORS), and because the client secret must never be shipped to a browser.

It stores nothing and logs nothing.

## One-time setup

**1. Create a GitHub OAuth App** — https://github.com/settings/developers → *New OAuth App*

| Field | Value |
|---|---|
| Application name | `CMF content editor` |
| Homepage URL | `https://ynvrsty.com` |
| Authorization callback URL | `https://cmf-cms-oauth.<your-subdomain>.workers.dev/callback` |

You get a **Client ID**, then *Generate a new client secret*.

You won't know the Worker URL until step 2, so put a placeholder in and come
back and correct it — the callback URL must match exactly or GitHub refuses.

**2. Deploy the Worker**

```sh
cd oauth-worker
npx wrangler login
npx wrangler deploy
```

That prints the Worker URL. Go fix the callback URL in the OAuth App now.

**3. Set the secrets** (they live in Cloudflare, never in git)

```sh
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

**4. Point the site at the broker** — in `deploy.conf`:

```sh
OAUTH_BROKER="https://cmf-cms-oauth.<your-subdomain>.workers.dev"
```

Then `./deploy.sh`. The build substitutes this into `admin/config.yml` and the
admin page's CSP.

## Checking it

`https://ynvrsty.com/admin/` → *Login with GitHub*. A popup opens, you approve,
it closes, and the editor loads.

Editing anything and pressing publish opens a **pull request** — nothing reaches
the live site until that PR is approved and merged.

## Why the scopes are what they are

`repo` is required to commit and to open pull requests. GitHub has no narrower
scope that permits writing to a single repository via a classic OAuth App —
which is precisely why the token belongs to the individual editor and their own
permissions apply, rather than being a shared credential.
