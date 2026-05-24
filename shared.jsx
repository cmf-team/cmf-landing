// shared.jsx — Nav, Footer, decorative visuals, icons
const { useState, useEffect, useRef, useMemo } = React;

// ---------- Tex (LaTeX rendering via KaTeX) ----------
function Tex({ latex, children, display = false, className = '' }) {
  const src = typeof latex === 'string' ? latex
            : typeof children === 'string' ? children
            : Array.isArray(children) ? children.filter(c => typeof c === 'string').join('')
            : '';
  const ref = useRef(null);
  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.katex);
  useEffect(() => {
    if (window.katex) { setReady(true); return; }
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (window.katex) setReady(true);
      else setTimeout(tick, 80);
    };
    tick();
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!ready || !ref.current) return;
    try {
      window.katex.render(src, ref.current, {
        displayMode: display,
        throwOnError: false,
        output: 'html',
      });
    } catch (e) { /* noop */ }
  }, [ready, src, display]);
  return <span ref={ref} className={`tex ${className}`} />;
}

// ---------- Navigation ----------
function Nav({ route }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#/', label: 'Home', match: ['', 'home'] },
    { href: '#/programs', label: 'Programs', match: ['programs', 'program'] },
    { href: '#/portfolio', label: 'Portfolio', match: ['portfolio', 'project'] },
    { href: '#/about', label: 'About', match: ['about'] },
    { href: '#/contact', label: 'Contact', match: ['contact'] },
  ];
  const activeKey = route.split('/')[0] || '';

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#/" className="brand" aria-label="CMF home">
          <img src="assets/cmf-logo-white.png" alt="CMF" className="brand-mark" />
          <div className="brand-text">
            <b>CMF</b>
            <span>Center of Mathematical Finance</span>
          </div>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`nav-link desktop-only ${l.match.includes(activeKey) ? 'active' : ''}`}
            >
              {l.label}
            </a>
          ))}
          <a href="#/apply" className="btn btn-gold btn-sm">Apply</a>
        </nav>
      </div>
    </header>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#/" className="brand">
              <img src="assets/cmf-logo-white.png" alt="CMF" className="brand-mark" />
              <div className="brand-text">
                <b>CMF</b>
                <span>Center of Mathematical Finance</span>
              </div>
            </a>
            <p>An impact-driven international educational initiative for people with high ethical values and strong technical skills. Tuition-free programs supporting talented individuals, especially from developing countries.</p>
            <div className="footer-social">
              <a href="https://www.linkedin.com/school/cmf-ynvrsty" target="_blank" rel="noopener" aria-label="LinkedIn"><IconLinkedIn /></a>
              <a href="https://github.com/cmf-team" target="_blank" rel="noopener" aria-label="GitHub"><IconGitHub /></a>
              <a href="https://www.youtube.com/@CMF_YNVRSTY" target="_blank" rel="noopener" aria-label="YouTube"><IconYouTube /></a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Schools</h5>
            <ul>
              <li><a href="#/program/ai">AI School</a></li>
              <li><a href="#/program/options">Options School</a></li>
              <li><a href="#/program/hft">HFT School</a></li>
              <li><a href="#/program/quant">Adv. Quant Analytics</a></li>
              <li><a href="#/program/fintech">FinTech School</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Portfolio</h5>
            <ul>
              <li><a href="#/project/options-backtester">Options Backtester</a></li>
              <li><a href="#/project/pricing-curve">Pricing & Curves</a></li>
              <li><a href="#/project/ai-agent-layer">AI Agent Layer</a></li>
              <li><a href="#/portfolio">All projects</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>About</h5>
            <ul>
              <li><a href="#/about">Our mission</a></li>
              <li><a href="#/about">CMF Team</a></li>
              <li><a href="#/about">Alumni</a></li>
              <li><a href="#/about">YNVRSTY</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:admissions@cmf.edu">admissions@cmf.edu</a></li>
              <li><a href="#/contact">Join CMF Team</a></li>
              <li><a href="#/contact">Partnerships</a></li>
              <li><a href="#/contact">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Center of Mathematical Finance. Impact-driven · International · Tuition-free.</span>
          <span>v 2026.1 · Cohort active</span>
        </div>
      </div>
    </footer>
  );
}

// ---------- 3D Wireframe Surface Plot ----------
// Renders a parametric grid surface z = a·exp(-r²/σ²) projected isometrically,
// with a strong radial glow underneath — matches the inspiration image.
// Static render (computed once via useMemo); subtle motion comes from CSS so it
// stays smooth even on slower machines.
function WireframeSurface({ width = 560, height = 480 }) {
  const N = 32;
  const cx = width / 2, cy = height * 0.70;
  // axonometric basis
  const ax = 16, bx = 16;
  const ay = -8, by = 8;
  const zk = 230;

  const project = (i, j) => {
    const x = (i - N/2) / (N/2);
    const y = (j - N/2) / (N/2);
    const r2 = x*x + y*y;
    const z = Math.exp(-r2 * 2.0) * 0.95;
    const sx = cx + (x * ax + y * bx) * N / 1.6;
    const sy = cy + (x * ay + y * by) * N / 1.6 - z * zk;
    return { sx, sy, z };
  };

  const { lines, peak } = useMemo(() => {
    const ls = [];
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const p = project(i, j);
        if (i < N - 1) {
          const q = project(i + 1, j);
          ls.push({ x1: p.sx, y1: p.sy, x2: q.sx, y2: q.sy, z: (p.z + q.z)/2 });
        }
        if (j < N - 1) {
          const q = project(i, j + 1);
          ls.push({ x1: p.sx, y1: p.sy, x2: q.sx, y2: q.sy, z: (p.z + q.z)/2 });
        }
      }
    }
    return { lines: ls, peak: project(N/2, N/2) };
  }, [width, height]);

  return (
    <svg className="surface-svg" viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        {/* soft glow filter */}
        <filter id="surfaceGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b1" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="peakGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* base floor radial glow */}
        <radialGradient id="floorGlow" cx="50%" cy="68%" r="55%">
          <stop offset="0%" stopColor="#6FB8FF" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#4880C8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1A3A6A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="peakHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0F0FF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#6FB8FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6FB8FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* big diffuse floor halo — pulses slowly */}
      <ellipse className="surface-halo" cx={cx} cy={cy + 10} rx={width * 0.5} ry={height * 0.28} fill="url(#floorGlow)" />

      {/* halo around the peak — pulses slowly */}
      <circle className="surface-peak-halo" cx={peak.sx} cy={peak.sy} r="120" fill="url(#peakHalo)" />

      {/* the surface itself rotates very slowly around the peak */}
      <g className="surface-rotor" style={{ transformOrigin: `${peak.sx}px ${peak.sy}px` }}>
        {/* blurred copy underneath for soft outer glow */}
        <g filter="url(#bigGlow)" opacity="0.55">
          {lines.map((l, i) => {
            const z = Math.max(0, Math.min(1, l.z));
            if (z < 0.05) return null;
            return <line key={`g${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#88CCFF" strokeOpacity={0.6 * z + 0.1} strokeWidth="1.2" />;
          })}
        </g>

        {/* main surface — sharper, with mild glow */}
        <g filter="url(#surfaceGlow)">
          {lines.map((l, i) => {
            const z = Math.max(0, Math.min(1, l.z));
            const color = z > 0.75
              ? `rgba(220, 240, 255, ${0.85 + z * 0.15})`
              : z > 0.45
                ? `rgba(150, 210, 255, ${0.55 + z * 0.35})`
                : z > 0.20
                  ? `rgba(110, 175, 230, ${0.35 + z * 0.45})`
                  : `rgba(80, 130, 200, ${0.18 + z * 0.4})`;
            return <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth={z > 0.6 ? 1.1 : 0.85} />;
          })}
        </g>
      </g>

      {/* bright peak point — stays on top */}
      <g filter="url(#peakGlow)">
        <circle cx={peak.sx} cy={peak.sy} r="6" fill="#FFFFFF" opacity="0.9" />
      </g>
      <circle cx={peak.sx} cy={peak.sy} r="3" fill="#FFFFFF" />
      <circle className="surface-peak-ring" cx={peak.sx} cy={peak.sy} r="14" fill="none" stroke="#A8D8FF" strokeOpacity="0.5" strokeWidth="0.8" />
    </svg>
  );
}

// ---------- Background Formulas ----------
function FormulasBg({ density = 'med' }) {
  const items = [
    { f: 'dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t',           x: '6%',  y: '12%', s: 1.0 },
    { f: 'C_t + \\tfrac{1}{2}\\sigma^2 S_t^2 C_{SS} + rS_t C_S - rC = 0', x: '54%', y: '6%', s: 0.95 },
    { f: '\\nu = \\dfrac{\\partial C}{\\partial \\sigma}',      x: '80%', y: '34%', s: 1.0 },
    { f: 'C = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[H_T]',         x: '10%', y: '48%', s: 1.0 },
    { f: '\\Delta = \\dfrac{\\partial C}{\\partial S}',         x: '4%',  y: '78%', s: 1.0 },
    { f: '\\Gamma = \\dfrac{\\partial^2 C}{\\partial S^2}',     x: '70%', y: '72%', s: 1.0 },
    { f: '\\sigma\\sqrt{T}',                                     x: '46%', y: '88%', s: 1.0 },
    { f: 'dB_t = \\sqrt{t}\\,Z',                                 x: '34%', y: '20%', s: 0.9 },
    { f: 'M_t = \\mathbb{E}[X\\mid \\mathcal{F}_t]',             x: '88%', y: '58%', s: 0.85 },
    { f: 'L_t = \\log(S_t/S_{t-1})',                             x: '24%', y: '64%', s: 0.9 },
  ];
  const max = density === 'low' ? 4 : density === 'high' ? items.length : 7;
  return (
    <div className="bg-formulas" aria-hidden>
      {items.slice(0, max).map((it, i) => (
        <span key={i} style={{ left: it.x, top: it.y, fontSize: `${15 * it.s}px` }}>
          <Tex latex={it.f} />
        </span>
      ))}
    </div>
  );
}

// ---------- Project thumbnail (synthetic chart) ----------
function ChartThumb({ variant = 'curve', tint = 'gold' }) {
  // simple deterministic synthetic chart based on variant
  const W = 400, H = 250;
  const stroke = tint === 'gold' ? '#E4A93C' : tint === 'blue' ? '#6FA8E8' : '#9FD0B5';
  if (variant === 'surface') {
    return (
      <div className="project-thumb">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`g-${variant}-${tint}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={stroke} stopOpacity="0.4" />
              <stop offset="1" stopColor={stroke} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="rgba(14,27,54,0.6)" />
          {Array.from({ length: 14 }).map((_, i) => {
            const cx2 = W / 2, cy2 = H * 0.75;
            const radius = 14 + i * 10;
            return (
              <ellipse key={i} cx={cx2} cy={cy2 - i * 8} rx={radius * 1.2} ry={radius * 0.45}
                fill="none" stroke={stroke} strokeOpacity={0.18 + i * 0.04} strokeWidth="0.7" />
            );
          })}
        </svg>
      </div>
    );
  }
  if (variant === 'bars') {
    return (
      <div className="project-thumb">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
          <rect width={W} height={H} fill="rgba(14,27,54,0.6)" />
          {Array.from({ length: 18 }).map((_, i) => {
            const h = 30 + Math.sin(i * 0.9) * 40 + Math.cos(i * 0.4) * 30 + 40;
            return <rect key={i} x={20 + i * 21} y={H - h - 30} width="12" height={h} fill={stroke} opacity={0.4 + (i % 5) * 0.1} />;
          })}
          <line x1="0" y1={H - 30} x2={W} y2={H - 30} stroke="rgba(255,255,255,0.12)" />
        </svg>
      </div>
    );
  }
  if (variant === 'heatmap') {
    return (
      <div className="project-thumb">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
          <rect width={W} height={H} fill="rgba(14,27,54,0.6)" />
          {Array.from({ length: 10 }).map((_, j) =>
            Array.from({ length: 16 }).map((_, i) => {
              const v = Math.sin(i * 0.4 + j * 0.6) * 0.5 + 0.5;
              return <rect key={`${i}-${j}`} x={20 + i * 22} y={15 + j * 22} width="20" height="20" fill={stroke} opacity={v * 0.7} />;
            })
          )}
        </svg>
      </div>
    );
  }
  if (variant === 'network') {
    const pts = Array.from({ length: 16 }).map((_, i) => ({
      x: (i % 4) * 90 + 50 + (i * 13) % 30,
      y: Math.floor(i / 4) * 60 + 30 + (i * 17) % 25,
    }));
    return (
      <div className="project-thumb">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
          <rect width={W} height={H} fill="rgba(14,27,54,0.6)" />
          {pts.map((p, i) => pts.slice(i + 1).map((q, j) => {
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d > 120) return null;
            return <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={stroke} strokeOpacity={Math.max(0.06, 0.4 - d / 300)} strokeWidth="0.7" />;
          }))}
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3 + (i % 3)} fill={stroke} opacity="0.9" />)}
        </svg>
      </div>
    );
  }
  if (variant === 'orderbook') {
    return (
      <div className="project-thumb">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
          <rect width={W} height={H} fill="rgba(14,27,54,0.6)" />
          {Array.from({ length: 12 }).map((_, i) => {
            const bidLen = 30 + Math.cos(i * 0.7) * 40 + 80;
            const askLen = 30 + Math.sin(i * 0.6) * 40 + 80;
            return (
              <g key={i}>
                <rect x={W/2 - bidLen} y={20 + i * 17} width={bidLen} height="10" fill="#6FA8E8" opacity={0.35 - i * 0.02} />
                <rect x={W/2} y={20 + i * 17} width={askLen} height="10" fill={stroke} opacity={0.4 - i * 0.02} />
              </g>
            );
          })}
          <line x1={W/2} y1="0" x2={W/2} y2={H} stroke="rgba(255,255,255,0.2)" />
        </svg>
      </div>
    );
  }
  // default: yield curve
  const points = Array.from({ length: 30 }).map((_, i) => {
    const t = i / 29;
    const y = H - 40 - Math.log(1 + t * 8) * 50 - Math.sin(t * 3) * 8;
    return [30 + t * (W - 60), y];
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${path} L ${W - 30} ${H - 30} L 30 ${H - 30} Z`;
  return (
    <div className="project-thumb">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gc-${tint}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="1" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="rgba(14,27,54,0.6)" />
        {/* gridlines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1="0" x2={W} y1={(i + 1) * H / 6} y2={(i + 1) * H / 6} stroke="rgba(255,255,255,0.06)" />
        ))}
        <path d={area} fill={`url(#gc-${tint})`} />
        <path d={path} stroke={stroke} strokeWidth="1.6" fill="none" />
        {points.filter((_, i) => i % 6 === 0).map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={stroke} />
        ))}
      </svg>
    </div>
  );
}

// ---------- Icons ----------
function Icon({ children, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const IconRigor = () => <Icon><path d="M4 20 L4 4 M4 20 L20 20" /><path d="M7 16 L10 12 L13 14 L20 6" /><circle cx="20" cy="6" r="1.5" fill="currentColor" /></Icon>;
const IconPractice = () => <Icon><rect x="3" y="4" width="18" height="14" rx="1" /><path d="M3 9 L21 9" /><path d="M8 14 L10 14 M12 14 L16 14" /></Icon>;
const IconIntuition = () => <Icon><circle cx="12" cy="12" r="3" /><path d="M12 4 V6 M12 18 V20 M4 12 H6 M18 12 H20 M6.3 6.3 L7.7 7.7 M16.3 16.3 L17.7 17.7 M6.3 17.7 L7.7 16.3 M16.3 7.7 L17.7 6.3" /></Icon>;

const IconAI = () => <Icon><rect x="6" y="6" width="12" height="12" rx="1" /><path d="M9 9 H15 M9 12 H13 M9 15 H11" /><circle cx="6" cy="6" r="1" /><circle cx="18" cy="6" r="1" /><circle cx="6" cy="18" r="1" /><circle cx="18" cy="18" r="1" /></Icon>;
const IconWeb3 = () => <Icon><path d="M12 3 L20 8 L20 16 L12 21 L4 16 L4 8 Z" /><path d="M12 3 L12 21 M4 8 L20 16 M4 16 L20 8" /></Icon>;
const IconQuant = () => <Icon><path d="M4 18 L4 4 M4 18 L20 18" /><path d="M4 14 C8 14, 8 6, 12 6 C16 6, 16 14, 20 14" /><circle cx="12" cy="6" r="1.2" fill="currentColor"/></Icon>;
const IconDS = () => <Icon><ellipse cx="12" cy="6" rx="8" ry="2.5" /><path d="M4 6 V12 C4 13.5, 7.6 14.5, 12 14.5 S20 13.5, 20 12 V6" /><path d="M4 12 V18 C4 19.5, 7.6 20.5, 12 20.5 S20 19.5, 20 18 V12" /></Icon>;
const IconOptions = () => <Icon><path d="M3 17 L8 12 L11 14 L16 8 L21 11" /><path d="M21 7 V11 H17" /><path d="M3 21 H21" /></Icon>;
const IconHFT = () => <Icon><path d="M4 14 L8 14 L10 8 L14 18 L16 12 L20 12" /><circle cx="20" cy="6" r="2" /><path d="M14 6 L18 6" /></Icon>;
const IconFinTech = () => <Icon><rect x="3" y="6" width="18" height="12" rx="1" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9 H7 M17 15 H18" /><path d="M3 10 H21 M3 14 H21" strokeOpacity="0.4" /></Icon>;
const IconIncubator = () => <Icon><path d="M12 3 C8 6, 8 11, 12 13 C16 11, 16 6, 12 3 Z" /><path d="M12 13 V21" /><path d="M8 17 L12 21 L16 17" /></Icon>;

const IconArrow = () => <Icon size={14}><path d="M5 12 H19 M13 6 L19 12 L13 18" /></Icon>;

const IconLinkedIn = () => <Icon size={16}><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M8 10 V17 M8 7 V7.01 M12 17 V13 C12 11.5, 13 11, 14 11 S16 11.5, 16 13 V17" /></Icon>;
const IconGitHub = () => <Icon size={16}><path d="M9 19 C5 20 5 16 3 16 M15 20 V17.5 C15 16, 14 15.5, 14 15.5 C17 15.2, 19 14 19 9.5 C19 8.3, 18.5 7 17.8 6 C17.9 5.5, 18 4.3, 17.6 3 C17.6 3, 16.5 3, 15 4 C13 3.5, 11 3.5, 9 4 C7.5 3, 6.4 3, 6.4 3 C6 4.3, 6.1 5.5, 6.2 6 C5.5 7, 5 8.3, 5 9.5 C5 14, 7 15.2, 10 15.5 C10 15.5, 9 16, 9 17.5 V20" /></Icon>;
const IconX = () => <Icon size={16}><path d="M4 4 L20 20 M20 4 L4 20" /></Icon>;
const IconYouTube = () => <Icon size={16}><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M10 9 L15 12 L10 15 Z" fill="currentColor" /></Icon>;

// expose
Object.assign(window, {
  Tex,
  Nav, Footer, WireframeSurface, FormulasBg, ChartThumb,
  IconRigor, IconPractice, IconIntuition,
  IconAI, IconWeb3, IconQuant, IconDS, IconArrow,
  IconOptions, IconHFT, IconFinTech, IconIncubator,
  IconLinkedIn, IconGitHub, IconX, IconYouTube,
});
