// admin.jsx — sign-in gate and the editing toolbar.
//
// Editing happens inline on the real page (see F/ItemControls/AddItem in
// content.js). This file is just the way in and the way out: sign in with
// GitHub, toggle editing, publish as a pull request.
const { useState: useAS, useRef: useAR } = React;

function AdminLogin() {
  const admin = useAdmin();
  const [busy, setBusy] = useAS(false);
  const [err, setErr] = useAS('');

  const go = async () => {
    setBusy(true); setErr('');
    try {
      await admin.signIn();
      window.location.hash = '#/';
    } catch (e) {
      setErr(e.message || 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="eyebrow">/ Admin</span>
          <h1 className="h-display h2" style={{ margin: '16px 0 10px' }}>Content editor</h1>
          <p className="muted" style={{ fontSize: 14 }}>
            Sign in with GitHub to edit this site. Your changes are published as a
            pull request for review.
          </p>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 4, padding: 32, background: 'rgba(14,27,54,0.5)' }}>
          <button onClick={go} disabled={busy} className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}>
            {busy ? 'Waiting for GitHub…' : 'Sign in with GitHub'} <IconArrow />
          </button>

          {err && (
            <div style={{ color: '#e08a6a', fontSize: 13, marginTop: 14, fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
              {err}
            </div>
          )}

          <p className="muted" style={{ fontSize: 12, marginTop: 18, lineHeight: 1.6, textAlign: 'center' }}>
            You need write access to <span className="mono">{(window.__CMS__ || {}).repo}</span>.
            Nothing is stored in your browser — the sign-in lasts for this tab only.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="#/" className="back-link">← Back to site</a>
        </div>
      </div>
    </section>
  );
}

function AdminBar() {
  const admin = useAdmin();
  const [status, setStatus] = useAS(null);   // {kind, text, url}
  const [busy, setBusy] = useAS(false);

  if (!admin || !admin.authed) return null;

  const dirty = admin.hasChanges();

  const doPublish = async () => {
    setBusy(true);
    setStatus({ kind: 'busy', text: 'Starting…' });
    try {
      const url = await admin.publish((text) => setStatus({ kind: 'busy', text }));
      if (!url) {
        setStatus({ kind: 'info', text: 'Nothing to publish — no changes yet.' });
      } else {
        admin.markPublished();
        setStatus({ kind: 'ok', text: 'Pull request opened', url });
      }
    } catch (e) {
      setStatus({ kind: 'err', text: e.message || 'Publish failed.' });
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    if (confirm('Discard all local edits and reload the published content?')) {
      store.reset();
      location.reload();
    }
  };

  return (
    <div className={`admin-bar ${admin.editing ? 'is-editing' : ''}`}>
      <div className="admin-bar-inner">
        <div className="admin-brand">
          <span className="admin-dot" />
          <b>CMF Editor</b>
          <span className="admin-hint">
            {admin.editing
              ? 'Click any text to change it · use ↑ ↓ ✕ on cards'
              : 'Preview mode — turn editing on to make changes'}
          </span>
        </div>

        <div className="admin-actions">
          <button className={`admin-toggle ${admin.editing ? 'on' : ''}`}
                  onClick={() => admin.setEditing(!admin.editing)}>
            <span className="admin-toggle-knob" />
            {admin.editing ? 'Editing' : 'Preview'}
          </button>

          <button className="admin-btn publish" onClick={doPublish} disabled={busy || !dirty}
                  title={dirty ? 'Open a pull request with your changes' : 'No changes to publish'}>
            {busy ? 'Publishing…' : dirty ? 'Publish' : 'Published'}
          </button>

          {dirty && !busy && (
            <button className="admin-btn warn" onClick={discard} title="Throw away local edits">
              Discard
            </button>
          )}

          <span className="admin-user muted" style={{ fontSize: 12 }}>@{admin.user}</span>
          <button className="admin-btn" onClick={admin.logout} title="Sign out">Sign out</button>
        </div>
      </div>

      {status && (
        <div className={`admin-status ${status.kind}`}>
          {status.text}
          {status.url && (
            <> — <a href={status.url} target="_blank" rel="noopener noreferrer">review and merge →</a></>
          )}
          <button className="admin-status-x" onClick={() => setStatus(null)} title="Dismiss">✕</button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { AdminLogin, AdminBar });
