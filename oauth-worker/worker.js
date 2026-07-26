/**
 * GitHub OAuth broker for the CMS.
 *
 * Exists for one reason: GitHub's token endpoint rejects browser requests via
 * CORS, and the client secret must never reach a browser anyway. This Worker
 * holds the secret and performs the exchange server-side.
 *
 * It deliberately does NOT store or log tokens — it hands the token straight to
 * the editor's browser and forgets it.
 *
 * Secrets (set with `wrangler secret put`, never committed):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 * Plain var (wrangler.toml):
 *   ALLOWED_ORIGIN   e.g. https://ynvrsty.com
 */

const AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const TOKEN_URL = 'https://github.com/login/oauth/access_token';

const html = (body, status = 200) =>
  new Response(`<!DOCTYPE html><meta charset="utf-8">${body}`, {
    status,
    headers: { 'content-type': 'text/html;charset=UTF-8', 'cache-control': 'no-store' },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirectUri = `${url.origin}/callback`;

    if (url.pathname === '/auth') {
      // `state` is a CSRF token: we hand it to GitHub and require it back,
      // stored meanwhile in an httpOnly cookie the browser cannot read.
      const state = crypto.randomUUID();
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: redirectUri,
        // `repo` is needed to commit and to open pull requests.
        scope: 'repo,user:email',
        state,
      });
      return new Response(null, {
        status: 302,
        headers: {
          location: `${AUTHORIZE_URL}?${params}`,
          'set-cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
          'cache-control': 'no-store',
        },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookie = request.headers.get('cookie') || '';
      const expected = cookie.match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1];

      if (!code) return html('<p>Missing <code>code</code>.</p>', 400);
      if (!state || !expected || state !== expected) {
        return html('<p>Invalid state — possible CSRF. Start the login again.</p>', 400);
      }

      const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          'user-agent': 'cmf-cms-oauth',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });

      const data = await res.json();
      if (!data.access_token) {
        // Never echo the raw response — it can contain sensitive detail.
        return html(`<p>Token exchange failed: ${escapeHtml(data.error || 'unknown error')}</p>`, 502);
      }

      const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
      const allowed = env.ALLOWED_ORIGIN;

      // The CMS opens this page in a popup, sends a handshake, then expects the
      // credentials back. We post ONLY to the configured origin — replying to
      // e.origin instead would let any site that opened this page steal a token
      // with write access to the repo.
      return html(`
<title>Signing in…</title>
<p>Completing sign-in…</p>
<script>
(function () {
  var allowed = ${JSON.stringify(allowed)};
  function onMessage(e) {
    if (e.origin !== allowed) return;
    window.opener.postMessage(
      'authorization:github:success:' + ${JSON.stringify(payload)},
      allowed
    );
    window.removeEventListener('message', onMessage);
  }
  window.addEventListener('message', onMessage, false);
  if (window.opener) {
    window.opener.postMessage('authorizing:github', allowed);
  } else {
    document.body.innerHTML = '<p>Open this from the CMS, not directly.</p>';
  }
})();
</script>`);
    }

    return html('<p>CMF CMS OAuth broker. Nothing to see here.</p>', 404);
  },
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
