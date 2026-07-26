// app.jsx — hash router + index pages + admin shell + boot

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash.replace(/^#\/?/, '') || '');
  useEffect(() => {
    const onChange = () => setRoute(window.location.hash.replace(/^#\/?/, '') || '');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

// ----- index pages -----
function ProgramsIndex() {
  const programs = useList('programs');
  const editing = useEditing();
  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <F as="span" className="eyebrow" path="pages.programsIndex.eyebrow" />
          <F as="h1" className="h-display h1" style={{ margin: '18px 0 24px' }} path="pages.programsIndex.title" />
          <F as="p" className="lede" style={{ fontSize: 18, maxWidth: '64ch' }} path="pages.programsIndex.lede" multiline />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="programs-grid">
            {programs.map((p, i) => <ProgramCard key={p.id} p={p} i={i} />)}
          </div>
          {editing && <AddItem path="programs" label="Add program" template={newProgram} />}
        </div>
      </section>
    </>
  );
}

function PortfolioIndex() {
  const projects = useList('projects');
  const editing = useEditing();
  const [filter, setFilter] = useState('All');
  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags || [])))].slice(0, 7);
  const filtered = filter === 'All' ? projects : projects.filter(p => (p.tags || []).includes(filter));
  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <F as="span" className="eyebrow" path="pages.portfolioIndex.eyebrow" />
          <F as="h1" className="h-display h1" style={{ margin: '18px 0 24px' }} path="pages.portfolioIndex.title" />
          <F as="p" className="lede" style={{ fontSize: 18, maxWidth: '64ch', marginBottom: 36 }} path="pages.portfolioIndex.lede" multiline />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {allTags.map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className="btn btn-sm"
                style={{
                  background: filter === t ? 'var(--gold)' : 'transparent',
                  color: filter === t ? '#1A0E00' : 'var(--text-dim)',
                  borderColor: filter === t ? 'var(--gold)' : 'var(--border-strong)',
                  border: '1px solid',
                }}>{t}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="portfolio-grid">
            {filtered.map((p) => {
              const i = projects.findIndex(x => x.id === p.id);
              return <ProjectCard key={p.id} p={p} i={i} />;
            })}
          </div>
          {editing && filter === 'All' && <AddItem path="projects" label="Add project" template={newProject} />}
        </div>
      </section>
    </>
  );
}

function About() {
  const a = useField('pages.about');
  const editing = useEditing();
  const stats = useList('pages.about.stats');
  const info = useList('pages.about.info');
  const schools = useList('pages.about.schools');
  const participate = useList('pages.about.participate');

  return (
    <>
      {/* HERO with mission quote on the right */}
      <section className="page-hero">
        <FormulasBg density="med" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <div className="split-hero" style={{ alignItems: 'flex-start' }}>
            <div>
              <F as="span" className="eyebrow" path="pages.about.eyebrow" />
              <F as="h1" className="h-display h1" style={{ margin: '18px 0 24px' }} path="pages.about.title" />
              <F as="p" className="lede" style={{ fontSize: 19, marginBottom: 24 }} path="pages.about.lede1" multiline />
              <F as="p" className="lede" path="pages.about.lede2" multiline />
            </div>
            <aside className="mission-quote">
              <div className="quote-mark">&ldquo;</div>
              <F as="p" path="pages.about.quote" multiline />
              <div className="quote-attr">
                <div className="quote-attr-dash" />
                <F as="span" path="pages.about.quoteAttr" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-tight">
        <div className="container">
          <div className="stats">
            {stats.map((s, i) => (
              <div className="stat cms-rel" key={i}>
                <ItemControls path="pages.about.stats" index={i} count={stats.length} />
                <div className="stat-num"><F as="span" className={s.gold ? 'g' : ''} path={`pages.about.stats.${i}.num`} /></div>
                <F as="div" className="stat-label" path={`pages.about.stats.${i}.label`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CMF Team — 2-col with info card */}
      <section className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <F as="span" className="eyebrow" style={{ display: 'block', marginBottom: 16 }} path="pages.about.teamEyebrow" />
              <F as="h2" className="h-display h2" style={{ marginBottom: 28 }} path="pages.about.teamHeading" multiline />
              <F as="p" className="lede" style={{ marginBottom: 22 }} path="pages.about.teamP1" multiline />
              <F as="p" className="lede" path="pages.about.teamP2" multiline />
            </div>
            <div className="info-card">
              <div className="info-card-head"><F path="pages.about.infoHead" /></div>
              {info.map((row, i) => (
                <div className="info-row cms-rel" key={i}>
                  <ItemControls path="pages.about.info" index={i} count={info.length} vertical />
                  <F as="span" className="info-key" path={`pages.about.info.${i}.k`} />
                  <F as="span" className="info-val" path={`pages.about.info.${i}.v`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALL SCHOOLS */}
      <section className="section" style={{ background: 'rgba(14,27,54,0.4)' }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <F as="span" className="eyebrow" path="pages.about.schoolsEyebrow" />
              <F as="h2" className="h-display h2" path="pages.about.schoolsHeading" multiline />
            </div>
            <F as="p" className="lede" path="pages.about.schoolsLede" multiline />
          </div>
          <div className="schools-strip">
            {schools.map((s, i) => (
              <a key={i} href={s.href} className={`school-chip cms-rel ${s.status === 'Upcoming' ? 'upcoming' : ''}`}
                 onClick={editing ? (e) => e.preventDefault() : undefined}>
                <ItemControls path="pages.about.schools" index={i} count={schools.length} vertical />
                <div className="school-chip-head">
                  <F as="span" className="school-chip-tag" path={`pages.about.schools.${i}.tag`} />
                  <F as="span" className="school-chip-status" path={`pages.about.schools.${i}.status`} />
                </div>
                <F as="div" className="school-chip-name" path={`pages.about.schools.${i}.name`} />
              </a>
            ))}
          </div>
          {editing && <AddItem path="pages.about.schools" label="Add school" template={{ name: 'New School', tag: 'TAG', status: 'Active', href: '#/programs' }} />}
        </div>
      </section>

      {/* WAYS TO PARTICIPATE */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <F as="span" className="eyebrow" path="pages.about.participateEyebrow" />
              <F as="h2" className="h-display h2" path="pages.about.participateHeading" multiline />
            </div>
            <F as="p" className="lede" path="pages.about.participateLede" multiline />
          </div>
          <div className="values">
            {participate.map((v, i) => {
              const Ico = ICONS[v.icon] || IconAI;
              return (
                <a className="value participate-card cms-rel" href={v.href} key={i}
                   onClick={editing ? (e) => e.preventDefault() : undefined}>
                  <ItemControls path="pages.about.participate" index={i} count={participate.length} />
                  <div className="value-icon"><Ico /></div>
                  {editing && <PickField path={`pages.about.participate.${i}.icon`} options={ICON_KEYS} />}
                  <F as="h4" path={`pages.about.participate.${i}.title`} />
                  <F as="p" path={`pages.about.participate.${i}.body`} multiline />
                  <F as="span" className="card-link" path={`pages.about.participate.${i}.link`} />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA tail */}
      <section className="section-tight">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <F as="p" className="eyebrow" style={{ display: 'block', marginBottom: 18 }} path="pages.about.ctaEyebrow" />
          <F as="h2" className="h-display h2" style={{ marginBottom: 30 }} path="pages.about.ctaHeading" multiline />
          <div style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#/apply" className="btn btn-gold"><F path="pages.about.cta1" /> <IconArrow /></a>
            <a href="#/contact" className="btn btn-outline"><F path="pages.about.cta2" /></a>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const items = useList('pages.contact.items');
  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <F as="span" className="eyebrow" path="pages.contact.eyebrow" />
          <F as="h1" className="h-display h1" style={{ margin: '18px 0 24px' }} path="pages.contact.title" />
          <F as="p" className="lede" style={{ fontSize: 18, maxWidth: '64ch' }} path="pages.contact.lede" multiline />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              {items.map((it, i) => (
                <div style={{ marginBottom: 36 }} key={i}>
                  <F as="div" className="mono" style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }} path={`pages.contact.items.${i}.k`} />
                  <F as="div" style={{ fontFamily: 'var(--font-display)', fontSize: it.v.includes('\n') ? 16 : 20, fontWeight: 600, lineHeight: 1.5 }} path={`pages.contact.items.${i}.v`} multiline />
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              style={{ border: '1px solid var(--border)', padding: 40, background: 'rgba(14,27,54,0.4)' }}>
              {submitted ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, border: '1.5px solid var(--gold)', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 22px', color: 'var(--gold)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12 L10 18 L20 6" /></svg>
                  </div>
                  <F as="h3" className="h-display h3" style={{ marginBottom: 10 }} path="pages.contact.sent" />
                  <F as="p" className="muted" path="pages.contact.sentBody" />
                </div>
              ) : (
                <>
                  <FormField label="Your name" />
                  <FormField label="Email" type="email" />
                  <FormField label="Organization" />
                  <FormField label="Message" textarea />
                  <button type="submit" className="btn btn-gold" style={{ marginTop: 12 }}>Send message <IconArrow /></button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function FormField({ label, type = 'text', textarea }) {
  return (
    <label style={{ display: 'block', marginBottom: 24 }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10 }}>{label}</div>
      {textarea ? (
        <textarea rows="4" style={fieldStyle} />
      ) : (
        <input type={type} style={fieldStyle} />
      )}
    </label>
  );
}
const fieldStyle = {
  width: '100%',
  background: 'rgba(10,22,40,0.6)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  padding: '12px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  borderRadius: 2,
  outline: 'none',
};

function Apply() {
  const [step, setStep] = useState(0);
  const programs = useList('programs');
  const [track, setTrack] = useState(programs[0] ? programs[0].id : '');
  const tracks = [
    ...programs.map(p => ({ id: p.id, label: p.title, icon: p.icon })),
    { id: 'team', label: 'Join the CMF Team', icon: 'incubator' },
  ];

  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <F as="span" className="eyebrow" path="pages.apply.eyebrow" />
          <F as="h1" className="h-display h1" style={{ margin: '18px 0 24px' }} path="pages.apply.title" />
          <F as="p" className="lede" style={{ fontSize: 18, maxWidth: '60ch' }} path="pages.apply.lede" multiline />
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            {['Track', 'About you', 'Submit'].map((label, i) => (
              <div key={i} style={{ flex: 1, padding: '14px 16px', border: '1px solid', borderColor: step >= i ? 'var(--border-gold)' : 'var(--border)',
                background: step === i ? 'rgba(228,169,60,0.06)' : 'transparent' }}>
                <div className="mono" style={{ fontSize: 10, color: step >= i ? 'var(--gold)' : 'var(--text-mute)', letterSpacing: '0.16em' }}>0{i+1}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, marginTop: 4, color: step >= i ? 'var(--text)' : 'var(--text-dim)' }}>{label}</div>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <F as="h3" className="h-display h3" style={{ marginBottom: 20 }} path="pages.apply.step0Title" />
              <F as="p" className="muted" style={{ marginBottom: 28 }} path="pages.apply.step0Body" multiline />
              <div className="tracks-grid">
                {tracks.map(t => {
                  const Ico = ICONS[t.icon] || IconQuant;
                  return (
                    <button key={t.id} onClick={() => setTrack(t.id)}
                      style={{
                        padding: 24, textAlign: 'left',
                        background: track === t.id ? 'rgba(228,169,60,0.06)' : 'rgba(14,27,54,0.4)',
                        border: `1px solid ${track === t.id ? 'var(--border-gold)' : 'var(--border)'}`,
                        color: 'var(--text)', cursor: 'pointer', borderRadius: 4, transition: 'all 0.15s ease',
                      }}>
                      <div style={{ color: 'var(--gold)', marginBottom: 14 }}><Ico /></div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>{t.label}</div>
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(1)} className="btn btn-gold">Continue <IconArrow /></button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <F as="h3" className="h-display h3" style={{ marginBottom: 28 }} path="pages.apply.step1Title" />
              <FormField label="Full name" />
              <FormField label="Email" type="email" />
              <FormField label="Academic & professional background" textarea />
              <FormField label="Why CMF?" textarea />
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(0)} className="btn btn-outline">Back</button>
                <button onClick={() => setStep(2)} className="btn btn-gold">Continue <IconArrow /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 72, height: 72, border: '1.5px solid var(--gold)', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 28px', color: 'var(--gold)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12 L10 18 L20 6" /></svg>
              </div>
              <F as="h3" className="h-display h2" style={{ marginBottom: 16 }} path="pages.apply.doneTitle" />
              <F as="p" className="lede" style={{ margin: '0 auto 32px' }} path="pages.apply.doneBody" multiline />
              <a href="#/" className="btn btn-outline">Back home</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ----- Router -----
function App() {
  const route = useHashRoute();
  const admin = useAdmin();
  const parts = route.split('/').filter(Boolean);
  const [section, id] = parts;

  useEffect(() => {
    document.body.classList.toggle('admin-on', !!(admin && admin.authed));
  }, [admin && admin.authed]);

  let page;
  if (section === 'admin') page = admin && admin.authed ? <Landing /> : <AdminLogin />;
  else if (!section || section === 'home') page = <Landing />;
  else if (section === 'programs') page = <ProgramsIndex />;
  else if (section === 'program') page = <ProgramDetail id={id} />;
  else if (section === 'portfolio') page = <PortfolioIndex />;
  else if (section === 'project') page = <ProjectDetail id={id} />;
  else if (section === 'about') page = <About />;
  else if (section === 'contact') page = <Contact />;
  else if (section === 'apply') page = <Apply />;
  else page = <Landing />;

  const showChrome = !(section === 'admin' && !(admin && admin.authed));

  return (
    <>
      {showChrome && <Nav route={route} />}
      <main>{page}</main>
      {showChrome && <Footer />}
      <AdminBar />
    </>
  );
}

function Root() {
  return (
    <AdminProvider>
      <App />
    </AdminProvider>
  );
}

// content.json is fetched before the first render, so every component below
// can keep reading the store synchronously.
initContent()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('app')).render(<Root />);
  })
  .catch((err) => {
    console.error(err);
    document.getElementById('app').innerHTML =
      '<div style="min-height:60vh;display:grid;place-items:center;font-family:system-ui;color:#8fa3c8">' +
      'Could not load site content. Please refresh.</div>';
  });
