// landing.jsx — Landing/Home page
const PROGRAMS = [
  {
    id: 'ai',
    num: '01',
    tag: 'AI SCHOOL',
    title: 'AI School @ AI Institute',
    desc: 'Build AI agents, integration engines and AI-native products. Python + one LLM API + Jupyter — signal over infrastructure.',
    courses: ['Course 1 · AI Agents & Integration Engines', 'Course 2 · Content Transformation & Product Design'],
    Icon: () => <IconAI />,
  },
  {
    id: 'options',
    num: '02',
    tag: 'OPTIONS SCHOOL',
    title: 'Options School',
    desc: 'A backtester, pricing & curve modeling, crypto options and vega hedging — an institutional options framework, applied end-to-end.',
    courses: ['Course 1 · Backtester, Pricing & Curve Modeling', 'Course 2 · Crypto Options & Vega Hedging'],
    Icon: () => <IconOptions />,
  },
  {
    id: 'hft',
    num: '03',
    tag: 'HFT SCHOOL',
    title: 'HFT School',
    desc: 'High-frequency market making and execution research — microstructure, latency-aware design and live-market validation.',
    courses: ['Course 1 · Market Microstructure & Strategy Design', 'Course 2 · Execution Engineering & Validation'],
    Icon: () => <IconHFT />,
  },
  {
    id: 'quant',
    num: '04',
    tag: 'ADV. QUANT ANALYTICS',
    title: 'Advanced Quantitative Analytics',
    desc: 'From binomial trees to Monte Carlo. Derivatives pricing, stochastic calculus and applied quantitative research.',
    courses: ['Course 1 · Derivatives Pricing & Stochastic Calculus', 'Course 2 · Applied Quantitative Research'],
    Icon: () => <IconQuant />,
  },
];

const PROJECTS = [
  { id: 'options-backtester', title: 'Options Backtester', cohort: 'OPTIONS SCHOOL',
    desc: 'A robust simulation engine for evaluating options strategies under realistic market conditions — portfolio-level analysis, regime sensitivity and transaction-cost-aware validation.',
    tags: ['Options', 'Backtesting'], variant: 'bars', tint: 'gold' },
  { id: 'pricing-curve', title: 'Pricing & Curve Modeling', cohort: 'OPTIONS SCHOOL',
    desc: 'Building and calibrating curves, surfaces and valuation models — focused on illiquid instruments where market data is sparse and standard assumptions break down.',
    tags: ['Options', 'Pricing'], variant: 'surface', tint: 'gold' },
  { id: 'crypto-options', title: 'Crypto Options Module', cohort: 'OPTIONS SCHOOL',
    desc: 'An extension of the institutional framework into crypto options — adapted for the liquidity, volatility and microstructure of digital asset markets.',
    tags: ['Options', 'Crypto'], variant: 'orderbook', tint: 'gold' },
  { id: 'vega-hedging', title: 'Portfolio Risk & Vega Hedging', cohort: 'OPTIONS SCHOOL',
    desc: 'A dedicated risk layer for monitoring and managing volatility exposure across the book — vega hedging, surface dynamics and portfolio-level risk decomposition.',
    tags: ['Options', 'Risk'], variant: 'heatmap', tint: 'gold' },
  { id: 'ai-agent-layer', title: 'AI Agent Layer', cohort: 'AI SCHOOL · OPTIONS',
    desc: 'An intelligent orchestration layer that augments the research and trading workflow — supporting idea generation, monitoring, diagnostics and decision support.',
    tags: ['AI', 'Agents'], variant: 'network', tint: 'gold' },
  { id: 'hft-market-making', title: 'HFT Market Making', cohort: 'HFT SCHOOL',
    desc: 'Latency-aware market making research with inventory-management and adverse-selection controls — validated on live exchange feeds.',
    tags: ['HFT', 'Microstructure'], variant: 'curve', tint: 'gold' },
];

function Landing() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <FormulasBg density="med" />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="eyebrow">IMPACT-DRIVEN · INTERNATIONAL · TUITION-FREE</span>
              <h1 className="h-display h1 hero-headline">Center of<br/>Mathematical<br/>Finance</h1>
              <p className="subhead hero-sub">From financial intuition to rigorous quantitative modeling</p>
              <p className="lede hero-para">
                CMF is an impact-driven international educational initiative for people with
                high ethical values and strong technical skills. Across our schools in Quantitative
                Finance, HFT, Options, AI, FinTech and Web3, we support talented individuals — especially
                from developing countries — to start meaningful careers and contribute to real-world research.
              </p>
              <div className="hero-ctas">
                <a href="#/programs" className="btn btn-gold">Explore Programs <IconArrow /></a>
                <a href="#/portfolio" className="btn btn-outline">View Portfolio</a>
              </div>
            </div>
            <div className="hero-visual">
              <WireframeSurface />
              {/* Floating formula chips */}
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
              <span className="eyebrow">/ 01 — Our approach</span>
              <h2 className="h-display h2">Ethics, skill and<br/>real-world impact.</h2>
            </div>
            <p className="lede">A community where practitioners with 10+ years of experience build
              and execute real projects alongside exceptionally strong students. The only investment we
              ask for is your time and commitment.</p>
          </div>
          <div className="values">
            <div className="value">
              <div className="value-icon"><IconRigor /></div>
              <h4>Rigorous</h4>
              <p>From financial intuition to rigorous quantitative modeling — stochastic calculus,
                numerical methods and the depth required to read papers, not just recite them.</p>
            </div>
            <div className="value">
              <div className="value-icon"><IconPractice /></div>
              <h4>Builder-first</h4>
              <p>We learn by building. Backtesters, pricing engines, AI agents and live trading
                systems — every program ships real artifacts on real data.</p>
            </div>
            <div className="value">
              <div className="value-icon"><IconIntuition /></div>
              <h4>Impact-driven</h4>
              <p>Tuition-free programs for talented people across the world — especially from
                developing countries — unlocking meaningful careers in democratic societies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section" id="programs">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ 02 — Schools</span>
              <h2 className="h-display h2">Programs open<br/>for registration.</h2>
            </div>
            <p className="lede">Four flagship schools, each delivered as two intensive courses.
              FinTech, Equity Research and the AI &amp; Web3 Startup Incubator open separately —
              see all programs for the full list.</p>
          </div>
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
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <a href="#/programs" className="btn btn-outline">View all schools <IconArrow /></a>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="section" id="portfolio" style={{ background: 'linear-gradient(180deg, transparent, rgba(14,27,54,0.4) 30%, rgba(14,27,54,0.4) 70%, transparent)' }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ 03 — Portfolio</span>
              <h2 className="h-display h2">Projects by our<br/>team and cohorts.</h2>
            </div>
            <p className="lede">Capstone work and ongoing research across CMF schools. Every project
              ships with documentation, code and a written defense — built collaboratively by
              students and practitioner mentors.</p>
          </div>
          <div className="portfolio-grid">
            {PROJECTS.map(p => (
              <a key={p.id} href={`#/project/${p.id}`} className="card card-corners project-card">
                <ChartThumb variant={p.variant} tint={p.tint} />
                <div className="project-body">
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    <span className="tag muted">{p.cohort.split('·')[0].trim()}</span>
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

      {/* STATS STRIP */}
      <section className="section-tight">
        <div className="container">
          <div className="stats">
            <div className="stat">
              <div className="stat-num"><span className="g">07</span></div>
              <div className="stat-label">Schools & programs</div>
            </div>
            <div className="stat">
              <div className="stat-num">10+ yrs</div>
              <div className="stat-label">Avg. mentor experience</div>
            </div>
            <div className="stat">
              <div className="stat-num">Google · GS</div>
              <div className="stat-label">Where alumni land</div>
            </div>
            <div className="stat">
              <div className="stat-num"><span className="g">100%</span></div>
              <div className="stat-label">Tuition-free</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">/ 04 — Voices</span>
              <h2 className="h-display h2">From our alumni<br/>and partners.</h2>
            </div>
          </div>
          <div className="testimonials">
            <div className="testimonial">
              <p>"It is rare to find a team where practitioners with 10+ years of experience work
                together to build real-world projects within an educational initiative — alongside
                exceptionally strong students."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">EK</div>
                <div className="testimonial-meta"><b>Elena Kovač</b><span>Options School · Mentor</span></div>
              </div>
            </div>
            <div className="testimonial">
              <p>"CMF rebuilt the way I read papers. Six months in I was pricing exotic barriers
                on the desk — and actually understanding what the Greeks were telling me."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RT</div>
                <div className="testimonial-meta"><b>Ravi Thakkar</b><span>Adv. Quant Analytics · Alumnus</span></div>
              </div>
            </div>
            <div className="testimonial">
              <p>"Lean stack. Sharp problems. We built AI agents that actually shipped — and the
                evaluation criteria forced honesty about what was real and what was AI slop."</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MS</div>
                <div className="testimonial-meta"><b>Maya Soriano</b><span>AI School · Cohort 01</span></div>
              </div>
            </div>
          </div>

          <div className="partners">
            <div className="partner">GOOGLE</div>
            <div className="partner">GOLDMAN SACHS</div>
            <div className="partner">MCKINSEY</div>
            <div className="partner">YNVRSTY</div>
            <div className="partner">AI INSTITUTE</div>
            <div className="partner">FINTECH SCHOOL</div>
          </div>
        </div>
      </section>
    </>
  );
}

window.Landing = Landing;
window.PROGRAMS = PROGRAMS;
window.PROJECTS = PROJECTS;
