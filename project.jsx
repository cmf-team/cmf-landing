// project.jsx — Project detail page

const PROJECT_DETAILS = {
  'options-backtester': {
    title: 'Options Backtester',
    cohort: 'OPTIONS SCHOOL · CORE R&D',
    summary: 'A robust simulation engine for evaluating options strategies under realistic market conditions — with support for portfolio-level analysis, regime sensitivity and transaction-cost-aware validation.',
    tags: ['Options', 'Backtesting', 'Engine'],
    duration: '2026 · Ongoing',
    team: [
      { initials: 'PR', name: 'Project Lead', role: 'Product Owner' },
      { initials: 'MG', name: 'Strategy Eng.', role: 'Strategy Logic' },
      { initials: 'LT', name: 'Infra Eng.', role: 'Simulation Core' },
      { initials: 'AB', name: 'Research', role: 'Validation' },
    ],
    metrics: [
      { v: 'Portfolio', l: 'Multi-leg support' },
      { v: 'Regime-aware', l: 'Stress scenarios' },
      { v: 'TCA-built-in', l: 'Realistic costs' },
      { v: 'Tick-level', l: 'Granularity' },
    ],
    problem: {
      title: 'The problem',
      paras: [
        'Options strategies that look attractive in a simplified backtest can fall apart under realistic execution, regime shifts and book-level risk constraints. A research-grade backtester needs to capture all three honestly.',
        'Existing open-source backtesters tend to specialize: portfolio analytics without proper greek-aware execution, or single-strategy simulators without portfolio aggregation. The desk needed one engine that did both.',
      ],
      chart: { variant: 'bars', label: 'Strategy PnL across stress regimes' },
    },
    approach: {
      title: 'Our approach',
      paras: [
        'A modular simulation core decouples market data, pricing, strategy logic and portfolio aggregation — each component pluggable and individually testable. Strategies are scripted as event-driven generators that react to a synchronized clock of quotes, fills and corporate actions.',
        'Transaction cost modeling is first-class: spread cost, exchange fees, gamma-aware slippage and an optional impact model calibrated from execution traces. Regime sensitivity is built in via parametric scenario overlays.',
      ],
      list: [
        { t: 'Event-driven simulation core', d: 'Synchronized clock over quotes, fills and corporate actions.' },
        { t: 'Greek-aware execution layer', d: 'Honest fills with spread, fees and impact.' },
        { t: 'Portfolio aggregation', d: 'Multi-strategy, multi-underlier book accounting.' },
        { t: 'Regime overlays', d: 'Stress scenarios layered on historical replay.' },
      ],
      chart: { variant: 'curve', label: 'Cumulative PnL · validation strategy' },
    },
    results: {
      title: 'Results & impact',
      paras: [
        'The backtester is now the standard evaluation engine across Options School projects. New strategy ideas move from notebook to portfolio-level evaluation in under a day, with TCA and regime sensitivity built in.',
        'Code is open-sourced to the CMF Team for reuse across HFT and Advanced Quant Analytics tracks.',
      ],
      chart: { variant: 'heatmap', label: 'Strategy × regime sensitivity matrix' },
    },
  },

  'pricing-curve': {
    title: 'Pricing & Curve Modeling',
    cohort: 'OPTIONS SCHOOL · PRICING',
    summary: 'A specialized pricing track focused on building and calibrating curves, surfaces and valuation models — especially for illiquid instruments where market data is sparse and standard assumptions break down.',
    tags: ['Options', 'Pricing', 'Calibration'],
    duration: '2026 · Ongoing',
    team: [
      { initials: 'SD', name: 'Project Lead', role: 'Lead Quant' },
      { initials: 'KP', name: 'Modeling', role: 'Surface Construction' },
      { initials: 'BJ', name: 'Infrastructure', role: 'Calibration Engine' },
    ],
    metrics: [
      { v: 'Arb-free', l: 'Surface construction' },
      { v: 'Illiquid', l: 'Specialized focus' },
      { v: 'Multi-asset', l: 'Cross-product' },
      { v: 'Calibrated', l: 'On real quotes' },
    ],
    problem: {
      title: 'The problem',
      paras: [
        'Standard pricing pipelines assume liquid, two-sided quotes across a dense grid. Reality is sparser — wide spreads, stale prices, missing tenors and wing-only quotes that defeat naive calibration.',
        'Downstream consumers — hedge engines, exotic pricers and risk dashboards — need a smooth, stable, arbitrage-free surface even when the input quote stream is messy.',
      ],
      chart: { variant: 'surface', label: 'Implied vol surface · illiquid instrument' },
    },
    approach: {
      title: 'Our approach',
      paras: [
        'We layer an arbitrage-free parameterization (SSVI-style) over a constrained per-slice refinement, with bespoke quote cleaning and weighting. The wings of illiquid surfaces are stabilized using cross-product invariants — put-call parity, calendar relationships and synthetic far-strike anchors.',
        'The calibration runs in milliseconds per slice with a homotopy warm-start from the previous tick, making it suitable for both research notebooks and production hedge engines.',
      ],
      list: [
        { t: 'Arbitrage-free skeleton', d: 'No-arb-by-construction parameterization across tenors.' },
        { t: 'Sparse-quote handling', d: 'Synthetic anchors when wings are unobservable.' },
        { t: 'Cross-product invariants', d: 'Parity and calendar conditions for stability.' },
        { t: 'Warm-started solver', d: 'Custom Jacobians, homotopy in calibration time.' },
      ],
      chart: { variant: 'curve', label: 'Slice fit · 30-day expiry · log-moneyness' },
    },
    results: {
      title: 'Results & impact',
      paras: [
        'Stable, arbitrage-free surfaces produced even on illiquid instruments where naive SVI fails. The framework is consumed by the backtester, the vega-hedging risk layer and the crypto options module — making it the pricing backbone of Options School.',
      ],
      chart: { variant: 'heatmap', label: 'Calibration residuals · strikes × tenors' },
    },
  },

  'crypto-options': {
    title: 'Crypto Options Module',
    cohort: 'OPTIONS SCHOOL · CRYPTO',
    summary: 'An extension of the same institutional framework into crypto options — adapted for the specific liquidity, volatility and microstructure characteristics of digital asset markets.',
    tags: ['Options', 'Crypto', 'DeFi'],
    duration: '2026 · Ongoing',
    team: [
      { initials: 'ZH', name: 'Project Lead', role: 'Crypto Lead' },
      { initials: 'OA', name: 'On-chain Eng.', role: 'Venue Integration' },
      { initials: 'EN', name: 'Risk', role: 'Adapted Hedging' },
    ],
    metrics: [
      { v: 'Multi-venue', l: 'Centralised + on-chain' },
      { v: 'Higher vol', l: 'Regime-aware' },
      { v: '24/7', l: 'Continuous markets' },
      { v: 'Adapted', l: 'Microstructure-aware' },
    ],
    problem: {
      title: 'The problem',
      paras: [
        'Crypto options inherit the institutional toolkit but operate under very different market conditions — wider spreads, jumpier underlyings, 24/7 trading, fragmented venues and a mix of centralized and on-chain liquidity.',
        'Naively porting equity-options infrastructure produces strategies that look profitable on paper but break under crypto regime shifts and execution constraints.',
      ],
      chart: { variant: 'orderbook', label: 'Crypto options · order book depth' },
    },
    approach: {
      title: 'Our approach',
      paras: [
        'We re-use the same pricing, backtesting and risk infrastructure but adapt the calibration priors, regime overlays and execution layer to crypto realities — fatter tails in the implied distribution, 24/7 funding and the cross-venue dynamics of CEX and DEX liquidity.',
      ],
      list: [
        { t: 'Crypto-tuned priors', d: 'Fatter-tail-aware calibration for surface construction.' },
        { t: 'CEX + DEX integration', d: 'Unified view across centralised and on-chain venues.' },
        { t: '24/7 portfolio risk', d: 'Continuous-market risk and funding accounting.' },
      ],
      chart: { variant: 'curve', label: 'Realized vs implied vol · BTC options' },
    },
    results: {
      title: 'Results & impact',
      paras: [
        'A working crypto-options stack sharing the same backtester, pricing engine and risk layer as the institutional Options School framework — closing the gap between traditional and digital-asset options research.',
      ],
      chart: { variant: 'network', label: 'Cross-venue liquidity graph' },
    },
  },

  'vega-hedging': {
    title: 'Portfolio Risk & Vega Hedging',
    cohort: 'OPTIONS SCHOOL · RISK',
    summary: 'A dedicated risk layer for monitoring and managing volatility exposure across the options book — vega hedging, surface dynamics and portfolio-level risk decomposition.',
    tags: ['Options', 'Risk', 'Hedging'],
    duration: '2026 · Ongoing',
    team: [
      { initials: 'AH', name: 'Project Lead', role: 'Risk Lead' },
      { initials: 'NV', name: 'Quant', role: 'Hedging Logic' },
    ],
    metrics: [
      { v: 'Vega', l: 'Primary axis' },
      { v: 'Surface-aware', l: 'Bucketed hedging' },
      { v: 'Portfolio', l: 'Cross-book' },
      { v: 'Live', l: 'Continuously hedged' },
    ],
    problem: { title: 'The problem', paras: ['Delta-hedging an options book is well-understood. Vega hedging — and the higher-order surface-dynamic exposures behind it — is where most desks accumulate quiet, unmeasured risk.'], chart: { variant: 'heatmap', label: 'Vega exposure by strike × tenor' } },
    approach: { title: 'Our approach', paras: ['A surface-aware vega bucketing scheme combined with a portfolio-level optimizer that proposes hedge trades minimising tracking error against a target risk profile. The optimizer is cost-aware and respects venue-specific liquidity constraints.'], list: [{ t: 'Bucketed vega', d: 'Strike × tenor decomposition.' }, { t: 'Surface dynamics', d: 'Skew and term-structure sensitivities.' }, { t: 'Cost-aware optimizer', d: 'Minimises hedge tracking under cost limits.' }], chart: { variant: 'curve', label: 'Hedged vs unhedged PnL' } },
    results: { title: 'Results & impact', paras: ['Portfolio-level vega exposure is now continuously monitored and hedged within agreed tolerances. The layer is consumed by the backtester and the AI agent layer for live decision support.'], chart: { variant: 'bars', label: 'Hedge cost by regime' } },
  },

  'ai-agent-layer': {
    title: 'AI Agent Layer',
    cohort: 'AI SCHOOL × OPTIONS SCHOOL',
    summary: 'An intelligent orchestration layer that augments the research and trading workflow — supporting idea generation, monitoring, diagnostics and decision support across the platform.',
    tags: ['AI', 'Agents', 'Orchestration'],
    duration: '2026 · Ongoing',
    team: [
      { initials: 'TB', name: 'AI Lead', role: 'AI School Lead' },
      { initials: 'IL', name: 'Agent Eng.', role: 'Orchestration' },
      { initials: 'KW', name: 'Eval', role: 'Behavior Framework' },
    ],
    metrics: [
      { v: 'Multi-tool', l: 'Integration engine' },
      { v: 'Honest', l: 'Eval-driven design' },
      { v: 'Human-feeling', l: 'No synthetic tone' },
      { v: 'Production', l: 'Reliable behaviour' },
    ],
    problem: { title: 'The problem', paras: ['Modern research desks have great tools but poor orchestration: dashboards, backtesters, risk layers and notebooks all live in separate windows. Manual context-switching is where real productivity gets lost.'], chart: { variant: 'network', label: 'Workflow graph · agent reach' } },
    approach: { title: 'Our approach', paras: ['A lean stack — Python + one LLM API + Jupyter — and an integration engine that exposes the backtester, pricer, risk layer and market-data tools as agent-callable functions. Evaluation is honest by design: if the agent sounds synthetic, it fails.'], list: [{ t: 'Integration engine', d: 'LLM ↔ research tools through typed function calls.' }, { t: 'Behavioral framework', d: 'Quantitative checks that catch AI slop.' }, { t: 'Content transformation', d: 'Dense diagnostics → short, useful messages.' }], chart: { variant: 'curve', label: 'Task success rate over iterations' } },
    results: { title: 'Results & impact', paras: ['The agent layer is now the connective tissue across CMF\'s research stack — proposing experiments, summarising risk reports, monitoring live PnL and surfacing diagnostics in plain language.'], chart: { variant: 'heatmap', label: 'Agent performance by task type' } },
  },

  'hft-market-making': {
    title: 'HFT Market Making',
    cohort: 'HFT SCHOOL · CORE',
    summary: 'Latency-aware market making research with inventory-management and adverse-selection controls — validated on live exchange feeds.',
    tags: ['HFT', 'Microstructure', 'Market Making'],
    duration: '2026 · Ongoing',
    team: [{ initials: 'TG', name: 'Project Lead', role: 'HFT Lead' }, { initials: 'RD', name: 'Quant', role: 'Strategy' }],
    metrics: [{ v: 'Queue-aware', l: 'Microstructure logic' }, { v: 'Inventory', l: 'Risk-controlled' }, { v: 'Live', l: 'On exchange feeds' }, { v: 'Low-latency', l: 'System design' }],
    problem: { title: 'The problem', paras: ['Successful market making at high frequency hinges on three coupled problems: queue position, adverse selection, and inventory risk — each easy in isolation, brutal when combined.'], chart: { variant: 'orderbook', label: 'Order book snapshot · top-of-book' } },
    approach: { title: 'Our approach', paras: ['Quoting policy with queue-position estimation, adaptive spreads and inventory-aware skews. Latency-critical components in optimized Python with C++ extensions where the budget demands it.'], list: [{ t: 'Queue estimation', d: 'Probability of fill given current state.' }, { t: 'Inventory skews', d: 'Quote adjustments to manage position.' }, { t: 'Adverse-selection control', d: 'Quote widening on toxic flow signals.' }], chart: { variant: 'bars', label: 'Daily PnL distribution' } },
    results: { title: 'Results & impact', paras: ['A validated market-making research stack that the cohort uses as a foundation for further execution research.'], chart: { variant: 'curve', label: 'Cumulative PnL · live validation' } },
  },
};

function ProjectDetail({ id }) {
  const p = PROJECT_DETAILS[id] || PROJECT_DETAILS['options-backtester'];
  useEffect(() => { window.scrollTo({ top: 0 }); }, [id]);

  // Related: 3 other projects
  const related = Object.entries(PROJECT_DETAILS).filter(([k]) => k !== id).slice(0, 3);

  return (
    <>
      <section className="page-hero">
        <FormulasBg density="low" />
        <div className="container">
          <a href="#/portfolio" className="back-link"><span style={{ display: 'inline-block', transform: 'rotate(180deg)' }}><IconArrow /></span> Back to portfolio</a>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 60, alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
                {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                <span className="tag muted">{p.cohort}</span>
              </div>
              <h1 className="h-display h1" style={{ marginBottom: 28, textTransform: 'none', letterSpacing: '-0.02em' }}>{p.title}</h1>
              <p className="lede" style={{ fontSize: 18 }}>{p.summary}</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 32 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 14 }}>Project meta</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Duration</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 4 }}>{p.duration}</div></div>
                <div><div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Track</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 4 }}>{p.cohort}</div></div>
                <div><div className="mono" style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Status</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 4, color: 'var(--gold)' }}>Active</div></div>
              </div>
            </div>
          </div>

          {/* metrics row */}
          <div className="metrics" style={{ marginTop: 56 }}>
            {p.metrics.map(m => (
              <div className="metric" key={m.l}>
                <div className="metric-val">{m.v}</div>
                <div className="metric-label">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="container">
          <div className="proj-section">
            <div className="proj-section-label"><span className="num">01</span>{p.problem.title}</div>
            <div>
              <h3>The unsolved part of the desk's workflow.</h3>
              {p.problem.paras.map((para, i) => <p key={i}>{para}</p>)}
              {p.problem.chart && (
                <div className="chart-frame">
                  <div className="chart-frame-head">
                    <h6>{p.problem.chart.label}</h6>
                    <span className="pill">Fig. 01</span>
                  </div>
                  <ChartThumb variant={p.problem.chart.variant} tint="gold" />
                </div>
              )}
            </div>
          </div>

          {/* APPROACH */}
          <div className="proj-section">
            <div className="proj-section-label"><span className="num">02</span>{p.approach.title}</div>
            <div>
              <h3>How we built it.</h3>
              {p.approach.paras.map((para, i) => <p key={i}>{para}</p>)}
              {p.approach.list && (
                <ul className="check-list" style={{ marginTop: 24 }}>
                  {p.approach.list.map((it, i) => (
                    <li key={i}><b>{it.t}</b> &nbsp;— {it.d || it.p}</li>
                  ))}
                </ul>
              )}
              {p.approach.chart && (
                <div className="chart-frame">
                  <div className="chart-frame-head">
                    <h6>{p.approach.chart.label}</h6>
                    <span className="pill">Fig. 02</span>
                  </div>
                  <ChartThumb variant={p.approach.chart.variant} tint="gold" />
                </div>
              )}
            </div>
          </div>

          {/* RESULTS */}
          <div className="proj-section">
            <div className="proj-section-label"><span className="num">03</span>{p.results.title}</div>
            <div>
              <h3>What landed in production.</h3>
              {p.results.paras.map((para, i) => <p key={i}>{para}</p>)}
              {p.results.chart && (
                <div className="chart-frame">
                  <div className="chart-frame-head">
                    <h6>{p.results.chart.label}</h6>
                    <span className="pill">Fig. 03</span>
                  </div>
                  <ChartThumb variant={p.results.chart.variant} tint="gold" />
                </div>
              )}
            </div>
          </div>

          {/* TEAM */}
          <div className="proj-section">
            <div className="proj-section-label"><span className="num">04</span>The team</div>
            <div>
              <h3>Built by the cohort.</h3>
              <p>A small project team led by a CMF Team Product Owner, supported by mentor practitioners with 10+ years of experience and exceptionally strong students from the school.</p>
              <div className="team-grid" style={{ marginTop: 28, gridTemplateColumns: `repeat(${Math.min(4, p.team.length)}, 1fr)` }}>
                {p.team.map(t => (
                  <div className="team-card" key={t.name}>
                    <div className="team-avatar">{t.initials}</div>
                    <h5>{t.name}</h5>
                    <div className="role">{t.role}</div>
                  </div>
                ))}
              </div>
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
            {related.map(([k, r]) => {
              const proj = PROJECTS.find(x => x.id === k) || { variant: 'curve', tint: 'gold' };
              return (
                <a key={k} href={`#/project/${k}`} className="card card-corners project-card">
                  <ChartThumb variant={proj.variant} tint={proj.tint} />
                  <div className="project-body">
                    <div className="project-tags">
                      {r.tags.slice(0, 2).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <h4>{r.title}</h4>
                    <p>{r.summary}</p>
                    <span className="card-link">Read more</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

window.ProjectDetail = ProjectDetail;
window.PROJECT_DETAILS = PROJECT_DETAILS;
