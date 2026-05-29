// project.jsx — Project detail page (store-driven, editable)

function ProjChartBlock({ base, editing }) {
  // base e.g. projects.2.problem
  return null; // charts edited via PickField inline below
}

function ProjectDetail({ id }) {
  const projects = useList('projects');
  const editing = useEditing();
  const idx = projects.findIndex(p => p.id === id);
  const i = idx === -1 ? 0 : idx;
  const p = projects[i];

  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);
  if (!p) return <section className="section"><div className="container"><p className="lede">Project not found.</p></div></section>;

  const base = `projects.${i}`;
  const related = projects.filter((x, xi) => xi !== i).slice(0, 3);

  const Section = ({ keyName, num }) => {
    const sec = p[keyName];
    if (!sec) return null;
    const sbase = `${base}.${keyName}`;
    return (
      <div className="proj-section">
        <div className="proj-section-label"><span className="num">{num}</span><F path={`${sbase}.title`} /></div>
        <div>
          {(sec.paras || []).map((para, pi) => (
            <div className="cms-rel" key={pi} style={{ position: 'relative' }}>
              {editing && <ItemControls path={`${sbase}.paras`} index={pi} count={sec.paras.length} />}
              <F as="p" path={`${sbase}.paras.${pi}`} multiline />
            </div>
          ))}
          {editing && <AddItem path={`${sbase}.paras`} label="Add paragraph" template={'A new paragraph.'} />}
          {sec.list && (
            <ul className="check-list" style={{ marginTop: 24 }}>
              {sec.list.map((it, li) => (
                <li key={li} className="cms-rel">
                  <ItemControls path={`${sbase}.list`} index={li} count={sec.list.length} />
                  <b><F path={`${sbase}.list.${li}.t`} /></b> &nbsp;— <F path={`${sbase}.list.${li}.d`} multiline />
                </li>
              ))}
            </ul>
          )}
          {editing && sec.list && <AddItem path={`${sbase}.list`} label="Add point" template={{ t: 'Key point', d: 'Detail.' }} />}
          {sec.chart && (
            <div className="chart-frame">
              <div className="chart-frame-head">
                <F as="h6" path={`${sbase}.chart.label`} />
                <span className="pill">{num === '01' ? 'Fig. 01' : num === '02' ? 'Fig. 02' : 'Fig. 03'}</span>
              </div>
              {editing && <div style={{ marginBottom: 12 }}><PickField path={`${sbase}.chart.variant`} options={CHART_VARIANTS} /></div>}
              <ChartThumb variant={sec.chart.variant} tint="gold" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/portfolio" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back to portfolio</a>
          <div className="split-hero">
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
                {(p.detailTags || []).map((t, ti) => <span key={ti} className="tag"><F path={`${base}.detailTags.${ti}`} /></span>)}
                <span className="tag muted"><F path={`${base}.detailCohort`} /></span>
              </div>
              <F as="h1" className="h-display h1" style={{ marginBottom: 28, textTransform: 'none', letterSpacing: '-0.02em' }} path={`${base}.title`} />
              <F as="p" className="lede" style={{ fontSize: 18 }} path={`${base}.summary`} multiline />
            </div>
            <div className="proj-meta-side">
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Project meta</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Duration</div><F as="div" style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 4 }} path={`${base}.duration`} /></div>
                <div><div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Track</div><F as="div" style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 4 }} path={`${base}.detailCohort`} /></div>
                <div><div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Status</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 4, color: 'var(--gold)' }}>Active</div></div>
              </div>
            </div>
          </div>

          {/* metrics row */}
          <div className="metrics" style={{ marginTop: 56 }}>
            {(p.metrics || []).map((m, mi) => (
              <div className="metric cms-rel" key={mi}>
                <ItemControls path={`${base}.metrics`} index={mi} count={p.metrics.length} vertical />
                <F as="div" className="metric-val" path={`${base}.metrics.${mi}.v`} />
                <F as="div" className="metric-label" path={`${base}.metrics.${mi}.l`} />
              </div>
            ))}
          </div>
          {editing && <AddItem path={`${base}.metrics`} label="Add metric" template={{ v: 'Value', l: 'Label' }} />}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="container">
          <Section keyName="problem" num="01" />
          <Section keyName="approach" num="02" />
          <Section keyName="results" num="03" />

          {/* TEAM */}
          <div className="proj-section">
            <div className="proj-section-label"><span className="num">04</span>The team</div>
            <div>
              <h3>Built by the cohort.</h3>
              <p>A small project team led by a CMF Team Product Owner, supported by mentor practitioners with 10+ years of experience and exceptionally strong students from the school.</p>
              <div className="team-grid auto-team" style={{ marginTop: 28, '--n': Math.min(4, (p.team || []).length || 1) }}>
                {(p.team || []).map((t, ti) => (
                  <div className="team-card cms-rel" key={ti}>
                    <ItemControls path={`${base}.team`} index={ti} count={p.team.length} />
                    <div className="team-avatar"><F path={`${base}.team.${ti}.initials`} /></div>
                    <F as="h5" path={`${base}.team.${ti}.name`} />
                    <F as="div" className="role" path={`${base}.team.${ti}.role`} />
                  </div>
                ))}
              </div>
              {editing && <AddItem path={`${base}.team`} label="Add member" template={{ initials: 'XX', name: 'Team Member', role: 'Role' }} />}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section" style={{ background: 'rgba(14,27,54,0.4)' }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ More from portfolio</span>
              <h2 className="h-display h2">Related projects.</h2>
            </div>
            <a href="#/portfolio" className="btn btn-outline">All projects <IconArrow /></a>
          </div>
          <div className="portfolio-grid">
            {related.map((r) => (
              <a key={r.id} href={`#/project/${r.id}`} className="card card-corners project-card"
                 onClick={editing ? (e) => e.preventDefault() : undefined}>
                <ChartThumb variant={r.variant} tint={r.tint} />
                <div className="project-body">
                  <div className="project-tags">
                    {(r.detailTags || r.tags || []).slice(0, 2).map((t, ti) => <span key={ti} className="tag">{t}</span>)}
                  </div>
                  <h4>{r.title}</h4>
                  <p>{r.summary || r.desc}</p>
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

window.ProjectDetail = ProjectDetail;
