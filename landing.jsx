// landing.jsx — Landing/Home page (store-driven, editable)

function ProgramCard({ p, i }) {
  const editing = useEditing();
  const Ico = ICONS[p.icon] || IconQuant;
  const courses = p.courses || [];
  return (
    <a href={`#/program/${p.id}`} className="card card-corners program-card cms-rel"
       onClick={editing ? (e) => e.preventDefault() : undefined}>
      <span className="card-corners"></span>
      <ItemControls path="programs" index={i} count={store.get('programs').length} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <span className="program-tag"><F path={`programs.${i}.tag`} /></span>
        <span style={{ color: 'var(--gold)', opacity: 0.6 }}><Ico /></span>
      </div>
      {editing && <div><PickField path={`programs.${i}.icon`} options={ICON_KEYS} /></div>}
      <F as="h3" path={`programs.${i}.title`} />
      <F as="p" path={`programs.${i}.desc`} multiline />
      <div className="program-courses">
        {courses.map((c, ci) => (
          <span key={ci} className="cms-rel" style={{ position: 'relative' }}>
            <F path={`programs.${i}.courses.${ci}`} />
          </span>
        ))}
      </div>
      <div className="card-footer">
        <span className="program-num"><F path={`programs.${i}.num` } /> / 0{store.get('programs').length}</span>
        <span className="card-link">Learn more</span>
      </div>
    </a>
  );
}

function ProjectCard({ p, i }) {
  const editing = useEditing();
  const tags = p.tags || [];
  return (
    <a href={`#/project/${p.id}`} className="card card-corners project-card cms-rel"
       onClick={editing ? (e) => e.preventDefault() : undefined}>
      <ItemControls path="projects" index={i} count={store.get('projects').length} />
      <ChartThumb variant={p.variant} tint={p.tint} />
      <div className="project-body">
        {editing && <div style={{ marginBottom: 8 }}><PickField path={`projects.${i}.variant`} options={CHART_VARIANTS} /></div>}
        <div className="project-tags">
          {tags.map((t, ti) => <span key={ti} className="tag"><F path={`projects.${i}.tags.${ti}`} /></span>)}
          <span className="tag muted">{(p.cohort || '').split('·')[0].trim()}</span>
        </div>
        <F as="h4" path={`projects.${i}.title`} />
        <F as="p" path={`projects.${i}.desc`} multiline />
        <span className="card-link">Read more</span>
      </div>
    </a>
  );
}

function Landing() {
  const programs = useList('programs');
  const projects = useList('projects');
  const values = useList('home.about.values');
  const stats = useList('home.stats');
  const testimonials = useList('home.testimonialsSec.items');
  const partners = useList('home.partners');
  const editing = useEditing();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <FormulasBg density="med" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <F as="span" className="eyebrow" path="home.hero.eyebrow" />
              <F as="h1" className="h-display h1 hero-headline" path="home.hero.headline" multiline />
              <F as="p" className="subhead hero-sub" path="home.hero.subhead" multiline />
              <F as="p" className="lede hero-para" path="home.hero.paragraph" multiline />
              <div className="hero-ctas">
                <a href="#/programs" className="btn btn-gold"><F path="home.hero.cta1" /> <IconArrow /></a>
                <a href="#/portfolio" className="btn btn-outline"><F path="home.hero.cta2" /></a>
              </div>
            </div>
            <div className="hero-visual">
              <WireframeSurface />
              <div className="formula-chip" style={{ top: '4%', right: '4%', maxWidth: '92%' }}>
                <Tex latex="dS_t = \mu S_t\,dt + \sigma S_t\,dW_t" />
              </div>
              <div className="formula-chip" style={{ top: '36%', left: '2%' }}>
                <Tex latex="C = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}[H_T]" />
              </div>
              <div className="formula-chip" style={{ bottom: '18%', right: '4%' }}>
                <Tex latex="\Delta = \tfrac{\partial C}{\partial S} \quad \Gamma = \tfrac{\partial^2 C}{\partial S^2}" />
              </div>
              <div className="formula-chip" style={{ bottom: '4%', left: '6%' }}>
                <Tex latex="\sigma_{\text{impl}}\,\sqrt{T}" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / VALUES */}
      <section className="section" id="about">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <F as="span" className="eyebrow" path="home.about.eyebrow" />
              <F as="h2" className="h-display h2" path="home.about.heading" multiline />
            </div>
            <F as="p" className="lede" path="home.about.lede" multiline />
          </div>
          <div className="values">
            {values.map((v, i) => {
              const Ico = ICONS[v.icon] || IconRigor;
              return (
                <div className="value cms-rel" key={i}>
                  <ItemControls path="home.about.values" index={i} count={values.length} />
                  <div className="value-icon"><Ico /></div>
                  {editing && <PickField path={`home.about.values.${i}.icon`} options={ICON_KEYS} />}
                  <F as="h4" path={`home.about.values.${i}.title`} />
                  <F as="p" path={`home.about.values.${i}.body`} multiline />
                </div>
              );
            })}
          </div>
          {editing && <AddItem path="home.about.values" label="Add value" template={{ icon: 'rigor', title: 'New value', body: 'Describe this value.' }} />}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section" id="programs">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <F as="span" className="eyebrow" path="home.programsSec.eyebrow" />
              <F as="h2" className="h-display h2" path="home.programsSec.heading" multiline />
            </div>
            <F as="p" className="lede" path="home.programsSec.lede" multiline />
          </div>
          <div className="programs-grid">
            {programs.map((p, i) => <ProgramCard key={p.id} p={p} i={i} />)}
          </div>
          {editing && <AddItem path="programs" label="Add program" template={newProgram} />}
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <a href="#/programs" className="btn btn-outline"><F path="home.programsSec.allLabel" /> <IconArrow /></a>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section" id="portfolio" style={{ background: 'linear-gradient(180deg, transparent, rgba(14,27,54,0.4) 30%, rgba(14,27,54,0.4) 70%, transparent)' }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <F as="span" className="eyebrow" path="home.portfolioSec.eyebrow" />
              <F as="h2" className="h-display h2" path="home.portfolioSec.heading" multiline />
            </div>
            <F as="p" className="lede" path="home.portfolioSec.lede" multiline />
          </div>
          <div className="portfolio-grid">
            {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
          </div>
          {editing && <AddItem path="projects" label="Add project" template={newProject} />}
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="section-tight">
        <div className="container">
          <div className="stats">
            {stats.map((s, i) => (
              <div className="stat cms-rel" key={i}>
                <ItemControls path="home.stats" index={i} count={stats.length} />
                <div className="stat-num"><F as="span" className={s.gold ? 'g' : ''} path={`home.stats.${i}.num`} /></div>
                <F as="div" className="stat-label" path={`home.stats.${i}.label`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <F as="span" className="eyebrow" path="home.testimonialsSec.eyebrow" />
              <F as="h2" className="h-display h2" path="home.testimonialsSec.heading" multiline />
            </div>
          </div>
          <div className="testimonials">
            {testimonials.map((t, i) => (
              <div className="testimonial cms-rel" key={i}>
                <ItemControls path="home.testimonialsSec.items" index={i} count={testimonials.length} />
                <F as="p" path={`home.testimonialsSec.items.${i}.quote`} multiline />
                <div className="testimonial-author">
                  <div className="testimonial-avatar"><F path={`home.testimonialsSec.items.${i}.initials`} /></div>
                  <div className="testimonial-meta">
                    <b><F path={`home.testimonialsSec.items.${i}.name`} /></b>
                    <F as="span" path={`home.testimonialsSec.items.${i}.meta`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {editing && <AddItem path="home.testimonialsSec.items" label="Add testimonial" template={{ quote: 'A great quote about CMF.', initials: 'AB', name: 'New Name', meta: 'Role · Cohort' }} />}

          <div className="partners">
            {partners.map((p, i) => (
              <div className="partner cms-rel" key={i}>
                <ItemControls path="home.partners" index={i} count={partners.length} vertical />
                <F path={`home.partners.${i}`} />
              </div>
            ))}
          </div>
          {editing && <AddItem path="home.partners" label="Add partner" template={'NEW PARTNER'} />}
        </div>
      </section>
    </>
  );
}

window.Landing = Landing;
window.ProgramCard = ProgramCard;
window.ProjectCard = ProjectCard;
