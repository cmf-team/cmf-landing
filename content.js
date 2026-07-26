// content.js — central content store + admin/CMS engine
// Editable copy & data live in content.json, which the CMS commits to. This
// module fetches it at boot, then overlays any local edits from localStorage.
const { useState: useS, useEffect: useE, useRef: useR, useContext, createContext, useCallback } = React;

/* ---------- helpers ---------- */
const clone = (x) => JSON.parse(JSON.stringify(x));
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => {
    if (o == null) return undefined;
    const idx = /^\d+$/.test(k) ? Number(k) : k;
    return o[idx];
  }, obj);
}
function setPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  let o = obj;
  for (const k of keys) {
    const idx = /^\d+$/.test(k) ? Number(k) : k;
    o = o[idx];
  }
  o[/^\d+$/.test(last) ? Number(last) : last] = value;
}

/* ---------- defaults ---------- */
// Content lives in content.json — that is the file the CMS commits to.
// It is fetched once at boot by initContent() before React renders, so the
// rest of the app can keep reading it synchronously.
let DEFAULT_CONTENT = {};

async function initContent() {
  const res = await fetch("content.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("could not load content.json: HTTP " + res.status);
  DEFAULT_CONTENT = await res.json();
  store.data = loadContent();
  return DEFAULT_CONTENT;
}

/* ---------- store ---------- */
const LS_KEY = 'cmf_content_v1';
const ADMIN_KEY = 'cmf_admin_authed';
const ADMIN_PASSWORD = 'cmf-admin'; // prototype-grade gate only — NOT real security

function loadContent() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return clone(DEFAULT_CONTENT);
}

const store = {
  data: loadContent(),
  listeners: new Set(),
  subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); },
  emit() { this.listeners.forEach(fn => fn()); },
  persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(this.data)); } catch (e) {} },
  set(path, value) { setPath(this.data, path, value); this.persist(); this.emit(); },
  get(path) { return getPath(this.data, path); },
  addItem(path, item) { const arr = getPath(this.data, path); if (Array.isArray(arr)) { arr.push(clone(item)); this.persist(); this.emit(); } },
  removeItem(path, index) { const arr = getPath(this.data, path); if (Array.isArray(arr)) { arr.splice(index, 1); this.persist(); this.emit(); } },
  moveItem(path, index, dir) {
    const arr = getPath(this.data, path);
    if (!Array.isArray(arr)) return;
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    const [it] = arr.splice(index, 1);
    arr.splice(j, 0, it);
    this.persist(); this.emit();
  },
  replaceAll(obj) { this.data = obj; this.persist(); this.emit(); },
  reset() { this.data = clone(DEFAULT_CONTENT); this.persist(); this.emit(); },
};
window.cmfStore = store;

/* ---------- admin context ---------- */
const AdminCtx = createContext(null);

function AdminProvider({ children }) {
  const [authed, setAuthed] = useS(() => sessionStorage.getItem(ADMIN_KEY) === '1');
  const [editing, setEditing] = useS(false);
  const [, force] = useS(0);
  useE(() => store.subscribe(() => force(n => n + 1)), []);

  const login = (pw) => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem(ADMIN_KEY, '1'); setAuthed(true); return true; }
    return false;
  };
  const logout = () => { sessionStorage.removeItem(ADMIN_KEY); setAuthed(false); setEditing(false); };

  const value = { authed, editing, setEditing, login, logout };
  return React.createElement(AdminCtx.Provider, { value }, children);
}
const useAdmin = () => useContext(AdminCtx);
const useEditing = () => { const a = useContext(AdminCtx); return !!(a && a.authed && a.editing); };

// read a field reactively
function useField(path) {
  const [, force] = useS(0);
  useE(() => store.subscribe(() => force(n => n + 1)), []);
  return store.get(path);
}
// read a list reactively
function useList(path) {
  const [, force] = useS(0);
  useE(() => store.subscribe(() => force(n => n + 1)), []);
  return store.get(path) || [];
}

/* ---------- editable text primitive ---------- */
function renderMultiline(text) {
  const s = text == null ? '' : String(text);
  const parts = s.split('\n');
  return parts.map((line, i) => i < parts.length - 1
    ? [React.createElement(React.Fragment, { key: i }, line), React.createElement('br', { key: 'b' + i })]
    : React.createElement(React.Fragment, { key: i }, line));
}

function F({ path, as = 'span', className = '', style, multiline = false, placeholder = 'Empty' }) {
  const editing = useEditing();
  const value = useField(path);
  const ref = useR(null);
  useE(() => {
    if (editing && ref.current) {
      const v = value == null ? '' : String(value);
      if (ref.current.innerText !== v) ref.current.innerText = v;
    }
  }, [editing]); // set once on entering edit mode

  if (!editing) {
    return React.createElement(as, { className, style }, multiline ? renderMultiline(value) : (value == null ? '' : String(value)));
  }
  return React.createElement(as, {
    ref,
    className: (className + ' cms-edit ' + (multiline ? 'cms-multiline' : '')).trim(),
    style,
    contentEditable: true,
    suppressContentEditableWarning: true,
    spellCheck: false,
    'data-ph': placeholder,
    onClick: (e) => { e.stopPropagation(); },
    onBlur: (e) => store.set(path, e.currentTarget.innerText),
    onKeyDown: (e) => {
      if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
      e.stopPropagation();
    },
  });
}

/* ---------- list item controls ---------- */
function ItemControls({ path, index, count, vertical }) {
  const editing = useEditing();
  if (!editing) return null;
  const stop = (fn) => (e) => { e.preventDefault(); e.stopPropagation(); fn(); };
  return React.createElement('div', { className: 'cms-itemctrl' + (vertical ? ' vert' : ''), contentEditable: false },
    React.createElement('button', { title: 'Move up/left', onClick: stop(() => store.moveItem(path, index, -1)), disabled: index === 0 }, '↑'),
    React.createElement('button', { title: 'Move down/right', onClick: stop(() => store.moveItem(path, index, +1)), disabled: index === count - 1 }, '↓'),
    React.createElement('button', { className: 'del', title: 'Delete', onClick: stop(() => { if (confirm('Delete this item?')) store.removeItem(path, index); }) }, '✕'),
  );
}

function AddItem({ path, template, label = 'Add item' }) {
  const editing = useEditing();
  if (!editing) return null;
  return React.createElement('button', {
    className: 'cms-add',
    contentEditable: false,
    onClick: (e) => { e.preventDefault(); e.stopPropagation(); store.addItem(path, typeof template === 'function' ? template() : template); },
  }, '＋ ' + label);
}

/* small inline select for enum fields (icon, chart variant, status, tint) */
function PickField({ path, options }) {
  const editing = useEditing();
  const value = useField(path);
  if (!editing) return null;
  return React.createElement('select', {
    className: 'cms-pick', contentEditable: false, value: value,
    onClick: (e) => e.stopPropagation(),
    onChange: (e) => store.set(path, e.target.value),
  }, options.map(o => React.createElement('option', { key: o, value: o }, o)));
}

/* ---------- new-item templates (for "Add program / project") ---------- */
function uid(prefix) { return prefix + '-' + Math.random().toString(36).slice(2, 7); }
function newProgram() {
  return {
    id: uid('program'), num: String(store.get('programs').length + 1).padStart(2, '0'),
    tag: 'NEW SCHOOL', icon: 'quant',
    title: 'New Program', desc: 'Describe this program in a sentence or two.',
    courses: ['Course 1 · Title', 'Course 2 · Title'],
    detailTag: 'NEW SCHOOL', subtitle: 'A short program subtitle',
    intro: 'An introductory paragraph describing what this program covers and who it is for.',
    meta: [{ k: 'Duration', v: '12 weeks' }, { k: 'Format', v: 'Online · Weekly' }, { k: 'Cohort', v: 'Cohort 2026' }, { k: 'Language', v: 'English' }],
    modules: [{ num: '01', title: 'Module One', tag: '2 WEEKS', desc: 'What this module covers.' }],
    outcomes: ['An outcome of this program'],
    audience: ['Who this program is for'],
    instructors: [{ initials: 'XX', name: 'Instructor Name', role: 'Lead Instructor', bio: 'Short instructor bio.' }],
    faqs: [{ q: 'A frequently asked question?', a: 'The answer to that question.' }],
  };
}
function newProject() {
  return {
    id: uid('project'), title: 'New Project', cohort: 'NEW COHORT', variant: 'curve', tint: 'gold',
    tags: ['Tag'], desc: 'A short description of this project for the portfolio grid.',
    detailCohort: 'NEW COHORT', summary: 'A one-paragraph summary of the project.',
    detailTags: ['Tag'], duration: '2026 · Ongoing',
    team: [{ initials: 'XX', name: 'Team Member', role: 'Role' }],
    metrics: [{ v: 'Value', l: 'Label' }],
    problem: { title: 'The problem', paras: ['Describe the problem.'], chart: { variant: 'curve', label: 'Figure label' } },
    approach: { title: 'Our approach', paras: ['Describe the approach.'], list: [{ t: 'Key point', d: 'Detail.' }], chart: { variant: 'bars', label: 'Figure label' } },
    results: { title: 'Results & impact', paras: ['Describe the results.'], chart: { variant: 'heatmap', label: 'Figure label' } },
  };
}

Object.assign(window, {
  store, initContent, AdminProvider, AdminCtx, useAdmin, useEditing, useField, useList,
  F, ItemControls, AddItem, PickField, ADMIN_PASSWORD, newProgram, newProject,
});
