// publish.jsx — GitHub sign-in and publishing for the inline editor.
//
// The editor writes to the store (and localStorage) as you type. Publishing
// takes a snapshot, works out which files under content/ actually changed, and
// opens a pull request with just those.
//
// No credential is stored anywhere: the token lives in memory for the session
// and is obtained through the OAuth broker (see docs/cms-setup.md).

const CMS = (typeof window !== 'undefined' && window.__CMS__) || {};
const API = 'https://api.github.com';

/* ---------- split: mirror of scripts/merge-content.js, in reverse ---------- */
// Must stay in step with that script — it is the inverse operation.
function splitContent(data) {
  const files = {
    'content/settings.json': { brand: data.brand, nav: data.nav, footer: data.footer },
    'content/home.json': data.home,
    'content/pages.json': data.pages,
  };
  (data.programs || []).forEach((p, i) => {
    files[`content/programs/${p.id}.json`] = { order: i, ...p };
  });
  (data.projects || []).forEach((p, i) => {
    files[`content/projects/${p.id}.json`] = { order: i, ...p };
  });
  return files;
}

const serialise = (obj) => JSON.stringify(obj, null, 2) + '\n';

// btoa cannot handle multi-byte characters; the content is full of them (—, ·).
function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

/* ---------- OAuth ---------- */
// Popup handshake used by the broker: we post a hello, it replies with the
// token. Same protocol Decap and Sveltia use, so the broker is unmodified.
function signInWithGitHub() {
  return new Promise((resolve, reject) => {
    if (!CMS.broker) return reject(new Error('No OAuth broker configured.'));

    const w = 700, h = 800;
    const popup = window.open(
      `${CMS.broker}/auth?provider=github&site_id=${encodeURIComponent(location.hostname)}&scope=repo`,
      'github-signin',
      `width=${w},height=${h},left=${(screen.width - w) / 2},top=${(screen.height - h) / 2}`
    );
    if (!popup) return reject(new Error('Popup blocked — allow popups and try again.'));

    const brokerOrigin = new URL(CMS.broker).origin;
    let done = false;

    // Handshake, in order:
    //   1. the popup announces  'authorizing:github'  to us
    //   2. we must echo it back — the popup is waiting for that
    //   3. the popup then sends 'authorization:github:success:{...}'
    // Skipping step 2 leaves the popup sitting on a blank page forever.
    const onMessage = (e) => {
      if (e.origin !== brokerOrigin) return;      // ignore anything not from the broker
      if (typeof e.data !== 'string') return;

      if (e.data === 'authorizing:github') {
        popup.postMessage('authorizing:github', brokerOrigin);
        return;
      }

      const ok = e.data.match(/^authorization:github:success:(.+)$/);
      const err = e.data.match(/^authorization:github:error:(.+)$/);
      if (!ok && !err) return;

      done = true;
      cleanup();
      try { popup.close(); } catch (_) {}

      if (err) {
        let msg = err[1];
        try { msg = JSON.parse(err[1]).error || msg; } catch (_) {}
        return reject(new Error(msg));
      }
      try { resolve(JSON.parse(ok[1]).token); }
      catch (_) { reject(new Error('Could not read the sign-in response.')); }
    };

    const cleanup = () => {
      window.removeEventListener('message', onMessage);
      clearInterval(poll);
      clearTimeout(timer);
    };

    window.addEventListener('message', onMessage);

    const poll = setInterval(() => {
      if (done) { clearInterval(poll); return; }
      if (popup.closed) { cleanup(); reject(new Error('Sign-in window was closed.')); }
    }, 500);

    // Never hang silently on a blank popup.
    const timer = setTimeout(() => {
      if (done) return;
      cleanup();
      try { popup.close(); } catch (_) {}
      reject(new Error('Sign-in timed out. Check the callback URL on the OAuth App is exactly ' + CMS.broker + '/callback'));
    }, 120000);
  });
}

/* ---------- GitHub API ---------- */
async function gh(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message || ''; } catch (_) {}
    throw new Error(`GitHub ${res.status}${detail ? ': ' + detail : ''} (${path})`);
  }
  return res.status === 204 ? null : res.json();
}

async function whoAmI(token) {
  const u = await gh(token, '/user');
  return u.login;
}

/**
 * Commit the changed content files on a new branch and open a pull request.
 * Returns the PR url, or null when nothing changed.
 */
async function publishChanges(token, current, baseline, onProgress = () => {}) {
  const repo = CMS.repo;
  const base = CMS.branch || 'master';

  const nowFiles = splitContent(current);
  const wasFiles = splitContent(baseline);

  const changed = Object.keys(nowFiles).filter(
    (p) => serialise(nowFiles[p]) !== serialise(wasFiles[p])
  );
  const removed = Object.keys(wasFiles).filter((p) => !(p in nowFiles));

  if (!changed.length && !removed.length) return null;

  onProgress(`Preparing ${changed.length} file${changed.length === 1 ? '' : 's'}…`);

  const baseRef = await gh(token, `/repos/${repo}/git/ref/heads/${base}`);
  const branch = `content/${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;

  await gh(token, `/repos/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseRef.object.sha }),
  });

  for (const [i, path] of changed.entries()) {
    onProgress(`Committing ${i + 1}/${changed.length}…`);
    // The file may not exist yet (a newly added program), so a missing sha is
    // not an error — it just means "create" rather than "update".
    let sha;
    try {
      const existing = await gh(token, `/repos/${repo}/contents/${path}?ref=${branch}`);
      sha = existing.sha;
    } catch (_) { /* new file */ }

    await gh(token, `/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `content: update ${path.replace('content/', '')}`,
        content: b64(serialise(nowFiles[path])),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });
  }

  for (const path of removed) {
    const existing = await gh(token, `/repos/${repo}/contents/${path}?ref=${branch}`);
    await gh(token, `/repos/${repo}/contents/${path}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `content: remove ${path.replace('content/', '')}`,
        sha: existing.sha,
        branch,
      }),
    });
  }

  onProgress('Opening pull request…');
  const summary = changed.concat(removed).map((p) => `- \`${p}\``).join('\n');
  const pr = await gh(token, `/repos/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: `Content update — ${new Date().toLocaleDateString('en-GB')}`,
      head: branch,
      base,
      body: `Edited on the live site with the inline editor.\n\n**Files changed**\n${summary}\n`,
    }),
  });

  return pr.html_url;
}

Object.assign(window, { signInWithGitHub, publishChanges, whoAmI, splitContent, CMS_CONFIG: CMS });
