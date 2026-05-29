// admin.jsx — admin login gate, toolbar, export/import
const { useState: useAS, useRef: useAR } = React;

function AdminLogin() {
  const admin = useAdmin();
  const [pw, setPw] = useAS('');
  const [err, setErr] = useAS(false);
  const submit = (e) => {
    e.preventDefault();
    if (admin.login(pw)) { window.location.hash = '#/'; }
    else { setErr(true); setPw(''); }
  };
  return (
    <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span className="eyebrow">/ Admin</span>
          <h1 className="h-display h2" style={{ margin: '16px 0 10px' }}>Content editor</h1>
          <p className="muted" style={{ fontSize: 14 }}>Sign in to edit the live content of this site.</p>
        </div>
        <form onSubmit={submit} style={{ border: '1px solid var(--border)', borderRadius: 4, padding: 32, background: 'rgba(14,27,54,0.5)' }}>
          <label style={{ display: 'block' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>Password</div>
            <input
              type="password" value={pw} autoFocus
              onChange={(e) => { setPw(e.target.value); setErr(false); }}
              placeholder="Enter admin password"
              style={{ width: '100%', background: 'rgba(10,22,40,0.6)', border: `1px solid ${err ? '#c0563a' : 'var(--border)'}`, color: 'var(--text)', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 15, borderRadius: 2, outline: 'none' }} />
          </label>
          {err && <div style={{ color: '#e08a6a', fontSize: 13, marginTop: 10, fontFamily: 'var(--font-mono)' }}>Incorrect password.</div>}
          <button type="submit" className="btn btn-gold" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}>Sign in <IconArrow /></button>
          <p className="muted" style={{ fontSize: 12, marginTop: 18, lineHeight: 1.5, textAlign: 'center' }}>
            Demo password: <span className="mono" style={{ color: 'var(--gold)' }}>{ADMIN_PASSWORD}</span><br/>
            This is a client-side gate for prototyping — not real authentication.
          </p>
        </form>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="#/" className="back-link">← Back to site</a>
        </div>
      </div>
    </section>
  );
}

function AdminBar() {
  const admin = useAdmin();
  const fileRef = useAR(null);
  const [saved, setSaved] = useAS(false);

  if (!admin || !admin.authed) return null;

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(store.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cmf-content.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        store.replaceAll(obj);
        setSaved(true); setTimeout(() => setSaved(false), 1500);
      } catch (err) { alert('Invalid JSON file.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };
  const resetAll = () => { if (confirm('Reset ALL content to defaults? This discards every edit.')) store.reset(); };

  return (
    <div className={`admin-bar ${admin.editing ? 'is-editing' : ''}`}>
      <div className="admin-bar-inner">
        <div className="admin-brand">
          <span className="admin-dot" />
          <b>CMF Admin</b>
          <span className="admin-hint">{admin.editing ? 'Editing — click any text to change it' : 'Preview mode'}</span>
        </div>
        <div className="admin-actions">
          <button className={`admin-toggle ${admin.editing ? 'on' : ''}`} onClick={() => admin.setEditing(!admin.editing)}>
            <span className="admin-toggle-knob" />
            {admin.editing ? 'Edit ON' : 'Edit OFF'}
          </button>
          <button className="admin-btn" onClick={exportJSON} title="Download content as JSON">Export</button>
          <button className="admin-btn" onClick={() => fileRef.current && fileRef.current.click()} title="Load content from JSON">Import</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={importJSON} style={{ display: 'none' }} />
          <button className="admin-btn warn" onClick={resetAll} title="Reset to default content">Reset</button>
          <button className="admin-btn" onClick={admin.logout} title="Exit admin">Log out</button>
          {saved && <span className="admin-saved">Loaded ✓</span>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminLogin, AdminBar });
