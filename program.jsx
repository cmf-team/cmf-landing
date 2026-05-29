// program.jsx — Program detail page (store-driven, editable)

function ProgramDetail({ id }) {
  const programs = useList('programs');
  const editing = useEditing();
  const [openFaq, setOpenFaq] = useState(0);
  const idx = programs.findIndex(p => p.id === id);
  const i = idx === -1 ? 0 : idx;
  const p = programs[i];

  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);
  if (!p) return <section className="section"><div className="container"><p className="lede">Program not found.</p></div></section>;

  const base = `programs.${i}`;

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <FormulasBg density="med" />
        <div className="container">
          <a href="#/programs" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back to programs</a>
          <div className="split-hero" style={{ alignItems: 'flex-start' }}>
            <div>
              <span className="program-tag" style={{ marginBottom: 24, display: 'inline-block' }}><F path={`${base}.detailTag`} /></span>
              <F as="h1" className="h-display h1" style={{ marginBottom: 22 }} path={`${base}.title`} />
              <F as="p" className="subhead" style={{ marginBottom: 24, maxWidth: '22ch' }} path={`${base}.subtitle`} multiline />
              <F as="p" className="lede" style={{ marginBottom: 32 }} path={`${base}.intro`} multiline />
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#/apply" className="btn btn-gold">Apply now <IconArrow /></a>
                <a href="#syllabus" className="btn btn-outline">View syllabus</a>
              </div>
            </div>
            <div>
              <div className="meta-grid">
                {(p.meta || []).map((m, mi) => (
                  <div key={mi} className="meta-cell cms-rel">
                    <ItemControls path={`${base}.meta`} index={mi} count={p.meta.length} vertical />
                    <F as="div" className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }} path={`${base}.meta.${mi}.k`} />
                    <F as="div" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }} path={`${base}.meta.${mi}.v`} />
                  </div>
                ))}
              </div>
              {editing && <AddItem path={`${base}.meta`} label="Add fact" template={{ k: 'Label', v: 'Value' }} />}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="section" id="syllabus">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ 01 — Curriculum</span>
              <h2 className="h-display h2">What you'll learn,<br/>module by module.</h2>
            </div>
            <p className="lede">Every module ships with problem sets, a coding sprint
              and a short written reflection. A capstone runs through the entire track.</p>
          </div>
          <div className="curriculum">
            {(p.modules || []).map((m, mi) => (
              <div className="module cms-rel" key={mi}>
                <ItemControls path={`${base}.modules`} index={mi} count={p.modules.length} />
                <F as="div" className="module-num" path={`${base}.modules.${mi}.num`} />
                <div className="module-body">
                  <F as="h4" path={`${base}.modules.${mi}.title`} />
                  <F as="p" path={`${base}.modules.${mi}.desc`} multiline />
                </div>
                <F as="div" className="module-meta" path={`${base}.modules.${mi}.tag`} />
              </div>
            ))}
          </div>
          {editing && <AddItem path={`${base}.modules`} label="Add module" template={() => ({ num: String((store.get(`${base}.modules`).length + 1)).padStart(2, '0'), title: 'New module', tag: '1 WEEK', desc: 'What this module covers.' })} />}
        </div>
      </section>

      {/* Outcomes / Audience */}
      <section className="section" style={{ background: 'rgba(14,27,54,0.4)' }}>
        <div className="container">
          <div className="two-col">
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>/ 02 — Outcomes</span>
              <h3 className="h-display h2" style={{ marginBottom: 28 }}>What you'll<br/>walk away with.</h3>
              <ul className="check-list">
                {(p.outcomes || []).map((o, oi) => (
                  <li key={oi} className="cms-rel">
                    <ItemControls path={`${base}.outcomes`} index={oi} count={p.outcomes.length} />
                    <F path={`${base}.outcomes.${oi}`} multiline />
                  </li>
                ))}
              </ul>
              {editing && <AddItem path={`${base}.outcomes`} label="Add outcome" template={'A new outcome'} />}
            </div>
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>/ 03 — Who it's for</span>
              <h3 className="h-display h2" style={{ marginBottom: 28 }}>Built for those<br/>moving into quant.</h3>
              <ul className="check-list">
                {(p.audience || []).map((a, ai) => (
                  <li key={ai} className="cms-rel">
                    <ItemControls path={`${base}.audience`} index={ai} count={p.audience.length} />
                    <F path={`${base}.audience.${ai}`} multiline />
                  </li>
                ))}
              </ul>
              {editing && <AddItem path={`${base}.audience`} label="Add audience" template={'Another audience'} />}
            </div>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ 04 — Instructors</span>
              <h2 className="h-display h2">Taught by<br/>practitioners.</h2>
            </div>
            <p className="lede">CMF instructors split their time between the program
              and active research, trading or engineering roles — many with 10+ years of experience.</p>
          </div>
          <div className="team-grid">
            {(p.instructors || []).map((ins, ii) => (
              <div className="team-card cms-rel" key={ii}>
                <ItemControls path={`${base}.instructors`} index={ii} count={p.instructors.length} />
                <div className="team-avatar"><F path={`${base}.instructors.${ii}.initials`} /></div>
                <F as="h5" path={`${base}.instructors.${ii}.name`} />
                <F as="div" className="role" path={`${base}.instructors.${ii}.role`} />
                <F as="p" path={`${base}.instructors.${ii}.bio`} multiline />
              </div>
            ))}
          </div>
          {editing && <AddItem path={`${base}.instructors`} label="Add instructor" template={{ initials: 'XX', name: 'Instructor Name', role: 'Co-instructor', bio: 'Short instructor bio.' }} />}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: 'rgba(14,27,54,0.4)' }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ 05 — Frequently asked</span>
              <h2 className="h-display h2">Questions<br/>before applying.</h2>
            </div>
            <p className="lede">Still curious? Admissions hold office hours every
              Wednesday — book a slot from the contact page.</p>
          </div>
          <div className="faq">
            {(p.faqs || []).map((f, fi) => (
              <div className={`faq-item cms-rel ${openFaq === fi ? 'open' : ''}`} key={fi}>
                <ItemControls path={`${base}.faqs`} index={fi} count={p.faqs.length} />
                {editing ? (
                  <div style={{ padding: '20px 0' }}>
                    <F as="div" className="faq-q" style={{ padding: 0 }} path={`${base}.faqs.${fi}.q`} multiline />
                    <F as="div" className="faq-a-inner" style={{ paddingBottom: 0 }} path={`${base}.faqs.${fi}.a`} multiline />
                  </div>
                ) : (
                  <>
                    <button className="faq-q" onClick={() => setOpenFaq(openFaq === fi ? -1 : fi)}>
                      <span>{f.q}</span>
                      <span className="plus" />
                    </button>
                    <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
                  </>
                )}
              </div>
            ))}
          </div>
          {editing && <AddItem path={`${base}.faqs`} label="Add FAQ" template={{ q: 'A new question?', a: 'The answer.' }} />}
        </div>
      </section>

      {/* CTA tail */}
      <section className="section-tight">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p className="eyebrow" style={{ display: 'block', marginBottom: 18 }}>Tuition-free · International cohort</p>
          <h2 className="h-display h2" style={{ marginBottom: 30 }}>Ready to build?<br/>Apply to {p.title}.</h2>
          <div style={{ display: 'inline-flex', gap: 14 }}>
            <a href="#/apply" className="btn btn-gold">Apply now <IconArrow /></a>
            <a href="#/programs" className="btn btn-outline">All programs</a>
          </div>
        </div>
      </section>
    </>
  );
}

window.ProgramDetail = ProgramDetail;
