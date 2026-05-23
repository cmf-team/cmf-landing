// program.jsx — Program detail page (template, schools fully detailed)

const PROGRAM_DETAILS = {
  quant: {
    tag: 'ADV. QUANT ANALYTICS · TRACK 04',
    title: 'Advanced Quantitative Analytics',
    subtitle: 'From financial intuition to rigorous quantitative modeling',
    intro: 'A comprehensive review of the key concepts, models and pricing techniques behind modern derivatives — for students and professionals in mathematics, computer science, physics and quantitative finance. Taught with the depth required to read the literature, the rigor to prove the results, and the engineering to ship them on real market data.',
    meta: [
      { k: 'Duration',  v: '14 weeks' },
      { k: 'Format',    v: 'Online · Weekly' },
      { k: 'Cohort',    v: 'Cohort 2026' },
      { k: 'Language',  v: 'English' },
    ],
    modules: [
      { num: '01', title: 'Binomial & Black–Scholes Models', tag: '2 WEEKS',
        desc: 'The two anchors of derivatives pricing, derived from no-arbitrage and martingale arguments.' },
      { num: '02', title: 'Greeks: Delta, Gamma, Theta, Vega', tag: '1 WEEK',
        desc: 'What they measure, how they trade, and why they fail — Δ, Γ, Θ, ν and their interrelationships.' },
      { num: '03', title: 'Volatility & the √T rule', tag: '1 WEEK',
        desc: 'Historical, implied, smile, skew and surface construction with arbitrage-free interpolation.' },
      { num: '04', title: 'Bloomberg Option Pricing & Yield Curves', tag: '1 WEEK',
        desc: 'Hands-on with live tickers, swap curves and vol surfaces from the desk.' },
      { num: '05', title: 'PDE Methods & Finite Differences', tag: '2 WEEKS',
        desc: 'The Black–Scholes equation. Implicit, explicit and Crank–Nicolson schemes in Python.' },
      { num: '06', title: 'Itô Processes, Martingales & Risk-Neutral Measure', tag: '2 WEEKS',
        desc: 'The machinery, end to end — through to the Fundamental Theorem of Asset Pricing.' },
      { num: '07', title: 'Feynman–Kac Lemma', tag: '1 WEEK',
        desc: 'The bridge between PDE and probabilistic representations of derivative prices.' },
      { num: '08', title: 'Barrier & Asian Options', tag: '2 WEEKS',
        desc: 'Path-dependent derivatives — up/down · in/out — and the calibration that makes them tradeable.' },
      { num: '09', title: 'Monte Carlo Pricing & Simulation', tag: '2 WEEKS',
        desc: 'Variance reduction, quasi-MC, and Longstaff–Schwartz for early-exercise features.' },
    ],
    outcomes: [
      'Price European, American and exotic options with confidence',
      'Read and reproduce derivatives papers from the literature',
      'Calibrate volatility surfaces and yield curves on real data',
      'Build and validate Monte Carlo pricers in production code',
      'Reason fluently in the language of Greeks and risk',
    ],
    audience: [
      'Mathematicians and physicists moving into quant finance',
      'Software engineers joining a trading or pricing team',
      'Computer scientists with a strong analytical background',
      'Junior quants and researchers seeking a rigorous refresher',
    ],
    instructors: [
      { initials: 'AL', name: 'Practitioner Mentor', role: 'Lead Instructor', bio: '10+ years on the derivatives desk. PhD in stochastic analysis.' },
      { initials: 'NB', name: 'Volatility Modeller',  role: 'Co-instructor',  bio: 'Former head of vol modelling at a top-tier market maker.' },
      { initials: 'YK', name: 'Quant Developer',     role: 'TA Lead',        bio: 'Senior quant developer. Runs the Python implementation track.' },
    ],
    faqs: [
      { q: 'What background do I need?', a: 'A solid grasp of real analysis, probability and linear algebra. Comfort with Python is expected. We do not assume prior finance coursework — the financial intuition is built from first principles.' },
      { q: 'How much time per week should I plan for?', a: 'Roughly 10–20 hours per week across live sessions, problem sets, code and reading. The track is intense by design.' },
      { q: 'Is the program remote or in-person?', a: 'Online. Live sessions stream and are recorded; collaboration happens across the international cohort.' },
      { q: 'Is there a fee?', a: 'No — CMF programs are tuition-free. The only investment we ask for is your time and commitment.' },
      { q: 'What happens to alumni?', a: 'CMF alumni have joined companies like Google, Goldman Sachs, McKinsey and many others — and many return to mentor on the CMF Team.' },
    ],
  },

  ai: {
    tag: 'AI SCHOOL · TRACK 01',
    title: 'AI School @ AI Institute',
    subtitle: 'AI agents, integration engines and AI-native product design',
    intro: 'A builder-focused program inspired by the "learn by building" approach. The frontier has moved from model improvements to AI agents, integration engines and intelligent systems that work inside real products and workflows — and that is what we build.',
    meta: [
      { k: 'Duration', v: 'Until end of July' },
      { k: 'Format', v: 'Online · Saturdays' },
      { k: 'Cohort', v: 'Cohort 01 · 2026' },
      { k: 'Language', v: 'English' },
    ],
    modules: [
      { num: '01', title: 'Development of Integration Engine', tag: '1 WEEK', desc: 'The plumbing that connects LLMs to real tools and data sources.' },
      { num: '02', title: 'Content Transformation', tag: '2 WEEKS', desc: 'Turn dry, technical input into short, useful, human-sounding messages — the cohort\'s flagship project.' },
      { num: '03', title: 'Metrics & Behavioral Framework', tag: '1 WEEK', desc: 'How to evaluate an agent. If it sounds synthetic, it fails — quantify that signal.' },
      { num: '04', title: 'AI-Native Product Design', tag: '2 WEEKS', desc: 'Designing products that feel native to the AI substrate, not bolted-on chatbots.' },
      { num: '05', title: 'Prompt Engineering', tag: '1 WEEK', desc: 'System and user prompts that hold up under production stress.' },
      { num: '06', title: 'AI Product Management & Development', tag: '2 WEEKS', desc: 'The end-to-end lifecycle: scoping, building, evaluating, iterating.' },
      { num: '07', title: 'Interview Preparation', tag: '1 WEEK', desc: 'Mock interviews, system design and offer negotiation for AI roles.' },
    ],
    outcomes: [
      'Ship working AI agents end-to-end with a minimal stack',
      'Design evaluation systems that catch synthetic output',
      'Engineer prompts that behave consistently in production',
      'Combine your work with the AI &amp; Web3 Startup Incubator',
    ],
    audience: [
      'AI engineers moving from research to product',
      'Product builders adding LLM capability to real workflows',
      'Founders and CTOs of early-stage AI startups',
      'Strong technical people who want to ship, not just lecture',
    ],
    instructors: [
      { initials: 'TB', name: 'Timur Bakibayev, PhD', role: 'Lead Instructor', bio: 'PhD in Computer Science (Heidelberg University). Founder of a stealth EdTech startup.' },
      { initials: 'AI', name: 'AI Practitioner', role: 'Co-instructor', bio: 'Builder and product lead with shipped AI-native systems.' },
    ],
    faqs: [
      { q: 'What stack will we use?', a: 'Intentionally minimal: Python + one LLM API (Claude / OpenAI / Gemini — your choice) with Jupyter as the execution layer. No infrastructure abstraction; just building and iterating.' },
      { q: 'What is the entrance exam?', a: 'Build a Content Transformation Agent that turns a dry technical AI update into a short, human-sounding message that makes the reader want to reply "Show me!". You submit architecture, prompts, a real example and a short screencast.' },
      { q: 'Can I combine this with the Startup Incubator?', a: 'Yes — AI School participants can also take part in the AI &amp; Web3 Startup Incubator and turn their work into a real product.' },
      { q: 'Will tokens be provided?', a: 'For the strongest submissions, API tokens are provided for the selected LLM providers.' },
    ],
  },

  options: {
    tag: 'OPTIONS SCHOOL · TRACK 02',
    title: 'Options School',
    subtitle: 'An institutional options framework, applied end-to-end',
    intro: 'A core research & development cohort built around five interconnected components — a backtester, pricing & curve modeling, a crypto options module, a risk &amp; vega-hedging layer, and an AI agent layer that augments the entire workflow.',
    meta: [
      { k: 'Duration', v: '12+ weeks' }, { k: 'Format', v: 'Online · Weekly' },
      { k: 'Cohort', v: 'Cohort 2026' }, { k: 'Language', v: 'English' },
    ],
    modules: [
      { num: '01', title: 'Options Backtester', tag: '3 WEEKS', desc: 'A robust simulation engine for evaluating strategies under realistic market conditions — portfolio-level analysis, regime sensitivity and transaction-cost-aware validation.' },
      { num: '02', title: 'Pricing & Curve Modeling', tag: '3 WEEKS', desc: 'Building and calibrating curves, surfaces and valuation models — especially for illiquid instruments where market data is sparse and standard assumptions break down.' },
      { num: '03', title: 'Crypto Options Module', tag: '2 WEEKS', desc: 'The same institutional framework extended into crypto options — adapted for the specific liquidity, volatility and microstructure characteristics of digital asset markets.' },
      { num: '04', title: 'Portfolio Risk & Vega Hedging', tag: '2 WEEKS', desc: 'A dedicated risk layer for monitoring and managing volatility exposure — vega hedging, surface dynamics and portfolio-level risk decomposition.' },
      { num: '05', title: 'AI Agent Layer', tag: '2 WEEKS', desc: 'An intelligent orchestration layer that augments research and trading workflow — idea generation, monitoring, diagnostics and decision support across the platform.' },
    ],
    outcomes: [
      'Build and operate an institutional options backtester end-to-end',
      'Calibrate pricing models for illiquid and exotic instruments',
      'Extend the framework into crypto options with confidence',
      'Manage vega and surface-dynamic risk at the portfolio level',
      'Augment the workflow with custom AI agent orchestration',
    ],
    audience: [
      'Options traders and quants seeking a rigorous, integrated framework',
      'Engineers building pricing, risk or backtesting infrastructure',
      'Researchers moving from academic finance to the desk',
      'Crypto-options practitioners formalising their stack',
    ],
    instructors: [
      { initials: 'OL', name: 'Options Practitioner', role: 'Lead Instructor', bio: '10+ years pricing and trading vanilla & exotic options.' },
      { initials: 'CR', name: 'Crypto-Options Lead', role: 'Co-instructor', bio: 'Builder of crypto options infrastructure across major venues.' },
      { initials: 'AA', name: 'AI Agent Engineer', role: 'TA Lead', bio: 'Leads the AI orchestration layer across the Options School stack.' },
    ],
    faqs: [
      { q: 'Do I need prior options experience?', a: 'A working knowledge of derivatives is recommended. The Advanced Quantitative Analytics track is a good prerequisite if you need the theory first.' },
      { q: 'What artifacts will I ship?', a: 'A working backtester, a calibrated pricer for illiquid instruments, a crypto-options extension, a vega-hedging layer and an AI agent that orchestrates the whole research workflow.' },
      { q: 'Can I lead a project team?', a: 'Yes — CMF Team participants can apply as Product Owners for small student teams within Options School, HFT School and the Advanced Quantitative Analytics Program.' },
    ],
  },

  hft: {
    tag: 'HFT SCHOOL · TRACK 03',
    title: 'HFT School',
    subtitle: 'High-frequency market making, microstructure and execution',
    intro: 'A focused research track on high-frequency trading — market microstructure, latency-aware system design, market-making strategy, and the execution research that makes systematic trading work at the millisecond scale.',
    meta: [
      { k: 'Duration', v: '12 weeks' }, { k: 'Format', v: 'Online · Weekly' },
      { k: 'Cohort', v: 'Cohort 2026' }, { k: 'Language', v: 'English' },
    ],
    modules: [
      { num: '01', title: 'Market Microstructure', tag: '2 WEEKS', desc: 'Limit order books, queue dynamics, adverse selection — the underlying mechanics of every HFT strategy.' },
      { num: '02', title: 'Market Making Strategy', tag: '2 WEEKS', desc: 'Quoting policies, inventory management and adverse-selection control.' },
      { num: '03', title: 'Execution Research', tag: '2 WEEKS', desc: 'Order routing, child slicing, transaction-cost analysis and impact modeling.' },
      { num: '04', title: 'Latency-aware System Design', tag: '2 WEEKS', desc: 'The engineering that turns theoretical edge into realized PnL — kernel bypass, lockless queues, low-latency networking.' },
      { num: '05', title: 'Machine Learning in HFT', tag: '2 WEEKS', desc: 'Where ML works at high frequency, where it doesn\'t, and how to evaluate it honestly.' },
      { num: '06', title: 'Capstone', tag: '2 WEEKS', desc: 'A market-making research artifact validated on live exchange data with full TCA.' },
    ],
    outcomes: [
      'Reason quantitatively about queue position and adverse selection',
      'Build market-making strategy with inventory and risk controls',
      'Design latency-aware systems with realistic engineering trade-offs',
      'Evaluate execution research with honest, leak-free methodology',
    ],
    audience: [
      'Quants moving into high-frequency systematic strategies',
      'Engineers building exchange-facing trading systems',
      'Researchers interested in market microstructure',
    ],
    instructors: [
      { initials: 'HF', name: 'HFT Practitioner', role: 'Lead Instructor', bio: '10+ years in low-latency market making at a top-tier firm.' },
      { initials: 'EX', name: 'Execution Researcher', role: 'Co-instructor', bio: 'Specialist in execution research and TCA.' },
    ],
    faqs: [
      { q: 'Do I need C++ on day one?', a: 'No — Python is the primary research language. C++ is introduced for latency-critical components when appropriate.' },
      { q: 'Can CMF Team participants lead an HFT project?', a: 'Yes — Product Owner roles for HFT School project teams are open through the CMF Team application.' },
    ],
  },

  fintech: {
    tag: 'FINTECH SCHOOL',
    title: 'FinTech Equity Analyst Program',
    subtitle: 'Investments in fintech, digital assets and AI in finance',
    intro: 'Designed for acting and aspiring equity analysts who wish to explore investments in fintech, digital assets and AI in finance — combining lectures, expert interviews and home assignments with student project presentations.',
    meta: [
      { k: 'Duration', v: 'Until end of June' }, { k: 'Format', v: 'Online · Sundays' },
      { k: 'Cohort', v: 'Cohort 2026' }, { k: 'Language', v: 'English' },
    ],
    modules: [
      { num: '01', title: 'Financial Institution Business Models', tag: '2 WEEKS', desc: 'Value chains by vertical: payments, credit, capital markets and insurance.' },
      { num: '02', title: 'Blockchain & Digital Assets', tag: '1 WEEK', desc: 'How tokens, settlement and custody reshape financial primitives.' },
      { num: '03', title: 'Consumer Sentiment & Product Expectations', tag: '1 WEEK', desc: 'The demand side of fintech — surveys, behavioural signals and product fit.' },
      { num: '04', title: 'Fintech Investable Universe', tag: '2 WEEKS', desc: 'PE and VC holdings, ETF composition, public-company valuation and M&amp;A dynamics.' },
      { num: '05', title: 'Data and AI in Finance', tag: '2 WEEKS', desc: 'Markets for financial data and where AI applications create real value in the industry.' },
      { num: '06', title: 'Policy & Regulation', tag: '1 WEEK', desc: 'Implications for policy, regulation and the durability of fintech business models.' },
    ],
    outcomes: [
      'Value a fintech company from its annual report end-to-end',
      'Build a thesis-driven fintech portfolio across verticals',
      'Identify AI applications most likely to reshape finance',
      'Communicate fintech investment ideas to investment committees',
    ],
    audience: [
      'Acting and aspiring equity analysts',
      'Investors wanting deeper fintech and digital-asset coverage',
      'Strategy and corporate-development professionals',
    ],
    instructors: [
      { initials: 'FT', name: 'FinTech Lead', role: 'Lead Instructor', bio: 'Career equity research across fintech and digital assets.' },
    ],
    faqs: [
      { q: 'What is the admission essay?', a: '"Your Fintech Investment Targets" — three companies you would invest in, your reasoning, what allocations to avoid, and the fintech investor you admire most. 400–500 words, no LLM-generated submissions accepted.' },
      { q: 'How many hours per week?', a: '10–20 hours per week of lectures, self-study and project work.' },
    ],
  },
};

function ProgramDetail({ id }) {
  const p = PROGRAM_DETAILS[id] || PROGRAM_DETAILS.quant;
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <FormulasBg density="med" />
        <div className="container">
          <a href="#/programs" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back to programs</a>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'flex-end' }}>
            <div>
              <span className="program-tag" style={{ marginBottom: 24, display: 'inline-block' }}>{p.tag}</span>
              <h1 className="h-display h1" style={{ marginBottom: 22 }}>{p.title}</h1>
              <p className="subhead" style={{ marginBottom: 24, maxWidth: '20ch' }}>{p.subtitle}</p>
              <p className="lede" style={{ marginBottom: 32 }}>{p.intro}</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#/apply" className="btn btn-gold">Apply now <IconArrow /></a>
                <a href="#syllabus" className="btn btn-outline">View syllabus</a>
              </div>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
                {p.meta.map(m => (
                  <div key={m.k} style={{ padding: '20px 22px', background: 'rgba(14,27,54,0.7)' }}>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>{m.k}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600 }}>{m.v}</div>
                  </div>
                ))}
              </div>
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
            {p.modules.map(m => (
              <div className="module" key={m.num}>
                <div className="module-num">{m.num}</div>
                <div className="module-body">
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
                <div className="module-meta">{m.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes / Audience */}
      <section className="section" style={{ background: 'rgba(14,27,54,0.4)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>/ 02 — Outcomes</span>
              <h3 className="h-display h2" style={{ marginBottom: 28 }}>What you'll<br/>walk away with.</h3>
              <ul className="check-list">
                {p.outcomes.map(o => <li key={o}>{o}</li>)}
              </ul>
            </div>
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>/ 03 — Who it's for</span>
              <h3 className="h-display h2" style={{ marginBottom: 28 }}>Built for those<br/>moving into quant.</h3>
              <ul className="check-list">
                {p.audience.map(a => <li key={a}>{a}</li>)}
              </ul>
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
            {p.instructors.map(i => (
              <div className="team-card" key={i.name}>
                <div className="team-avatar">{i.initials}</div>
                <h5>{i.name}</h5>
                <div className="role">{i.role}</div>
                <p>{i.bio}</p>
              </div>
            ))}
          </div>
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
            {p.faqs.map((f, i) => (
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="plus" />
                </button>
                <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
              </div>
            ))}
          </div>
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
window.PROGRAM_DETAILS = PROGRAM_DETAILS;
