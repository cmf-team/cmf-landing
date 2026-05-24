// app.jsx — hash router + index pages + boot

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
  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <span className="eyebrow">/ Programs</span>
          <h1 className="h-display h1" style={{ margin: '18px 0 24px' }}>All programs.</h1>
          <p className="lede" style={{ fontSize: 18, maxWidth: '64ch' }}>Four parallel tracks, each two courses deep. Take one, stack several, or design a custom path with admissions.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="programs-grid">
            {PROGRAMS.map(p => (
              <a key={p.id} href={`#/program/${p.id}`} className="card card-corners program-card">
                <span className="card-corners"></span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <span className="program-tag">{p.tag}</span>
                  <span style={{ color: 'var(--gold)', opacity: 0.6 }}><p.Icon /></span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="program-courses">
                  {p.courses.map(c => <span key={c}>{c}</span>)}
                </div>
                <div className="card-footer">
                  <span className="program-num">{p.num} / 04</span>
                  <span className="card-link">Learn more</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PortfolioIndex() {
  const [filter, setFilter] = useState('All');
  const tags = ['All', 'Options', 'AI', 'HFT', 'Risk'];
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter));
  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <span className="eyebrow">/ Portfolio</span>
          <h1 className="h-display h1" style={{ margin: '18px 0 24px' }}>Projects.</h1>
          <p className="lede" style={{ fontSize: 18, maxWidth: '64ch', marginBottom: 36 }}>Capstone work and ongoing research from CMF cohorts.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {tags.map(t => (
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
            {filtered.map(p => (
              <a key={p.id} href={`#/project/${p.id}`} className="card card-corners project-card">
                <ChartThumb variant={p.variant} tint={p.tint} />
                <div className="project-body">
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                  <span className="card-link">Read more</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function About() {
  const schools = [
    { name: 'Adv. Quant Analytics', tag: 'QUANT',     status: 'Active',   href: '#/program/quant' },
    { name: 'Options School',      tag: 'OPTIONS',   status: 'Active',   href: '#/program/options' },
    { name: 'HFT School',          tag: 'HFT',       status: 'Active',   href: '#/program/hft' },
    { name: 'AI School',           tag: 'AI',        status: 'Active',   href: '#/program/ai' },
    { name: 'FinTech School',      tag: 'FINTECH',   status: 'Active',   href: '#/program/fintech' },
    { name: 'Equity Research',     tag: 'EQUITY',    status: 'Active',   href: '#/programs' },
    { name: 'Web3 School',         tag: 'WEB3',      status: 'Active',   href: '#/programs' },
    { name: 'Data Science',        tag: 'DS',        status: 'Active',   href: '#/programs' },
    { name: 'Startup Incubator',   tag: 'INCUBATOR', status: 'Active',   href: '#/programs' },
    { name: 'Mid-Freq. Strategies',tag: 'MFT',       status: 'Upcoming', href: '#/programs' },
    { name: 'Global Macro',        tag: 'MACRO',     status: 'Upcoming', href: '#/programs' },
    { name: 'Superforecasting',    tag: 'FORECAST',  status: 'Upcoming', href: '#/programs' },
  ];

  return (
    <>
      {/* HERO with mission quote on the right */}
      <section className="page-hero">
        <FormulasBg density="med" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <div className="split-hero" style={{ alignItems: 'flex-start' }}>
            <div>
              <span className="eyebrow">/ About CMF</span>
              <h1 className="h-display h1" style={{ margin: '18px 0 24px' }}>Our mission.</h1>
              <p className="lede" style={{ fontSize: 19, marginBottom: 24 }}>
                CMF is an impact-driven international educational initiative for
                people with high ethical values and strong technical skills.
              </p>
              <p className="lede">
                Our mission is to support talented individuals — especially from
                developing countries — to unlock their potential, start meaningful
                careers and contribute to research and innovation in democratic
                societies.
              </p>
            </div>
            <aside className="mission-quote">
              <div className="quote-mark">&ldquo;</div>
              <p>It is rare to find a team where practitioners with 10+ years of experience work together to build and execute real-world projects within an educational initiative alongside exceptionally strong students.</p>
              <div className="quote-attr">
                <div className="quote-attr-dash" />
                <span>The CMF Team</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-tight">
        <div className="container">
          <div className="stats">
            <div className="stat">
              <div className="stat-num"><span className="g">12</span></div>
              <div className="stat-label">Schools &amp; programs</div>
            </div>
            <div className="stat">
              <div className="stat-num">100%</div>
              <div className="stat-label">Tuition-free</div>
            </div>
            <div className="stat">
              <div className="stat-num"><span className="g">~20</span></div>
              <div className="stat-label">Hrs / month · team</div>
            </div>
            <div className="stat">
              <div className="stat-num">Intl.</div>
              <div className="stat-label">Cohorts worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* CMF Team — 2-col with info card */}
      <section className="section">
        <div className="container">
          <div className="two-col">
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>/ The CMF Team</span>
              <h2 className="h-display h2" style={{ marginBottom: 28 }}>Practitioners and<br/>strong students.</h2>
              <p className="lede" style={{ marginBottom: 22 }}>It is rare to find a team where practitioners — many with 10+ years of experience — work together to build and execute real-world projects within an educational initiative alongside exceptionally strong students.</p>
              <p className="lede">Open roles include Product Owners on real quant, AI and Web3 projects; lecturers and TAs; mentors and founders building startups in our Business Incubator; managers across our online university (YNVRSTY) and EdTech labs.</p>
            </div>
            <div className="info-card">
              <div className="info-card-head">CMF · at a glance</div>
              <div className="info-row">
                <span className="info-key">Tuition</span>
                <span className="info-val">100% free</span>
              </div>
              <div className="info-row">
                <span className="info-key">Commitment</span>
                <span className="info-val">~20 hrs / month</span>
              </div>
              <div className="info-row">
                <span className="info-key">Mentors</span>
                <span className="info-val">10+ yrs experience</span>
              </div>
              <div className="info-row">
                <span className="info-key">Alumni at</span>
                <span className="info-val">Google · GS · McKinsey</span>
              </div>
              <div className="info-row">
                <span className="info-key">Schools</span>
                <span className="info-val">9 active &middot; 3 upcoming</span>
              </div>
              <div className="info-row">
                <span className="info-key">Initiative</span>
                <span className="info-val">YNVRSTY · CMF · AI Institute</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL SCHOOLS */}
      <section className="section" style={{ background: 'rgba(14,27,54,0.4)' }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ The full curriculum</span>
              <h2 className="h-display h2">Twelve schools.<br/>One mission.</h2>
            </div>
            <p className="lede">From quantitative finance to AI agents, from HFT to global macro — CMF spans the technical frontier of modern finance. Nine schools are running today; three more open in 2026.</p>
          </div>
          <div className="schools-strip">
            {schools.map(s => (
              <a key={s.name} href={s.href} className={`school-chip ${s.status === 'Upcoming' ? 'upcoming' : ''}`}>
                <div className="school-chip-head">
                  <span className="school-chip-tag">{s.tag}</span>
                  <span className="school-chip-status">{s.status}</span>
                </div>
                <div className="school-chip-name">{s.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WAYS TO PARTICIPATE */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ Ways to participate</span>
              <h2 className="h-display h2">Join as a student.<br/>Or join the team.</h2>
            </div>
            <p className="lede">We are always excited to meet ethical and technically strong people who want to participate in CMF.</p>
          </div>
          <div className="values">
            <a className="value participate-card" href="#/apply">
              <div className="value-icon"><IconAI /></div>
              <h4>Student</h4>
              <p>Apply to a school — AI, Options, HFT, Quant, FinTech or the Startup Incubator. Build real projects with practitioner mentors.</p>
              <span className="card-link">Apply to a school →</span>
            </a>
            <a className="value participate-card" href="#/contact">
              <div className="value-icon"><IconQuant /></div>
              <h4>Product Owner</h4>
              <p>Lead a small student team on a real project within Options School, HFT School or the Advanced Quantitative Analytics Program.</p>
              <span className="card-link">Join the CMF Team →</span>
            </a>
            <a className="value participate-card" href="#/contact">
              <div className="value-icon"><IconIncubator /></div>
              <h4>Lecturer / Mentor</h4>
              <p>Design and deliver courses, workshops or interview-prep sessions. Share expertise and deepen your own understanding.</p>
              <span className="card-link">Get in touch →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA tail */}
      <section className="section-tight">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p className="eyebrow" style={{ display: 'block', marginBottom: 18 }}>Cohorts open year-round</p>
          <h2 className="h-display h2" style={{ marginBottom: 30 }}>Ready to join?<br/>The CMF mission is open.</h2>
          <div style={{ display: 'inline-flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#/apply" className="btn btn-gold">Apply now <IconArrow /></a>
            <a href="#/contact" className="btn btn-outline">Talk to admissions</a>
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <span className="eyebrow">/ Contact</span>
          <h1 className="h-display h1" style={{ margin: '18px 0 24px' }}>Get in touch.</h1>
          <p className="lede" style={{ fontSize: 18, maxWidth: '64ch' }}>Questions about programs, partnerships or press? We respond within two business days.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div>
              <div style={{ marginBottom: 36 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Admissions</div>
                <a href="mailto:admissions@cmf.edu" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>admissions@cmf.edu</a>
              </div>
              <div style={{ marginBottom: 36 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Partnerships</div>
                <a href="mailto:partners@cmf.edu" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>partners@cmf.edu</a>
              </div>
              <div style={{ marginBottom: 36 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>Office</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>14 Rue de la Bourse<br/>75002 Paris, France</div>
              </div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              style={{ border: '1px solid var(--border)', padding: 40, background: 'rgba(14,27,54,0.4)' }}>
              {submitted ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, border: '1.5px solid var(--gold)', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 22px', color: 'var(--gold)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12 L10 18 L20 6" /></svg>
                  </div>
                  <h3 className="h-display h3" style={{ marginBottom: 10 }}>Message sent.</h3>
                  <p className="muted">We'll be in touch within two business days.</p>
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
  const [data, setData] = useState({ track: 'options', name: '', email: '', bg: '', motivation: '' });
  const tracks = [
    { id: 'ai', label: 'AI School', Icon: IconAI },
    { id: 'options', label: 'Options School', Icon: IconOptions },
    { id: 'hft', label: 'HFT School', Icon: IconHFT },
    { id: 'quant', label: 'Adv. Quant Analytics', Icon: IconQuant },
    { id: 'fintech', label: 'FinTech School', Icon: IconFinTech },
    { id: 'team', label: 'Join the CMF Team', Icon: IconIncubator },
  ];

  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back home</a>
          <span className="eyebrow">/ Apply · Cohort 07</span>
          <h1 className="h-display h1" style={{ margin: '18px 0 24px' }}>Apply.</h1>
          <p className="lede" style={{ fontSize: 18, maxWidth: '60ch' }}>Three short steps. Full application reviewed within ten business days.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          {/* steps */}
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
              <h3 className="h-display h3" style={{ marginBottom: 20 }}>Choose your track.</h3>
              <p className="muted" style={{ marginBottom: 28 }}>You can change this later, or stack a second track at the next intake.</p>
              <div className="tracks-grid">
                {tracks.map(t => (
                  <button key={t.id} onClick={() => setData({ ...data, track: t.id })}
                    style={{
                      padding: 24, textAlign: 'left',
                      background: data.track === t.id ? 'rgba(228,169,60,0.06)' : 'rgba(14,27,54,0.4)',
                      border: `1px solid ${data.track === t.id ? 'var(--border-gold)' : 'var(--border)'}`,
                      color: 'var(--text)', cursor: 'pointer', borderRadius: 4, transition: 'all 0.15s ease',
                    }}>
                    <div style={{ color: 'var(--gold)', marginBottom: 14 }}><t.Icon /></div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>{t.label}</div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(1)} className="btn btn-gold">Continue <IconArrow /></button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="h-display h3" style={{ marginBottom: 28 }}>About you.</h3>
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
              <h3 className="h-display h2" style={{ marginBottom: 16 }}>Application received.</h3>
              <p className="lede" style={{ margin: '0 auto 32px' }}>Thanks — you'll hear back from admissions within ten business days. Track your status by email.</p>
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
  const parts = route.split('/').filter(Boolean);
  const [section, id] = parts;

  let page;
  if (!section || section === 'home') page = <Landing />;
  else if (section === 'programs') page = <ProgramsIndex />;
  else if (section === 'program') page = <ProgramDetail id={id} />;
  else if (section === 'portfolio') page = <PortfolioIndex />;
  else if (section === 'project') page = <ProjectDetail id={id} />;
  else if (section === 'about') page = <About />;
  else if (section === 'contact') page = <Contact />;
  else if (section === 'apply') page = <Apply />;
  else page = <Landing />;

  return (
    <>
      <Nav route={route} />
      <main>{page}</main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
