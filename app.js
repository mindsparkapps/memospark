// ===== MemoSpark - Lógica de la app =====
// Datos: mazos, tarjetas (contenido), progreso (estado de repetición espaciada de cada tarjeta) y días (conteo diario).
// Sola: se guardan en IndexedDB y sync.js los sincroniza con Google Drive.
// Dentro de ZenBan: la página queda aislada (sin IndexedDB), así que todo se guarda en el objeto del lienzo.

// 1.0 primera versión · 1.1 calificación automática (acierto, tiempo y aciertos seguidos), sonido al acertar,
// respuesta libre que se escribe y se comprueba · 1.2 registro de respuestas, sonido de fallo, check / cruz animados,
// ajustes (vibración y sonido) · 1.3 botón para copiar las instrucciones de la IA en Mazos e Importar
// 1.4 pestaña Estadísticas · 1.5 dentro de ZenBan se recarga sola si hay una versión publicada más nueva
// 1.6 tipos de respuesta por mazo (Modos: / ||) elegidos antes de estudiar
// 1.7 la tarjeta se ajusta al ancho del celular (también como plugin de ZenBan), en vertical y en horizontal
// 1.8 guardar y salir a mitad de la sesión y seguir después desde la misma tarjeta
// 1.9 tarjetas más falladas en Estadísticas y repaso aparte de ellas (cuenta para la repetición espaciada)
// 2.0 Revisar mazo: lista paginada con imagen, pregunta y respuesta, veces vistas, % de acierto, Ver tarjeta y Probar
// 2.1 estilo propio o de ZenBan (botón arriba y en la barra de la ventana de ZenBan), como TablaQuiz
// 2.3 la pregunta completa se ve también al revisar la respuesta; cada sesión dura máx. 10 min (se pide otra para seguir)
// 2.4 «Continuar» muestra el tiempo que falta de la sesión; «Sin ver» del mazo es un botón que estudia solo las tarjetas sin ver
// 2.5 tiempo restante en un marco verde; el botón atrás del celular vuelve a la vista anterior; cada tipo de respuesta lleva su propio progreso y meta diaria
// 2.6 en el mazo, cada tipo de respuesta tiene su botón Estudiar/Continuar y «Practicar de nuevo» (también si ya está al día)
// 2.8 siglas subrayadas con globo de significado (glosario «Sigla: X = …» del mazo) y tipo de respuesta «Sigla y significado»
// 2.9 el mazo de ejemplo de AWS se reimporta solo cuando se publica una versión nueva del .md (conserva el progreso)
// 3.0 botón «Usar mazo AWS» en Importar: carga el mazo publicado sin buscar el archivo
const APP_VERSION = '3.0';
const STORES = ['mazos', 'tarjetas', 'progreso', 'dias', 'registro'];
const IN_ZENBAN = !!(window.ZenBanPlugin && ZenBanPlugin.inZenBan);
let db = null;
const S = { mazos: new Map(), tarjetas: new Map(), progreso: new Map(), dias: new Map(), registro: new Map() };
let readOnly = false;

// Ajustes de este dispositivo (no se sincronizan: vibrar en el celular no tiene por qué valer para el PC).
// Dentro de ZenBan no hay localStorage, así que ahí duran mientras la ventana esté abierta.
const AJUSTES_KEY = 'memospark_ajustes';
const ajustes = { vibrar: true, sonido: true, estilo: IN_ZENBAN ? 'zenban' : 'propio' };
try { Object.assign(ajustes, JSON.parse(localStorage.getItem(AJUSTES_KEY) || '{}')); } catch (e) {}
function guardarAjustes() {
  try { localStorage.setItem(AJUSTES_KEY, JSON.stringify(ajustes)); } catch (e) {}
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('on'), 2800);
}
window.showToast = (msg) => toast(msg);

/* ---------- Almacenamiento ---------- */
function openDb() {
  return new Promise((resolve, reject) => {
    // v2: almacén «registro»
    const req = indexedDB.open('memospark', 2);
    req.onupgradeneeded = () => {
      const d = req.result;
      STORES.forEach(s => { if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, { keyPath: 'id' }); });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function dbGetAll(store) {
  return new Promise((resolve, reject) => {
    const r = db.transaction(store, 'readonly').objectStore(store).getAll();
    r.onsuccess = () => resolve(r.result || []);
    r.onerror = () => reject(r.error);
  });
}
function dbWrite(store, puts, dels) {
  if (!db) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    const os = tx.objectStore(store);
    puts.forEach(r => os.put(r));
    dels.forEach(id => os.delete(id));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

// Lo usa sync.js después de traer los datos de Drive
window.refreshFromDb = async () => {
  for (const s of STORES) S[s] = new Map((await dbGetAll(s)).map(r => [r.id, r]));
  render();
};

// ZenBan: el estado completo viaja en el objeto del lienzo
let pluginReady = false;
let pluginTimer = null;
function pluginSnapshot() {
  const out = { v: 1 };
  STORES.forEach(s => { out[s] = [...S[s].values()]; });
  if (sesionGuardada) out.sesion = sesionGuardada;
  out.ajustes = { estilo: ajustes.estilo };
  return out;
}

/* ---------- Sesión a medias: se puede salir y seguir después desde la misma tarjeta ---------- */
// { target, hechas, aciertos, inicial, contador, actualId, dia, ts }. Se guarda en este dispositivo
// (dentro de ZenBan, en el objeto del lienzo) y vale solo para el día de estudio en que se empezó.
const SESION_KEY = 'memospark_sesion';
const SESION_MAX_MS = 10 * 60 * 1000;
let sesionGuardada = null;
try { sesionGuardada = JSON.parse(localStorage.getItem(SESION_KEY) || 'null'); } catch (e) {}

function sesionPendiente() {
  const s = sesionGuardada;
  if (!s || s.dia !== SRS.dayKey() || (s.target !== '*' && !S.mazos.has(s.target))) return null;
  return s;
}
function escribirSesion() {
  if (IN_ZENBAN) { clearTimeout(pluginTimer); pluginTimer = setTimeout(pluginSaveNow, 0); return; }
  try {
    if (sesionGuardada) localStorage.setItem(SESION_KEY, JSON.stringify(sesionGuardada));
    else localStorage.removeItem(SESION_KEY);
  } catch (e) {}
}
function guardarSesion() {
  // El repaso de las más falladas es aparte: no pisa la sesión a medias
  if (!study || readOnly || study.falladas) return;
  sesionGuardada = {
    target: study.target, soloNuevas: !!study.soloNuevas, ids: study.soloNuevas ? [...study.ids] : undefined, hechas: study.hechas, aciertos: study.aciertos, inicial: study.inicial,
    modo: study.target !== '*' ? modoDe(study.target) : undefined,
    contador: study.contador, usado: study.usado || 0, actualId: study.actual && !study.actual.guardada ? study.actual.t.id : null, dia: SRS.dayKey(), ts: Date.now()
  };
  escribirSesion();
}
function borrarSesion() {
  if (!sesionGuardada) return;
  sesionGuardada = null;
  escribirSesion();
}
function pluginSaveNow() {
  clearTimeout(pluginTimer);
  pluginTimer = null;
  if (!IN_ZENBAN || readOnly || !pluginReady) return;
  ZenBanPlugin.setState(pluginSnapshot());
  ZenBanPlugin.setTitle(pluginTitle());
}
function pluginTitle() {
  const pend = totalPendientes();
  const nombre = S.mazos.size === 1 ? [...S.mazos.values()][0].nombre : 'MemoSpark';
  return pend ? `${nombre} · ${pend} por estudiar` : `${nombre}`;
}

// Guarda registros (con updatedAt para la fusión) y borra ids; avisa a la sincronización
async function save(store, puts = [], dels = []) {
  const now = Date.now();
  puts.forEach(r => { r.updatedAt = now; S[store].set(r.id, r); });
  dels.forEach(id => S[store].delete(id));
  // En un tablero de solo lectura se puede estudiar, pero nada se guarda
  if (readOnly) return;
  if (IN_ZENBAN) {
    clearTimeout(pluginTimer);
    pluginTimer = setTimeout(pluginSaveNow, 0);
    return;
  }
  try { await dbWrite(store, puts, dels); } catch (e) { console.warn('IndexedDB', e); }
  if (typeof recordDeletion === 'function') dels.forEach(id => { try { recordDeletion(store, id); } catch (e) {} });
  if (typeof onLocalDataChanged === 'function') { try { onLocalDataChanged(); } catch (e) {} }
}

/* ---------- Consultas ---------- */
const mazosOrdenados = () => [...S.mazos.values()].sort((a, b) => (a.creado || 0) - (b.creado || 0));
const tarjetasDe = (mazoId) => [...S.tarjetas.values()].filter(t => t.mazoId === mazoId).sort((a, b) => a.orden - b.orden);
// Cada tipo de respuesta de un mazo lleva su propio progreso y su propia meta diaria (el primero usa las claves de siempre):
// así se pueden practicar en paralelo. En memoria el progreso conserva el id de la tarjeta; solo la clave guardada cambia.
const claveProg = (id, v) => v ? `${id}~${v}` : id;
const clavesProg = (id) => [id, ...Array.from({ length: 9 }, (_, i) => `${id}~${i + 1}`)].filter(k => S.progreso.has(k));
const progresoDe = (t, v = modoDe(t.mazoId)) => { const p = S.progreso.get(claveProg(t.id, v)); return p ? { ...p, id: t.id } : SRS.nuevo(t.id, t.mazoId); };
const diaDe = (mazoId, key = SRS.dayKey(), v = modoDe(mazoId)) => { const id = `${claveProg(mazoId, v)}|${key}`; return S.dias.get(id) || { id, mazoId, dia: key, nuevas: 0, repasos: 0, aciertos: 0, total: 0 }; };
const nuevasRestantes = (m, v = modoDe(m.id)) => Math.max(0, (m.nuevasPorDia ?? 20) - diaDe(m.id, undefined, v).nuevas);

function conteosMazo(m, v = modoDe(m.id)) {
  return SRS.conteos(tarjetasModo(m.id, v).map(t => progresoDe(t, v)), nuevasRestantes(m, v));
}

/* ---------- Tipo de respuesta «Sigla y significado»: se ve la sigla del servicio y se escribe lo que significa ---------- */
const esModoSigla = (m, v) => modosDe(m).length > 0 && /^sigla/i.test(String((m.modos || [])[v] || '').trim());
// Sigla de una tarjeta: la primera del glosario del mazo que aparezca en su respuesta correcta (sin la marca «AWS»)
function siglaDeTarjeta(t) {
  const m = S.mazos.get(t.mazoId);
  const glosario = (m && m.siglas) || {};
  const ok = (t.opciones || []).filter(o => o.ok);
  if (!ok.length) return null;
  const corto = MazoMD.variante(ok[0].t, 0);
  let mejor = null;
  Object.keys(glosario).forEach(k => {
    if (k === 'AWS') return;
    const hit = new RegExp(`(?<![\\p{L}\\p{N}_])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}_])`, 'u').exec(corto);
    if (hit && (!mejor || hit.index < mejor.i)) mejor = { i: hit.index, sig: k };
  });
  if (!mejor) return null;
  return { sig: mejor.sig, significado: glosario[mejor.sig], respuesta: glosario[mejor.sig].replace(/\s*\(.*\)\s*$/, ''), servicio: MazoMD.variante(ok[0].t, Math.min(1, ((m.modos || []).length) - 1)), largo: corto.length };
}
// Tarjetas que entran en un tipo de respuesta: en «Sigla» una por sigla (la del servicio de nombre más corto)
function tarjetasModo(mazoId, v) {
  const todas = tarjetasDe(mazoId);
  if (!esModoSigla(S.mazos.get(mazoId), v)) return todas;
  const por = new Map();
  todas.forEach(t => { const s = siglaDeTarjeta(t); if (s && (!por.has(s.sig) || s.largo < por.get(s.sig).largo)) por.set(s.sig, { id: t.id, largo: s.largo }); });
  const ids = new Set([...por.values()].map(x => x.id));
  return todas.filter(t => ids.has(t.id));
}
// Pendientes de hoy en cada tipo de respuesta del mazo (uno solo si el mazo no tiene varios)
function pendientesPorModo(m) {
  return (modosDe(m).length ? m.modos : [null]).map((_, v) => { const c = conteosMazo(m, v); return c.nuevas + c.aprend + c.repaso; });
}
function totalPendientes() {
  return mazosOrdenados().reduce((n, m) => { const c = conteosMazo(m); return n + c.nuevas + c.aprend + c.repaso; }, 0);
}

/* ---------- Navegación ---------- */
let vista = 'mazos';
let mazoAbierto = null;
function go(v, opts = {}) {
  if (vista === 'estudio' && v !== 'estudio') endStudy();
  cerrarSigla();
  const cambia = v !== vista || (opts.mazo && opts.mazo !== mazoAbierto);
  vista = v;
  if (opts.mazo) mazoAbierto = opts.mazo;
  // Cada vista queda en el historial: el botón atrás del celular vuelve a la vista anterior en vez de salir de la app o del plugin
  if (cambia && !opts.atras) { try { history.pushState({ ms: 1, v, mazo: mazoAbierto }, ''); } catch (e) {} }
  $$('section.view').forEach(s => { s.hidden = s.id !== `v-${v}`; });
  document.body.classList.toggle('estudiando', v === 'estudio');
  const tab = v === 'mazo' || v === 'estudio' || v === 'revisar' ? 'mazos' : v;
  $$('nav.tabs [data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
  render();
  window.scrollTo({ top: 0 });
}

try { history.replaceState({ ms: 1, v: 'mazos', mazo: null }, ''); } catch (e) {}
window.addEventListener('popstate', (e) => {
  const s = e.state && e.state.ms ? e.state : { v: 'mazos', mazo: null };
  // Una sesión de estudio no se puede reconstruir desde el historial: se vuelve al mazo
  const v = s.v === 'estudio' ? (s.mazo ? 'mazo' : 'mazos') : s.v === 'mazo' && !s.mazo ? 'mazos' : s.v;
  go(v, { mazo: s.mazo || undefined, atras: true });
});

function render() {
  // Glosario de siglas de todos los mazos (se subrayan en las tarjetas)
  const glosario = {};
  S.mazos.forEach(mz => Object.assign(glosario, mz.siglas || {}));
  MazoMD.setSiglas(glosario);
  if (vista === 'mazos') renderMazos();
  else if (vista === 'mazo') renderMazo();
  else if (vista === 'formato') renderFormato();
  else if (vista === 'stats') renderStats();
  else if (vista === 'revisar') renderRevisar();
  else if (vista === 'estudio' && !study) go('mazos');
  if (IN_ZENBAN && pluginReady && !readOnly) ZenBanPlugin.setTitle(pluginTitle());
}

/* ---------- Vista: Mazos ---------- */
function racha() {
  const dias = new Set([...S.dias.values()].filter(d => d.total > 0).map(d => d.dia));
  let n = 0;
  let t = Date.now();
  if (!dias.has(SRS.dayKey(t))) t -= SRS.DAY; // si hoy aún no se estudia, la racha cuenta hasta ayer
  while (dias.has(SRS.dayKey(t))) { n++; t -= SRS.DAY; }
  return n;
}

function renderMazos() {
  const mazos = mazosOrdenados();
  const hoy = SRS.dayKey();
  const hoyDias = [...S.dias.values()].filter(d => d.dia === hoy);
  const total = hoyDias.reduce((n, d) => n + d.total, 0);
  const aciertos = hoyDias.reduce((n, d) => n + d.aciertos, 0);
  const pend = totalPendientes();
  // Sesión a medias (solo si aún queda algo por estudiar en ella)
  let sesion = sesionPendiente();
  if (sesion) { const c = SRS.conteos(candSesion(sesion), Infinity); if (!c.nuevas && !c.aprend && !c.repaso) sesion = null; }
  $('#studyAllBtn').hidden = mazos.length < 2;
  $('#studyAllBtn').disabled = !pend;
  $('#hoyEyebrow').textContent = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });

  if (!mazos.length) {
    $('#mazos-body').innerHTML = `
      <div class="empty">
        <div style="font-size:2.6rem">🃏</div>
        <h3>Aún no tienes mazos</h3>
        <p>Pídele a cualquier IA un mazo con el formato de MemoSpark, guárdalo como <code>.md</code> e impórtalo. La app te irá mostrando cada tarjeta justo antes de que la olvides.</p>
        <div class="toolbar" style="justify-content:center">
          <button class="btn primary" type="button" data-go="formato">Crear con IA</button>
          <button class="btn" type="button" data-act="copy-prompt">📋 Copiar instrucciones para la IA</button>
          <button class="btn" type="button" data-act="import">Importar .md</button>
          <button class="btn ghost" type="button" data-act="load-example">Probar el mazo de ejemplo</button>
        </div>
      </div>`;
    return;
  }

  const deckCards = mazos.map(m => {
    const c = conteosMazo(m);
    const tarjetas = tarjetasDe(m.id);
    const prog = tarjetas.map(progresoDe);
    const dominadas = prog.filter(p => p.estado === 'repaso' && p.intervalo >= 21).length;
    const vistas = prog.filter(p => p.estado !== 'nuevo').length;
    const pct = (n) => tarjetas.length ? (n / tarjetas.length * 100).toFixed(1) : 0;
    const hay = c.nuevas + c.aprend + c.repaso || (pendientesPorModo(m).some(n => n > 0) ? 1 : 0);
    return `
      <article class="deck">
        <div>
          <button class="deck-name" type="button" data-open="${esc(m.id)}">${esc(m.nombre)}</button>
          ${m.descripcion ? `<div class="deck-desc">${esc(m.descripcion.replace(/[#*_`>!\[\]()]/g, ''))}</div>` : ''}
        </div>
        <div class="deck-counts">
          <span class="chip new" title="Nuevas para hoy">${c.nuevas} nuevas</span>
          <span class="chip learn" title="En aprendizaje">${c.aprend} aprendiendo</span>
          <span class="chip due" title="Para repasar hoy">${c.repaso} repaso</span>
        </div>
        <div>
          <div class="meter" title="${dominadas} dominadas · ${vistas - dominadas} en estudio · ${tarjetas.length - vistas} sin ver">
            <i style="width:${pct(dominadas)}%;background:var(--good)"></i><i style="width:${pct(vistas - dominadas)}%;background:var(--accent)"></i>
          </div>
          <div class="muted" style="font-size:.78rem;margin-top:4px">${tarjetas.length} tarjetas · ${dominadas} dominadas</div>
        </div>
        <div class="deck-foot">
          <button class="btn ghost sm" type="button" data-open="${esc(m.id)}">Ver mazo</button>
          <span class="grow"></span>
          <button class="btn ${hay ? 'primary' : ''}" type="button" data-study="${esc(m.id)}" ${sesion && sesion.target === m.id && sesion.soloNuevas ? 'data-nuevas="1"' : ''} ${sesion && sesion.target === m.id && sesion.modo != null ? `data-modo="${sesion.modo}"` : ''} ${hay ? '' : 'disabled'}>${hay ? (sesion && sesion.target === m.id ? `Continuar ▶ · ${quedaTxt(sesion)}` : 'Estudiar') : 'Al día ✓'}</button>
        </div>
      </article>`;
  }).join('');

  $('#mazos-body').innerHTML = `
    ${sesion ? `<div class="resume">
      <div class="grow"><b>Tienes una sesión a medias</b><span>${esc(sesion.target === '*' ? 'Todos los mazos' : S.mazos.get(sesion.target).nombre)} · ${sesion.hechas} ${sesion.hechas === 1 ? 'respondida' : 'respondidas'}${sesion.soloNuevas ? ' · sin ver' : ''}${sesion.hechas ? ` · ${Math.round(sesion.aciertos / sesion.hechas * 100)}% de aciertos` : ''} <b class="queda">${quedaTxt(sesion)}</b></span></div>
      <button class="btn ghost sm" type="button" data-act="discard-session">Descartar</button>
      <button class="btn primary" type="button" data-act="resume">Continuar ▶</button>
    </div>` : ''}
    <div class="today">
      <div class="stat"><div class="v">${pend}</div><div class="l">Por estudiar hoy</div></div>
      <div class="stat"><div class="v">${total}</div><div class="l">Respondidas hoy</div></div>
      <div class="stat"><div class="v">${total ? Math.round(aciertos / total * 100) + '%' : '—'}</div><div class="l">Aciertos hoy</div></div>
      <div class="stat"><div class="v">${racha()}</div><div class="l">Días seguidos</div></div>
    </div>
    <div class="decks">${deckCards}</div>`;
}

/* ---------- Vista: Estadísticas ---------- */
const fechaCorta = (ts) => new Date(ts).toLocaleDateString('es', { day: 'numeric', month: 'short' }).replace('.', '');
const pctTxt = (a, b) => b ? `${Math.round(a / b * 100)}%` : '—';

function mejorRacha() {
  const dias = [...new Set([...S.dias.values()].filter(d => d.total > 0).map(d => d.dia))].sort();
  let mejor = 0, actual = 0, prev = null;
  dias.forEach(d => {
    const t = new Date(d + 'T12:00:00').getTime();
    actual = prev != null && Math.round((t - prev) / SRS.DAY) === 1 ? actual + 1 : 1;
    mejor = Math.max(mejor, actual);
    prev = t;
  });
  return mejor;
}

// Gráfico de barras de una sola serie hecho con HTML (se adapta al ancho sin deformar el texto).
// barras: [{ v, etiqueta, tip }]; cada barra muestra su detalle al pasar el mouse o tocarla.
function graficoBarras(barras, { cadaEtiqueta = 7, resaltarUltima = false, vacio = 'Sin datos todavía' } = {}) {
  const max = Math.max(0, ...barras.map(b => b.v));
  if (!max) return `<div class="chart-empty">${vacio}</div>`;
  const tope = max <= 5 ? max : Math.ceil(max / 5) * 5;
  return `
    <div class="chart">
      <div class="chart-y"><span>${tope}</span><span>${Math.round(tope / 2)}</span><span>0</span></div>
      <div class="chart-plot">
        <div class="chart-grid"><i></i><i></i></div>
        <div class="chart-bars">${barras.map((b, i) => `
          <button type="button" class="bar-hit${resaltarUltima && i === barras.length - 1 ? ' hoy' : ''}" data-tip="${esc(b.tip)}" aria-label="${esc(b.tip)}">
            <span class="bar" style="height:${b.v ? Math.max(2, b.v / tope * 100) : 0}%"></span>
          </button>`).join('')}
        </div>
        <div class="chart-x">${barras.map((b, i) => `<span>${i % cadaEtiqueta === 0 || i === barras.length - 1 ? esc(b.etiqueta) : ''}</span>`).join('')}</div>
      </div>
    </div>`;
}

function renderStats() {
  const mazos = mazosOrdenados();
  const now = Date.now();
  const hoy = SRS.dayKey(now);
  const prog = [...S.tarjetas.values()].map(progresoDe);
  const total = prog.length;
  const sinVer = prog.filter(p => p.estado === 'nuevo').length;
  const aprend = prog.filter(SRS.enAprendizaje).length;
  const dominadas = prog.filter(p => p.estado === 'repaso' && p.intervalo >= 21).length;
  const repaso = total - sinVer - aprend - dominadas;

  if (!total) {
    $('#stats-body').innerHTML = `<div class="empty"><div style="font-size:2.6rem">📊</div><h3>Aún no hay estadísticas</h3><p>Importa un mazo y estudia un poco: aquí verás tu avance, tus aciertos y lo que te toca repasar los próximos días.</p><button class="btn primary" type="button" data-go="mazos">Ir a mis mazos</button></div>`;
    return;
  }

  // Hoy y últimos 30 días (conteos diarios + registro de respuestas)
  const diasHoy = [...S.dias.values()].filter(d => d.dia === hoy);
  const respHoy = diasHoy.reduce((n, d) => n + d.total, 0);
  const acHoy = diasHoy.reduce((n, d) => n + d.aciertos, 0);
  const reg = [...S.registro.values()];
  const regHoy = reg.filter(r => SRS.dayKey(r.ts) === hoy);
  const segHoy = regHoy.length ? regHoy.reduce((n, r) => n + r.ms, 0) / regHoy.length / 1000 : null;
  const hace30 = now - 30 * SRS.DAY;
  const repasos30 = reg.filter(r => r.ts >= hace30 && r.estadoAntes === 'repaso');
  const retencion = repasos30.length ? repasos30.filter(r => r.correcta).length / repasos30.length : null;

  const actividad = [];
  for (let i = 29; i >= 0; i--) {
    const ts = now - i * SRS.DAY;
    const key = SRS.dayKey(ts);
    const ds = [...S.dias.values()].filter(d => d.dia === key);
    const n = ds.reduce((s, d) => s + d.total, 0);
    const ac = ds.reduce((s, d) => s + d.aciertos, 0);
    actividad.push({ v: n, etiqueta: i === 0 ? 'Hoy' : fechaCorta(ts), tip: `${i === 0 ? 'Hoy' : fechaCorta(ts)}: ${n} respondidas${n ? ` · ${pctTxt(ac, n)} de aciertos` : ''}` });
  }
  const total30 = actividad.reduce((s, b) => s + b.v, 0);
  const diasActivos = actividad.filter(b => b.v).length;

  // Pronóstico: tarjetas que tocan cada uno de los próximos 14 días (hoy incluye las atrasadas y en aprendizaje)
  const inicioHoy = SRS.dayStart(now);
  const pronostico = Array.from({ length: 14 }, (_, i) => {
    const ts = inicioHoy + i * SRS.DAY;
    const etiqueta = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : fechaCorta(ts);
    return { v: 0, etiqueta, tip: '' };
  });
  prog.forEach(p => {
    if (p.estado === 'nuevo') return;
    const i = Math.max(0, Math.floor((p.vence - inicioHoy) / SRS.DAY));
    if (i < 14) pronostico[i].v++;
  });
  pronostico.forEach(b => { b.tip = `${b.etiqueta}: ${b.v} ${b.v === 1 ? 'tarjeta' : 'tarjetas'} para repasar`; });
  const semana = pronostico.slice(0, 7).reduce((s, b) => s + b.v, 0);

  const filasMazos = mazos.map(m => {
    const ps = tarjetasDe(m.id).map(progresoDe);
    const c = conteosMazo(m);
    const ds = [...S.dias.values()].filter(d => d.mazoId === m.id && new Date(d.dia + 'T12:00:00').getTime() >= hace30);
    const n = ds.reduce((s, d) => s + d.total, 0), ac = ds.reduce((s, d) => s + d.aciertos, 0);
    const dom = ps.filter(p => p.estado === 'repaso' && p.intervalo >= 21).length;
    return `<tr>
      <td><button class="link" type="button" data-open="${esc(m.id)}">${esc(m.nombre)}</button></td>
      <td class="num">${ps.length}</td>
      <td class="num">${ps.filter(p => p.estado === 'nuevo').length}</td>
      <td class="num">${dom} <span class="muted">(${pctTxt(dom, ps.length)})</span></td>
      <td class="num">${pctTxt(ac, n)}${n ? ` <span class="muted">(${n})</span>` : ''}</td>
      <td class="num">${c.nuevas + c.aprend + c.repaso}</td>
      <td>${(() => { const f = falladasDe(m.id).length; return f ? `<button class="btn sm" type="button" data-falladas="${esc(m.id)}">Repasar ${f}</button>` : '<span class="muted">—</span>'; })()}</td>
    </tr>`;
  }).join('');

  // Las más falladas (de todos los mazos o del elegido)
  if (statsFallMazo !== '*' && !S.mazos.has(statsFallMazo)) statsFallMazo = '*';
  const fall = falladasDe(statsFallMazo);
  const filaFallada = (x) => {
    const preg = x.t.pregunta.split('\n')[0];
    const img = (x.t.pregunta.match(/!\[[^\]]*\]\(([^)\s]+)\)/) || [])[1];
    // Si la pregunta se repite entre tarjetas («¿Qué servicio es este?»), la respuesta correcta ayuda a reconocerla
    const correcta = x.t.opciones && x.t.opciones.length ? MazoMD.variante((x.t.opciones.find(o => o.ok) || {}).t, 0) : MazoMD.variante(x.t.respuesta, 0);
    return `<tr>
      <td class="fall-q">${img ? `<img src="${esc(img)}" alt="">` : ''}<span><span class="q">${MazoMD.inline(preg)}</span><small class="muted">${MazoMD.inline(correcta || '')}${statsFallMazo === '*' && mazos.length > 1 ? ` · ${esc((S.mazos.get(x.t.mazoId) || {}).nombre || '')}` : ''}</small></span></td>
      <td class="num">${x.errores}<span class="muted"> / ${x.total}</span></td>
      <td><div class="meter fall-meter"><i style="width:${Math.round(x.tasa * 100)}%;background:var(--bad)"></i></div><span class="muted fall-pct">${Math.round(x.tasa * 100)}%</span></td>
    </tr>`;
  };
  const bloqueFalladas = `
    <div class="card">
      <div class="card-h"><h3>Tarjetas más falladas</h3>${fall.length ? `<span class="chip">${fall.length >= 20 ? 'Las 20 primeras' : `${fall.length} con errores`}</span>` : ''}</div>
      <div class="toolbar fall-tools">
        ${mazos.length > 1 ? `<select id="fallMazo" aria-label="Mazo"><option value="*">Todos los mazos</option>${mazos.map(m => `<option value="${esc(m.id)}" ${m.id === statsFallMazo ? 'selected' : ''}>${esc(m.nombre)}</option>`).join('')}</select>` : ''}
        <button class="btn primary" type="button" data-falladas="${esc(statsFallMazo)}" ${fall.length ? '' : 'disabled'}>Repasar las más falladas${fall.length ? ` (${fall.length})` : ''}</button>
      </div>
      <p class="muted" style="font-size:.8rem;margin:8px 0 10px">Un repaso aparte: no cambia tu sesión a medias. Lo que respondas sí cuenta para la repetición espaciada y queda en el registro.</p>
      ${fall.length ? `<div class="table-wrap"><table class="log-table">
        <thead><tr><th>Tarjeta</th><th>Errores</th><th>% de error</th></tr></thead>
        <tbody>${fall.slice(0, 10).map(filaFallada).join('')}</tbody>
      </table></div>${fall.length > 10 ? `<p class="muted" style="font-size:.78rem;margin-top:6px">El repaso incluye las ${fall.length} de la lista completa; aquí se muestran las 10 primeras.</p>` : ''}`
      : '<div class="chart-empty" style="height:90px">Aún no has fallado ninguna tarjeta 🎯</div>'}
    </div>`;

  const estado = (n, txt, color) => `<div class="stat"><div class="v" style="color:${color}">${n}</div><div class="l">${txt}</div><div class="meter" style="margin-top:8px"><i style="width:${(n / total * 100).toFixed(1)}%;background:${color}"></i></div></div>`;

  $('#stats-body').innerHTML = `
    <div class="today">
      <div class="stat"><div class="v">${respHoy}</div><div class="l">Respondidas hoy · ${pctTxt(acHoy, respHoy)} aciertos</div></div>
      <div class="stat"><div class="v">${segHoy == null ? '—' : `${segHoy.toLocaleString('es', { maximumFractionDigits: 1 })} s`}</div><div class="l">Tiempo medio por respuesta hoy</div></div>
      <div class="stat"><div class="v">${retencion == null ? '—' : `${Math.round(retencion * 100)}%`}</div><div class="l">Recuerdo en repasos (30 días)</div></div>
      <div class="stat"><div class="v">${racha()} <small class="muted" style="font-size:.9rem">/ ${mejorRacha()}</small></div><div class="l">Días seguidos / mejor racha</div></div>
    </div>

    <div class="card">
      <div class="card-h"><h3>Estado de tus ${total} tarjetas</h3></div>
      <div class="today">
        ${estado(sinVer, 'Sin ver', 'var(--new)')}
        ${estado(aprend, 'Aprendiendo', 'var(--learn)')}
        ${estado(repaso, 'En repaso', 'var(--accent)')}
        ${estado(dominadas, 'Dominadas (21+ días)', 'var(--good)')}
      </div>
    </div>

    <div class="grid">
      <div class="card c7">
        <div class="card-h"><h3>Respuestas por día</h3><span class="chip">Últimos 30 días</span></div>
        <p class="muted chart-sub">${total30} respuestas en ${diasActivos} ${diasActivos === 1 ? 'día' : 'días'} de estudio</p>
        ${graficoBarras(actividad, { cadaEtiqueta: 7, resaltarUltima: true, vacio: 'Aún no hay respuestas en los últimos 30 días' })}
      </div>
      <div class="card c5">
        <div class="card-h"><h3>Repasos que vienen</h3><span class="chip">Próximos 14 días</span></div>
        <p class="muted chart-sub">${semana} ${semana === 1 ? 'tarjeta' : 'tarjetas'} en los próximos 7 días (sin contar las nuevas)</p>
        ${graficoBarras(pronostico, { cadaEtiqueta: 3, vacio: 'No hay repasos programados todavía' })}
      </div>
    </div>

    ${bloqueFalladas}

    <div class="card">
      <div class="card-h"><h3>Por mazo</h3></div>
      <div class="table-wrap"><table class="log-table">
        <thead><tr><th>Mazo</th><th>Tarjetas</th><th>Sin ver</th><th>Dominadas</th><th>Aciertos 30 días</th><th>Para hoy</th><th>Más falladas</th></tr></thead>
        <tbody>${filasMazos}</tbody>
      </table></div>
    </div>`;
  const sel = $('#fallMazo');
  if (sel) sel.addEventListener('change', () => { statsFallMazo = sel.value; renderStats(); });
}
let statsFallMazo = '*';

// Detalle de cada barra: al pasar el mouse, al enfocarla con el teclado o al tocarla
function mostrarTip(btn) {
  const tip = $('#barTip');
  if (!btn) { tip.hidden = true; return; }
  tip.textContent = btn.dataset.tip;
  tip.hidden = false;
  const r = btn.getBoundingClientRect();
  const w = tip.offsetWidth;
  tip.style.left = `${Math.min(window.innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2))}px`;
  tip.style.top = `${Math.max(8, r.top - tip.offsetHeight - 8)}px`;
}
document.addEventListener('pointerover', (e) => { const b = e.target.closest && e.target.closest('.bar-hit'); if (b) mostrarTip(b); });
document.addEventListener('pointerout', (e) => { if (e.target.closest && e.target.closest('.bar-hit') && e.pointerType === 'mouse') mostrarTip(null); });
document.addEventListener('focusin', (e) => { const b = e.target.closest && e.target.closest('.bar-hit'); mostrarTip(b || null); });
window.addEventListener('scroll', () => mostrarTip(null), { passive: true });

/* ---------- Vista: Revisar mazo (lista paginada de tarjetas) ---------- */
const REV = { mazoId: null, pagina: 1, filtro: '', orden: 'mazo', porPagina: 20, ids: [] };

// Veces vistas y aciertos de cada tarjeta según el registro (o las repeticiones del progreso si el registro se recortó)
function statsPorTarjeta() {
  const st = new Map();
  S.registro.forEach(r => {
    const s = st.get(r.tarjetaId) || { total: 0, ok: 0 };
    s.total++; if (r.correcta) s.ok++;
    st.set(r.tarjetaId, s);
  });
  return st;
}
const primeraImagen = (md) => (String(md || '').match(/!\[[^\]]*\]\(([^)\s]+)\)/) || [])[1] || '';
// Respuesta correcta en el tipo de respuesta elegido para el mazo
function respuestaDe(t, version) {
  if (t.opciones && t.opciones.length) return t.opciones.filter(o => o.ok).map(o => MazoMD.variante(o.t, version)).join(' · ');
  return MazoMD.variante(t.respuesta, version);
}

function filasRevisar(m) {
  const st = statsPorTarjeta();
  const version = modoDe(m.id);
  const f = normalizar(REV.filtro);
  let filas = tarjetasDe(m.id).map(t => {
    const p = progresoDe(t);
    const s = st.get(t.id) || { total: 0, ok: 0 };
    const vistas = Math.max(s.total, p.reps || 0);
    return { t, p, vistas, total: s.total, ok: s.ok, pct: s.total ? s.ok / s.total : null, resp: respuestaDe(t, version) };
  });
  if (f) filas = filas.filter(x => normalizar(`${x.t.pregunta} ${x.resp} ${x.t.explicacion}`).includes(f));
  const pctOrden = (x) => x.pct == null ? 2 : x.pct;
  if (REV.orden === 'acierto') filas.sort((a, b) => pctOrden(a) - pctOrden(b) || b.total - a.total);
  else if (REV.orden === 'vistas') filas.sort((a, b) => a.vistas - b.vistas || a.t.orden - b.t.orden);
  else if (REV.orden === 'masvistas') filas.sort((a, b) => b.vistas - a.vistas || a.t.orden - b.t.orden);
  return filas;
}

function renderRevisar() {
  const m = S.mazos.get(mazoAbierto);
  if (!m) { go('mazos'); return; }
  if (REV.mazoId !== m.id) Object.assign(REV, { mazoId: m.id, pagina: 1, filtro: '', orden: 'mazo' });
  $('#revisar-body').innerHTML = `
    <div><button class="btn ghost sm" type="button" data-open="${esc(m.id)}">← ${esc(m.nombre)}</button></div>
    <div class="head-row">
      <div><div class="eyebrow">Revisar mazo</div><h2>${esc(m.nombre)}</h2></div>
    </div>
    <div class="rev-tools">
      <input type="search" id="revFiltro" placeholder="Buscar en preguntas y respuestas" value="${esc(REV.filtro)}" aria-label="Buscar">
      <select id="revOrden" aria-label="Ordenar">
        <option value="mazo" ${REV.orden === 'mazo' ? 'selected' : ''}>Orden del mazo</option>
        <option value="acierto" ${REV.orden === 'acierto' ? 'selected' : ''}>Menor % de acierto</option>
        <option value="vistas" ${REV.orden === 'vistas' ? 'selected' : ''}>Menos vistas</option>
        <option value="masvistas" ${REV.orden === 'masvistas' ? 'selected' : ''}>Más vistas</option>
      </select>
    </div>
    <div id="revLista"></div>`;
  const fil = $('#revFiltro');
  let tm = null;
  fil.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => { REV.filtro = fil.value; REV.pagina = 1; renderRevisarLista(); }, 200); });
  $('#revOrden').addEventListener('change', (e) => { REV.orden = e.target.value; REV.pagina = 1; renderRevisarLista(); });
  renderRevisarLista();
}

function renderRevisarLista() {
  const m = S.mazos.get(REV.mazoId);
  if (!m) return;
  const filas = filasRevisar(m);
  REV.ids = filas.map(x => x.t.id);
  const paginas = Math.max(1, Math.ceil(filas.length / REV.porPagina));
  REV.pagina = Math.min(Math.max(1, REV.pagina), paginas);
  const desde = (REV.pagina - 1) * REV.porPagina;
  const pagina = filas.slice(desde, desde + REV.porPagina);
  const paginador = paginas > 1 ? `
    <nav class="pager" aria-label="Páginas">
      <button class="btn sm" type="button" data-pag="1" ${REV.pagina === 1 ? 'disabled' : ''} aria-label="Primera página">«</button>
      <button class="btn sm" type="button" data-pag="${REV.pagina - 1}" ${REV.pagina === 1 ? 'disabled' : ''}>‹ Anterior</button>
      <span class="pager-txt">Página <b>${REV.pagina}</b> de ${paginas}</span>
      <button class="btn sm" type="button" data-pag="${REV.pagina + 1}" ${REV.pagina === paginas ? 'disabled' : ''}>Siguiente ›</button>
      <button class="btn sm" type="button" data-pag="${paginas}" ${REV.pagina === paginas ? 'disabled' : ''} aria-label="Última página">»</button>
    </nav>` : '';
  const fila = (x, i) => {
    const img = primeraImagen(x.t.pregunta);
    const preg = x.t.pregunta.replace(/!\[[^\]]*\]\([^)]*\)/g, '').split('\n').filter(l => l.trim());
    return `
      <article class="rev-row">
        <div class="rev-n">${desde + i + 1}</div>
        <div class="rev-img">${img ? `<img src="${esc(img)}" alt="">` : '<span aria-hidden="true">?</span>'}</div>
        <div class="rev-main">
          <div class="rev-q">${MazoMD.inline(preg[0] || '')}</div>
          ${preg.length > 1 ? `<div class="rev-sub">${MazoMD.inline(preg.slice(1).join(' '))}</div>` : ''}
          <div class="rev-a"><span class="rev-ok">✓</span><span>${MazoMD.inline(x.resp)}</span></div>
          <div class="rev-meta">${estadoChip(x.p)}<span>👁 ${x.vistas} ${x.vistas === 1 ? 'vez vista' : 'veces vista'}</span>${x.pct == null ? '<span class="muted">Sin respuestas aún</span>' : `<span class="rev-pct ${x.pct >= 0.85 ? 'alto' : x.pct >= 0.6 ? 'medio' : 'bajo'}">${Math.round(x.pct * 100)}% de acierto <small>(${x.ok}/${x.total})</small></span>`}${x.p.estado !== 'nuevo' ? `<span class="muted">Toca ${cuandoToca(x.p)}</span>` : ''}</div>
        </div>
        <div class="rev-btns">
          <button class="btn sm" type="button" data-ver="${esc(x.t.id)}">Ver tarjeta</button>
          <button class="btn sm primary" type="button" data-probar="${esc(x.t.id)}">Probar</button>
        </div>
      </article>`;
  };
  $('#revLista').innerHTML = `
    <p class="muted rev-count">${filas.length === tarjetasDe(m.id).length ? `${filas.length} tarjetas` : `${filas.length} de ${tarjetasDe(m.id).length} tarjetas`}${paginas > 1 ? ` · ${desde + 1}–${desde + pagina.length}` : ''}</p>
    ${filas.length ? `<div class="rev-list">${pagina.map(fila).join('')}</div>` : '<div class="chart-empty" style="height:100px">Ninguna tarjeta coincide con la búsqueda</div>'}
    ${paginador}`;
}

// Tarjeta resuelta: pregunta con su imagen, alternativas con la correcta marcada y la explicación
let verIdx = -1;
function verTarjeta(id) {
  const t = S.tarjetas.get(id);
  if (!t) return;
  verIdx = REV.ids.indexOf(id);
  const version = modoDe(t.mazoId);
  const p = progresoDe(t);
  const s = statsPorTarjeta().get(id) || { total: 0, ok: 0 };
  const vistas = Math.max(s.total, p.reps || 0);
  const cuerpo = t.opciones && t.opciones.length
    ? `<div class="opts">${t.opciones.map((o, i) => `<div class="opt static ${o.ok ? 'is-ok' : ''}"><span class="k">${o.ok ? '✓' : LETRAS[i]}</span><span class="t">${MazoMD.inline(MazoMD.variante(o.t, version))}</span></div>`).join('')}</div>`
    : `<div class="answer-box"><div class="l">Respuesta</div><div class="md" style="font-size:1.1rem;font-weight:600">${MazoMD.render(MazoMD.variante(t.respuesta, version))}</div></div>`;
  $('#verBody').innerHTML = `
    <div class="qtext">${MazoMD.render(t.pregunta)}</div>
    ${cuerpo}
    ${t.explicacion ? `<div class="explain"><div class="l">Explicación</div><div class="md">${MazoMD.render(t.explicacion)}</div></div>` : ''}
    <div class="rev-meta">${estadoChip(p)}<span>👁 ${vistas} ${vistas === 1 ? 'vez vista' : 'veces vista'}</span>${s.total ? `<span>${Math.round(s.ok / s.total * 100)}% de acierto (${s.ok}/${s.total})</span>` : '<span class="muted">Sin respuestas aún</span>'}${p.estado !== 'nuevo' ? `<span class="muted">Toca ${cuandoToca(p)}</span>` : ''}</div>`;
  $('#verPos').textContent = verIdx >= 0 ? `${verIdx + 1} de ${REV.ids.length}` : '';
  $('#verPrev').disabled = verIdx <= 0;
  $('#verNext').disabled = verIdx < 0 || verIdx >= REV.ids.length - 1;
  $('#verProbar').dataset.probar = id;
  if (!$('#dlg-ver').open) $('#dlg-ver').showModal();
  $('#dlg-ver .dlg-b').scrollTop = 0;
}

function probarTarjeta(id) {
  const t = S.tarjetas.get(id);
  if (!t) return;
  if ($('#dlg-ver').open) $('#dlg-ver').close();
  // Al volver, la lista abre en la página de esa tarjeta
  const i = REV.ids.indexOf(id);
  if (i >= 0) REV.pagina = Math.floor(i / REV.porPagina) + 1;
  sesionAparte(t.mazoId, [id], 'prueba', 'Prueba');
}

/* ---------- Vista: detalle de un mazo ---------- */
const estadoChip = (p) => p.estado === 'nuevo' ? '<span class="chip new">Nueva</span>'
  : SRS.enAprendizaje(p) ? '<span class="chip learn">Aprendiendo</span>'
  : p.intervalo >= 21 ? '<span class="chip due">Dominada</span>' : '<span class="chip">Repaso</span>';
function cuandoToca(p, now = Date.now()) {
  if (p.estado === 'nuevo') return '';
  if (p.vence <= now) return 'ahora';
  const d = Math.round((p.vence - SRS.dayStart(now)) / SRS.DAY);
  if (SRS.enAprendizaje(p) || d < 1) return `en ${Math.max(1, Math.round((p.vence - now) / SRS.MIN))} min`;
  return d === 1 ? 'mañana' : `en ${SRS.formatoDias(d)}`;
}
function renderMazo() {
  const m = S.mazos.get(mazoAbierto);
  if (!m) { go('mazos'); return; }
  const tarjetas = tarjetasDe(m.id);
  const c = conteosMazo(m);
  const hayAqui = c.nuevas + c.aprend + c.repaso;
  const hay = hayAqui || (pendientesPorModo(m).some(n => n > 0) ? 1 : 0);

  $('#mazo-body').innerHTML = `
    <div><button class="btn ghost sm" type="button" data-go="mazos">← Mazos</button></div>
    <div class="deck-head">
      <div style="min-width:0;flex:1">
        <h2>${esc(m.nombre)}</h2>
        ${m.descripcion ? `<div class="md muted" style="margin-top:6px">${MazoMD.render(m.descripcion)}</div>` : ''}
      </div>
      ${(() => { const sp = sesionPendiente(); const mia = sp && sp.target === m.id; return `<button class="btn primary" type="button" data-study="${esc(m.id)}" ${mia && sp.soloNuevas ? 'data-nuevas="1"' : ''} ${mia && sp.modo != null ? `data-modo="${sp.modo}"` : ''} ${hay ? '' : 'disabled'}>${hay ? (mia ? `Continuar ▶ · ${quedaTxt(sp)}` : hayAqui ? `Estudiar (${hayAqui})` : 'Estudiar otro tipo') : 'Al día ✓'}</button>`; })()}
    </div>
    <div class="today">
      <button class="stat stat-btn" type="button" data-study="${esc(m.id)}" data-nuevas="1" ${c.nuevasTotal ? '' : 'disabled'} title="Estudiar solo las tarjetas que aún no has visto"><div class="v" style="color:var(--new)">${c.nuevasTotal}</div><div class="l">Sin ver${c.nuevasTotal ? ' · estudiar ▶' : ''}</div></button>
      <div class="stat"><div class="v" style="color:var(--learn)">${c.aprend}</div><div class="l">Aprendiendo hoy</div></div>
      <div class="stat"><div class="v" style="color:var(--due)">${c.repaso}</div><div class="l">Para repasar hoy</div></div>
      <div class="stat"><div class="v">${tarjetas.length}</div><div class="l">Tarjetas</div></div>
    </div>
    ${modosDe(m).length ? `<div class="card">
      <b>Tipos de respuesta</b>
      <p class="muted" style="font-size:.8rem;margin:2px 0 8px">Cada tipo lleva su propio progreso y su meta diaria: puedes estudiarlos en paralelo y practicar de nuevo uno que ya está al día.</p>
      ${(() => { const sp = sesionPendiente(); return m.modos.map((txt, i) => {
        const cc = conteosMazo(m, i); const n = cc.nuevas + cc.aprend + cc.repaso;
        const cont = sp && sp.target === m.id && !sp.soloNuevas && (sp.modo ?? modoDe(m.id)) === i;
        return `<div class="modo-row"><div class="grow"><b>${esc(txt)}</b><span>${n ? `${n} para hoy` : 'Al día ✓'}</span></div>
          <button class="btn sm" type="button" data-practica="${i}" ${tarjetas.length ? '' : 'disabled'}>Practicar de nuevo</button>
          <button class="btn primary sm" type="button" data-estudiar-modo="${i}" ${n || cont ? '' : 'disabled'}>${cont ? `Continuar ▶ · ${quedaTxt(sp)}` : 'Estudiar'}</button></div>`;
      }).join(''); })()}
    </div>` : ''}
    <div class="card">
      <div class="frow" style="align-items:end">
        <label class="f">Tarjetas nuevas por día<input type="number" id="nuevasPorDia" min="0" max="500" value="${m.nuevasPorDia ?? 20}" ${readOnly ? 'disabled' : ''}></label>
        ${modosDe(m).length ? `<label class="f">Tipo de respuesta<select id="modoSelect">${m.modos.map((x, i) => `<option value="${i}" ${i === modoDe(m.id) ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>` : ''}
        <div class="toolbar" style="grid-column:span ${modosDe(m).length ? 2 : 3};justify-content:flex-end">
          ${(() => { const f = falladasDe(m.id).length; return f ? `<button class="btn" type="button" data-falladas="${esc(m.id)}" title="Repaso aparte de las tarjetas que más fallas">Repasar más falladas (${f})</button>` : ''; })()}
          <button class="btn" type="button" data-act="export" title="Descargar el mazo en el formato .md">Exportar .md</button>
          <button class="btn" type="button" data-act="copy-md" title="Copiar el mazo para pedirle a una IA que lo amplíe o corrija">Copiar para la IA</button>
          <button class="btn" type="button" data-act="reset" ${readOnly ? 'disabled' : ''}>Reiniciar progreso</button>
          <button class="btn danger" type="button" data-act="delete" ${readOnly ? 'disabled' : ''}>Eliminar mazo</button>
        </div>
      </div>
      <p class="muted" style="font-size:.8rem;margin-top:10px">Para cambiar las tarjetas, edita el .md (o pídeselo a una IA) y vuelve a importarlo: las preguntas que no cambian conservan su progreso.</p>
    </div>
    <div class="card rev-entry">
      <div class="grow"><b>Revisar las ${tarjetas.length} tarjetas</b><span>Imagen, pregunta y respuesta de cada una, con sus veces vistas y su % de acierto. Puedes ver cada tarjeta resuelta o probarla.</span></div>
      <button class="btn primary" type="button" data-revisar="${esc(m.id)}">📖 Revisar mazo</button>
    </div>`;

  const inp = $('#nuevasPorDia');
  inp.addEventListener('change', () => {
    const v = Math.max(0, Math.min(500, parseInt(inp.value, 10) || 0));
    save('mazos', [{ ...S.mazos.get(m.id), nuevasPorDia: v }]);
    toast(`Nuevas por día: ${v}`);
  });
  const sel = $('#modoSelect');
  if (sel) sel.addEventListener('change', () => {
    save('mazos', [{ ...S.mazos.get(m.id), modo: +sel.value }]);
    toast(`Respuestas: ${m.modos[+sel.value]}`);
  });
}

function descargar(nombre, texto, tipo = 'text/markdown') {
  const url = URL.createObjectURL(new Blob([texto], { type: `${tipo};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mazo';

async function copiar(texto, okMsg) {
  try { await navigator.clipboard.writeText(texto); toast(okMsg); return; } catch (e) {}
  // Alternativa para navegadores o marcos sin acceso al portapapeles
  const ta = document.createElement('textarea');
  ta.value = texto; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) {}
  ta.remove();
  toast(ok ? okMsg : 'No se pudo copiar: selecciona el texto y cópialo a mano');
}

/* ---------- Vista: Crear con IA ---------- */
function promptActual() {
  const tema = $('#fTema').value.trim() || '[TEMA]';
  const cant = $('#fCantidad').value.trim() || '30';
  const nivel = $('#fNivel').value.trim() || 'general';
  const extra = $('#fExtra').value.trim();
  let p = window.MEMOSPARK_FORMATO
    .replace('[TEMA]', tema)
    .replace('[NÚMERO, por ejemplo 30]', cant)
    .replace('[por ejemplo, 3.º medio / universitario / principiante]', nivel);
  if (extra) p = p.replace('\n\nResponde SOLO', `\nIndicaciones extra: ${extra}\n\nResponde SOLO`);
  return p;
}
function renderFormato() {
  $('#promptPreview').textContent = promptActual();
  $('#sharePromptBtn').hidden = !navigator.share;
}

/* ---------- Importar ---------- */
let impParsed = null;
let impImages = {};
let impMissing = [];

const baseName = (p) => decodeURIComponent(String(p).split(/[\\/]/).pop()).toLowerCase();

// Las imágenes propias se guardan dentro de la tarjeta, reducidas para que el mazo no pese demasiado
function imagenADataUrl(file) {
  return new Promise((resolve) => {
    if (/svg|gif/.test(file.type) || file.size < 60 * 1024) {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.readAsDataURL(file);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1000;
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

function reemplazarImagenes(texto) {
  return String(texto || '').replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (all, alt, url) => {
    if (/^(https?:|data:)/i.test(url)) return all;
    const data = impImages[baseName(url)];
    return data ? `![${alt}](${data})` : all;
  });
}

function abrirImportar() {
  if (readOnly) { toast('Este tablero es de solo lectura'); return; }
  impParsed = null; impImages = {}; impMissing = [];
  $('#impFiles').value = '';
  $('#impText').value = '';
  $('#impPreview').innerHTML = '';
  $('#impConfirm').disabled = true;
  setImpMode('file');
  $('#dlg-import').showModal();
}
function setImpMode(mode) {
  $$('[data-imode]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.imode === mode)));
  $('#imp-file').hidden = mode !== 'file';
  $('#imp-paste').hidden = mode !== 'paste';
}

async function leerArchivos(files) {
  files = [...files];
  const mds = files.filter(f => /\.(md|markdown|txt)$/i.test(f.name) || /^text\//.test(f.type));
  const imgs = files.filter(f => /^image\//.test(f.type));
  for (const f of imgs) {
    const data = await imagenADataUrl(f);
    if (data) impImages[f.name.toLowerCase()] = data;
  }
  if (mds.length) {
    const textos = await Promise.all(mds.map(f => f.text()));
    $('#impText').value = textos.join('\n\n');
  }
  analizar($('#impText').value);
}

function analizar(texto) {
  const prev = $('#impPreview');
  if (!texto.trim()) {
    prev.innerHTML = Object.keys(impImages).length ? `<div class="muted">${Object.keys(impImages).length} imágenes listas. Falta el archivo .md.</div>` : '';
    $('#impConfirm').disabled = true;
    impParsed = null;
    return;
  }
  const res = MazoMD.parse(texto);
  impParsed = res;
  impMissing = [...new Set(res.mazos.flatMap(m => m.tarjetas.flatMap(t => MazoMD.imageRefs([t.pregunta, t.explicacion, ...t.opciones.map(o => o.t)].join('\n')))))]
    .filter(r => !impImages[baseName(r)]);
  if (!res.mazos.length) {
    prev.innerHTML = `<div class="imp-err">No se encontró ninguna tarjeta. Revisa que el texto siga el formato (pestaña <b>Crear con IA</b>).${res.avisos.length ? `<ul>${res.avisos.slice(0, 8).map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}</div>`;
    $('#impConfirm').disabled = true;
    return;
  }
  const decks = res.mazos.map(m => {
    const existente = S.mazos.get(m.id);
    let detalle = `${m.tarjetas.length} tarjetas`;
    if (existente) {
      const viejas = new Set(tarjetasDe(m.id).map(t => t.id));
      const nuevas = m.tarjetas.filter(t => !viejas.has(t.id)).length;
      const quitadas = [...viejas].filter(id => !m.tarjetas.some(t => t.id === id)).length;
      detalle += ` · ya existe: se actualiza (${nuevas} nuevas${quitadas ? `, ${quitadas} se quitan` : ''}, el resto conserva su progreso)`;
    }
    const libres = m.tarjetas.filter(t => !t.opciones.length).length;
    if (libres) detalle += ` · ${libres} de respuesta libre`;
    if (m.modos && m.modos.length > 1) detalle += ` · tipos de respuesta: ${m.modos.join(' / ')}`;
    return `<div class="imp-deck"><b>${esc(m.nombre)}</b><span class="muted" style="font-size:.85rem">${esc(detalle)}</span></div>`;
  }).join('');
  const avisos = [...res.avisos];
  if (impMissing.length) avisos.push(`Faltan imágenes: ${impMissing.join(', ')}. Elígelas junto con el .md o se verán rotas.`);
  prev.innerHTML = decks + (avisos.length ? `<div class="imp-warn"><b>Revisa:</b><ul>${avisos.slice(0, 12).map(a => `<li>${esc(a)}</li>`).join('')}${avisos.length > 12 ? `<li>… y ${avisos.length - 12} más</li>` : ''}</ul></div>` : '');
  $('#impConfirm').disabled = false;
}

async function confirmarImportar() {
  if (!impParsed || !impParsed.mazos.length) return;
  const totalTarjetas = await guardarMazos(impParsed.mazos);
  $('#dlg-import').close();
  toast(`Importado: ${impParsed.mazos.length === 1 ? `«${impParsed.mazos[0].nombre}»` : `${impParsed.mazos.length} mazos`} con ${totalTarjetas} tarjetas`);
  const unico = impParsed.mazos.length === 1 ? impParsed.mazos[0].id : null;
  impParsed = null;
  if (unico) go('mazo', { mazo: unico }); else go('mazos');
}

// Guarda mazos leídos (nuevos o ya existentes: las tarjetas que no cambian conservan su progreso). fuente: huella del .md de origen
async function guardarMazos(mazos, fuente) {
  const now = Date.now();
  let totalTarjetas = 0;
  for (const m of mazos) {
    const existente = S.mazos.get(m.id);
    await save('mazos', [{
      ...(existente || { creado: now, nuevasPorDia: 20 }),
      ...(fuente ? { fuente } : {}),
      id: m.id, nombre: m.nombre, descripcion: reemplazarImagenes(m.descripcion),
      modos: m.modos && m.modos.length > 1 ? m.modos : [],
      siglas: m.siglas || {},
      modo: existente && m.modos && (existente.modo || 0) < m.modos.length ? existente.modo || 0 : 0
    }]);
    const viejas = tarjetasDe(m.id);
    const nuevasIds = new Set(m.tarjetas.map(t => t.id));
    const puts = m.tarjetas.map(t => ({
      id: t.id, mazoId: m.id, orden: t.orden,
      pregunta: reemplazarImagenes(t.pregunta),
      opciones: t.opciones.map(o => ({ t: reemplazarImagenes(o.t), ok: o.ok })),
      respuesta: t.respuesta,
      explicacion: reemplazarImagenes(t.explicacion)
    })).filter(t => {
      const old = S.tarjetas.get(t.id);
      return !old || JSON.stringify({ ...old, updatedAt: 0 }) !== JSON.stringify({ ...t, updatedAt: 0 });
    });
    const quitar = viejas.filter(t => !nuevasIds.has(t.id)).map(t => t.id);
    await save('tarjetas', puts, quitar);
    const progQuitar = quitar.flatMap(clavesProg);
    if (progQuitar.length) await save('progreso', [], progQuitar);
    totalTarjetas += m.tarjetas.length;
  }
  return totalTarjetas;
}

// Los mazos de ejemplo que ya tienes se actualizan solos cuando se publica una versión nueva del .md
// (mismo nombre de mazo: lo que no cambió conserva su progreso). Si no hay conexión, no pasa nada.
const EJEMPLOS = ['ejemplos/aws-arquitecto.md'];
let ejemplosRevisados = false;
async function actualizarEjemplos() {
  if (ejemplosRevisados || readOnly) return;
  ejemplosRevisados = true;
  for (const ruta of EJEMPLOS) {
    try {
      const r = await fetch(ruta, { cache: 'no-cache' });
      if (!r.ok) continue;
      const texto = await r.text();
      const res = MazoMD.parse(texto);
      const fuente = MazoMD.hash(texto);
      const mazos = res.mazos.filter(m => S.mazos.has(m.id) && S.mazos.get(m.id).fuente !== fuente);
      if (!mazos.length) continue;
      await guardarMazos(mazos, fuente);
      toast(`Mazo «${mazos[0].nombre}» actualizado`);
      render();
    } catch (e) { console.warn('Ejemplo', ruta, e); }
  }
}

async function cargarEjemplo(nombre = 'capitales-de-europa') {
  try {
    const r = await fetch(`ejemplos/${nombre}.md`, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    const texto = await r.text();
    if (!$('#dlg-import').open) abrirImportar();
    setImpMode('paste');
    $('#impText').value = texto;
    analizar(texto);
  } catch (e) {
    toast('No se pudo cargar el ejemplo (¿sin conexión?)');
  }
}

/* ---------- Estudio ---------- */
let study = null;

// solo: sesión «sin ver» (Set con los ids ya empezados en ella): entran todas las nuevas sin el tope diario,
// más esas tarjetas mientras siguen en aprendizaje, y nada más.
function candidatos(target, solo = null) {
  const mazos = target === '*' ? mazosOrdenados() : [S.mazos.get(target)].filter(Boolean);
  const out = [];
  mazos.forEach((m, mi) => {
    let libres = nuevasRestantes(m);
    tarjetasModo(m.id, modoDe(m.id)).forEach(t => {
      const p = progresoDe(t);
      if (solo) { if (p.estado !== 'nuevo' && !solo.has(t.id)) return; }
      else if (p.estado === 'nuevo') { if (libres <= 0) return; libres--; }
      out.push({ ...p, orden: mi * 100000 + t.orden });
    });
  });
  return out;
}
// Tarjetas de una sesión en curso o guardada (normal o «sin ver»)
const candSesion = (s) => candidatos(s.target, s.soloNuevas ? new Set(s.ids || []) : null);
// Tiempo que le queda a una sesión de 10 min
const quedaTxt = (s) => `quedan ${Math.max(1, Math.ceil((SESION_MAX_MS - (s.usado || 0)) / 60000))} min`;

const modosDe = (m) => (m && Array.isArray(m.modos) && m.modos.length > 1 ? m.modos : []);
const modoDe = (mazoId) => { const m = S.mazos.get(mazoId); return modosDe(m).length ? Math.min(m.modo || 0, m.modos.length - 1) : 0; };

// Antes de estudiar un mazo con varios tipos de respuesta se elige cuál usar (queda recordado en el mazo)
function startStudy(target, { elegido = false, soloNuevas = false, ids = null } = {}) {
  // Si hay una sesión a medias de este mismo mazo (y del mismo tipo), se retoma (con su tipo de respuesta ya elegido)
  const previa = sesionPendiente();
  const m = target !== '*' && S.mazos.get(target);
  // Una sesión a medias solo se retoma en el mismo tipo de respuesta con que se empezó
  const reanudar = previa && previa.target === target && !!previa.soloNuevas === !!soloNuevas && (!m || previa.modo == null || previa.modo === modoDe(target)) ? previa : null;
  // Cada tipo de respuesta tiene su propio progreso y meta diaria: se elige uno que aún tenga tarjetas para hoy
  if (m && modosDe(m).length && !elegido && !reanudar) {
    if (pendientesPorModo(m).some(n => n > 0)) elegirModo(m, soloNuevas); else toast('No hay tarjetas para estudiar ahora');
    return;
  }
  const idsSolo = soloNuevas ? new Set(reanudar ? reanudar.ids || [] : ids || []) : null;
  const lista = candidatos(target, idsSolo);
  const c = SRS.conteos(lista, Infinity);
  if (!c.nuevas && !c.aprend && !c.repaso) { if (!soloNuevas) borrarSesion(); toast(soloNuevas ? 'No quedan tarjetas sin ver' : 'No hay tarjetas para estudiar ahora'); return; }
  if (!reanudar) borrarSesion();
  study = { target, soloNuevas, ids: idsSolo, contador: 0, ultimaId: null, hechas: 0, aciertos: 0, usado: 0, inicial: c.nuevas + c.aprend + c.repaso, actual: null, espera: null };
  if (reanudar) Object.assign(study, { usado: reanudar.usado || 0, hechas: reanudar.hechas, aciertos: reanudar.aciertos, contador: reanudar.contador, inicial: Math.max(reanudar.inicial, reanudar.hechas + c.nuevas + c.aprend + c.repaso) });
  $('#studyTitle').textContent = (target === '*' ? 'Todos los mazos' : (S.mazos.get(target) || {}).nombre || '') + (soloNuevas ? ' · Sin ver' : '');
  go('estudio');
  // Primero la misma tarjeta que estaba en pantalla al salir, si todavía toca
  const pend = reanudar && reanudar.actualId && lista.find(p => p.id === reanudar.actualId);
  const t = pend && S.tarjetas.get(pend.id);
  if (t) mostrarTarjeta(t, pend.estado === 'nuevo' ? 'nuevo' : pend.estado === 'repaso' ? 'repaso' : 'aprendiendo');
  else nextCard();
  if (reanudar) toast(`Sesión retomada: ${reanudar.hechas} ${reanudar.hechas === 1 ? 'respondida' : 'respondidas'} hasta ahora`);
}

// Salir del estudio (endStudy guarda lo respondido y deja la sesión lista para seguir después)
function salirDelEstudio() {
  if (study && study.volverA) go(study.volverA, study.target !== '*' ? { mazo: study.target } : {});
  else if (study && study.target !== '*') go('mazo', { mazo: study.target }); else go('mazos');
}

function elegirModo(m, soloNuevas = false) {
  const pend = pendientesPorModo(m);
  const ultimo = modoDe(m.id);
  const actual = pend[ultimo] > 0 ? ultimo : Math.max(0, pend.findIndex(n => n > 0));
  $('#modoMazo').textContent = m.nombre;
  $('#modoOpciones').innerHTML = m.modos.map((txt, i) => `
    <label class="modo-op"><input type="radio" name="modoResp" value="${i}" ${i === actual ? 'checked' : ''} ${pend[i] > 0 ? '' : 'disabled'}><span><b>${esc(txt)}</b><small>${pend[i] > 0 ? `${pend[i]} para hoy${i === ultimo ? ' · la última vez' : ''}` : 'Al día ✓'}</small></span></label>`).join('');
  $('#modoEmpezar').onclick = async () => {
    const sel = +(($('input[name="modoResp"]:checked') || {}).value || 0);
    $('#dlg-modo').close();
    if (sel !== (m.modo || 0)) await save('mazos', [{ ...m, modo: sel }]);
    startStudy(m.id, { elegido: true, soloNuevas });
  };
  $('#dlg-modo').showModal();
}

function endStudy() {
  if (!study) return;
  clearTimeout(study.espera);
  const a = study.actual;
  // guardarRespuesta actualiza los contadores antes de su primer await, así que la sesión ya los incluye
  if (a && a.resultado && !a.guardada) guardarRespuesta(a);
  if (!study.terminada) guardarSesion();
  study = null;
}

function renderCounts(tipoActual) {
  if (study.falladas) {
    const quedan = study.cola.length + (study.actual && !study.actual.guardada ? 1 : 0);
    $('#studyCounts').innerHTML = `<span class="a" title="Quedan en este repaso">${quedan}</span>`;
    $('#studyBar').style.width = `${Math.min(100, (study.hechas / Math.max(1, study.hechas + quedan)) * 100)}%`;
    return;
  }
  const c = SRS.conteos(candSesion(study), Infinity);
  const on =(t) => tipoActual === t ? ' data-on' : '';
  $('#studyCounts').innerHTML = `<span class="n" title="Nuevas"${on('nuevo')}>${c.nuevas}</span><span class="a" title="Aprendiendo"${on('aprendiendo')}>${c.aprend}</span><span class="r" title="Repaso"${on('repaso')}>${c.repaso}</span>`;
  const quedan = c.nuevas + c.aprend + c.repaso;
  const base = Math.max(study.inicial, study.hechas + quedan, 1);
  $('#studyBar').style.width = `${Math.min(100, (study.hechas / base) * 100)}%`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/* ---------- Repaso de las más falladas ---------- */
// Errores de cada tarjeta según el registro de respuestas (o los fallos guardados en su progreso, si el registro
// ya se recortó). Orden: más errores, luego mayor proporción de errores, luego la fallada más recientemente.
function falladasDe(target, max = 20) {
  const errores = new Map(), totales = new Map(), ultimo = new Map();
  S.registro.forEach(r => {
    totales.set(r.tarjetaId, (totales.get(r.tarjetaId) || 0) + 1);
    if (!r.correcta) {
      errores.set(r.tarjetaId, (errores.get(r.tarjetaId) || 0) + 1);
      ultimo.set(r.tarjetaId, Math.max(ultimo.get(r.tarjetaId) || 0, r.ts));
    }
  });
  const tarjetas = target === '*' ? [...S.tarjetas.values()] : tarjetasDe(target);
  return tarjetas.map(t => {
    const p = S.progreso.get(claveProg(t.id, modoDe(t.mazoId)));
    const e = Math.max(errores.get(t.id) || 0, (p && p.fallos) || 0);
    const n = Math.max(totales.get(t.id) || 0, e);
    return { t, errores: e, total: n, tasa: n ? e / n : 0, ultimoFallo: ultimo.get(t.id) || 0 };
  }).filter(x => x.errores > 0)
    .sort((a, b) => b.errores - a.errores || b.tasa - a.tasa || b.ultimoFallo - a.ultimoFallo)
    .slice(0, max);
}

// Sesión aparte con las 20 más falladas, en orden al azar. Cada respuesta actualiza la repetición espaciada
// (con SRS.responderAdelantado) y queda en el registro; las que se fallan vuelven a salir hasta 2 veces más.
function repasarFalladas(target) {
  const lista = falladasDe(target);
  if (!lista.length) { toast('Todavía no hay tarjetas falladas'); return; }
  sesionAparte(target, shuffle(lista.map(x => x.t.id)), 'falladas', 'Más falladas', 2);
}

// Sesión aparte (repaso de falladas o «Probar» una tarjeta desde Revisar): no pisa la sesión a medias,
// pero cada respuesta cuenta para la repetición espaciada y queda en el registro con su tipo.
// vueltasMax: cuántas veces más sale una tarjeta que se falla dentro de la misma sesión.
function sesionAparte(target, ids, tipo, titulo, vueltasMax = 0) {
  const volverA = vista === 'stats' || vista === 'revisar' ? vista : target === '*' ? 'mazos' : 'mazo';
  if (vista === 'estudio') endStudy();
  study = { target, falladas: true, tipoAparte: tipo, vueltasMax, volverA, cola: [...ids], vueltas: {}, contador: 0, ultimaId: null, hechas: 0, aciertos: 0, inicial: ids.length, actual: null, espera: null };
  $('#studyTitle').textContent = `${titulo} · ${target === '*' ? 'Todos los mazos' : (S.mazos.get(target) || {}).nombre || ''}`;
  if (target !== '*') mazoAbierto = target;
  go('estudio');
  nextCard();
}

function nextCard() {
  if (!study) return;
  clearTimeout(study.espera);
  if (study.falladas) {
    if (study.tipoAparte === 'extra' && study.usado >= SESION_MAX_MS && study.cola.length) return renderBloqueExtra();
    while (study.cola.length) {
      const t = S.tarjetas.get(study.cola.shift());
      if (t) return mostrarTarjeta(t, study.tipoAparte);
    }
    return renderFin();
  }
  if (study.usado >= SESION_MAX_MS) return renderBloque();
  const sig = SRS.siguiente(candSesion(study), { nuevasRestantes: Infinity, repasosRestantes: Infinity, ultimaId: study.ultimaId, contador: study.contador });
  if (!sig || sig.espera) { renderFin(sig && sig.espera); return; }
  const t = S.tarjetas.get(sig.p.id);
  if (!t) { study.ultimaId = sig.p.id; return renderFin(); }
  mostrarTarjeta(t, sig.tipo);
}

function mostrarTarjeta(t, tipo) {
  if (study.soloNuevas) study.ids.add(t.id);
  // version: tipo de respuesta elegido para el mazo (cada alternativa trae «corta || larga»)
  const version = modoDe(t.mazoId);
  // «Sigla y significado»: la tarjeta pasa a ser una pregunta de respuesta libre con la sigla (mismo id, así que el progreso es el de la tarjeta)
  const sg = esModoSigla(S.mazos.get(t.mazoId), version) ? siglaDeTarjeta(t) : null;
  if (sg) t = { ...t, pregunta: `¿Qué significa la sigla **${sg.sig}**?`, opciones: [], respuesta: sg.respuesta, explicacion: `${sg.servicio}${sg.significado !== sg.respuesta ? `\n\n**${sg.sig}**: ${sg.significado}` : ''}${t.explicacion ? `\n\n${t.explicacion}` : ''}` };
  const opciones = t.opciones && t.opciones.length ? shuffle(t.opciones.map(o => ({ t: MazoMD.variante(o.t, version), ok: o.ok }))) : [];
  const correctas = opciones.filter(o => o.ok).length;
  study.actual = {
    t, p: progresoDe(t, version), tipo, opciones, version,
    modo: !opciones.length ? 'libre' : correctas > 1 ? 'multiple' : 'unica',
    elegidas: new Set(), resultado: null, siglaCard: !!sg,
    inicio: performance.now(), oculto: 0, ocultoDesde: null
  };
  renderCounts(tipo);
  renderCard();
  guardarSesion();
}

// Tiempo de respuesta sin contar el rato en que la app estuvo en segundo plano
document.addEventListener('visibilitychange', () => {
  const a = study && study.actual;
  if (!a || a.resultado) return;
  if (document.visibilityState === 'hidden') a.ocultoDesde = performance.now();
  else if (a.ocultoDesde != null) { a.oculto += performance.now() - a.ocultoDesde; a.ocultoDesde = null; }
});
const tiempoRespuesta = (a) => performance.now() - a.inicio - a.oculto - (a.ocultoDesde != null ? performance.now() - a.ocultoDesde : 0);

const contarPalabras = (s) => (String(s || '').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/[#*_`>\[\]()|-]/g, ' ').match(/[\p{L}\p{N}]+/gu) || []).length;

// Sonidos generados en el momento (sin archivos de audio). notas: [frecuencia inicial, final, retraso, duración]
let audioCtx = null;
function tocar(tipo, notas, volumen) {
  if (!ajustes.sonido) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = audioCtx || new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t0 = audioCtx.currentTime;
    notas.forEach(([f1, f2, delay, dur]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = tipo;
      osc.frequency.setValueAtTime(f1, t0 + delay);
      osc.frequency.exponentialRampToValueAtTime(f2, t0 + delay + dur);
      gain.gain.setValueAtTime(0.0001, t0 + delay);
      gain.gain.exponentialRampToValueAtTime(volumen, t0 + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + delay + dur);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t0 + delay);
      osc.stop(t0 + delay + dur + 0.02);
    });
  } catch (e) {}
}
// Acierto: dos notas que suben. Fallo: dos notas graves que bajan.
const sonarAcierto = () => tocar('sine', [[880, 880, 0, 0.28], [1318.5, 1318.5, 0.09, 0.28]], 0.22);
const sonarFallo = () => tocar('triangle', [[330, 260, 0, 0.18], [247, 165, 0.16, 0.32]], 0.28);

function vibrar(patron) {
  if (!ajustes.vibrar || !navigator.vibrate) return;
  try { navigator.vibrate(patron); } catch (e) {}
}

// Check verde o cruz roja grande, animada sobre la tarjeta
function mostrarSello(ok) {
  const flip = $('#flip');
  if (!flip) return;
  const sello = document.createElement('div');
  sello.className = `sello ${ok ? 'ok' : 'bad'}`;
  sello.setAttribute('aria-hidden', 'true');
  sello.innerHTML = ok
    ? '<svg viewBox="0 0 120 120"><circle class="aro" cx="60" cy="60" r="52"/><path class="trazo" d="M34 62 52 80 88 42"/></svg>'
    : '<svg viewBox="0 0 120 120"><circle class="aro" cx="60" cy="60" r="52"/><path class="trazo" d="M40 40 80 80"/><path class="trazo t2" d="M80 40 40 80"/></svg>';
  flip.appendChild(sello);
  sello.addEventListener('animationend', (e) => { if (e.target === sello) sello.remove(); });
}

const ICON_OK = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_BAD = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m8 8 8 8m0-8-8 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
const LETRAS = 'ABCDEFGHIJ';
const TIPO_TXT = { nuevo: 'Nueva', aprendiendo: 'Aprendiendo', repaso: 'Repaso', falladas: 'De las más falladas', prueba: 'Prueba', extra: 'Práctica' };

function renderCard() {
  const a = study.actual;
  const { t } = a;
  const mazo = S.mazos.get(t.mazoId);
  const tag = `<div class="face-tag"><span class="chip ${a.tipo === 'nuevo' ? 'new' : a.tipo === 'repaso' ? 'due' : 'learn'}">${TIPO_TXT[a.tipo]}</span>${study.target === '*' && mazo ? `<span class="muted" style="font-size:.78rem">${esc(mazo.nombre)}</span>` : ''}</div>`;
  let frente = '';
  if (a.modo === 'libre') {
    frente = `
      <label class="f">Tu respuesta<input type="text" id="libreInput" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Escribe la respuesta"></label>
      <div class="toolbar">
        <button class="btn primary" type="button" data-act="check" disabled>Comprobar</button>
        <button class="btn ghost" type="button" data-act="dont-know">No la sé</button>
      </div>`;
  } else {
    frente = `
      ${a.modo === 'multiple' ? '<div class="hint">Hay más de una correcta: márcalas todas y pulsa Comprobar.</div>' : ''}
      <div class="opts">${a.opciones.map((o, i) => `<button class="opt" type="button" data-opt="${i}" aria-pressed="false"><span class="k">${LETRAS[i] || i + 1}</span><span class="t">${MazoMD.inline(o.t)}</span></button>`).join('')}</div>
      ${a.modo === 'multiple' ? '<button class="btn primary" type="button" data-act="check" disabled>Comprobar</button>' : ''}`;
  }
  $('#studyStage').innerHTML = `
    <div class="flip" id="flip">
      <div class="flip-in">
        <div class="face front">${tag}<div class="qtext">${MazoMD.render(t.pregunta, {}, { siglas: !a.siglaCard })}</div>${frente}</div>
        <div class="face back" id="cardBack" aria-live="polite"></div>
      </div>
    </div>
    <div id="grades"></div>
    <div class="kbd-help">${a.modo === 'libre' ? 'Enter: comprobar' : `Teclas ${LETRAS.slice(0, a.opciones.length).split('').join(' ')} o 1–${a.opciones.length} para elegir`}</div>`;
  if (a.modo === 'libre') {
    const inp = $('#libreInput');
    inp.addEventListener('input', () => { $('#flip [data-act="check"]').disabled = !inp.value.trim(); });
    setTimeout(() => { if (matchMedia('(hover:hover)').matches) inp.focus(); }, 50);
  }
}

// Distancia de edición (para aceptar un error de tipeo en las respuestas libres)
function distancia(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}
// Respuesta libre: sin importar mayúsculas, tildes ni signos; se acepta 1 error de tipeo (2 en respuestas largas).
// Si la respuesta trae variantes separadas por « / », vale cualquiera.
function respuestaCorrecta(escrita, respuesta) {
  const e = normalizar(escrita);
  if (!e) return false;
  return String(respuesta || '').split(/\s+\/\s+/).map(normalizar).filter(Boolean).some(r => {
    if (r === e) return true;
    const tolerancia = r.length >= 10 ? 2 : r.length >= 5 ? 1 : 0;
    return tolerancia > 0 && distancia(e, r) <= tolerancia;
  });
}

const normalizar =(s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

function elegirOpcion(i) {
  const a = study && study.actual;
  if (!a || a.resultado || a.modo === 'libre' || !a.opciones[i]) return;
  if (a.modo === 'unica') {
    a.elegidas = new Set([i]);
    evaluar();
    return;
  }
  if (a.elegidas.has(i)) a.elegidas.delete(i); else a.elegidas.add(i);
  $$('#flip .front .opt').forEach(b => b.setAttribute('aria-pressed', String(a.elegidas.has(+b.dataset.opt))));
  $('#flip [data-act="check"]').disabled = !a.elegidas.size;
}

// noLaSe: en respuesta libre, rendirse cuenta como error
function evaluar(noLaSe = false) {
  const a = study.actual;
  if (a.resultado) return;
  a.ms = tiempoRespuesta(a);
  let ok;
  if (a.modo === 'libre') {
    a.escrita = noLaSe ? '' : (($('#libreInput') || {}).value || '').trim();
    if (!a.escrita && !noLaSe) return;
    // Lo escrito se compara con la versión corta (escribir la explicación completa no tendría sentido)
    ok = respuestaCorrecta(a.escrita, MazoMD.variante(a.t.respuesta, 0));
  } else {
    ok = a.opciones.every((o, i) => o.ok === a.elegidas.has(i));
  }
  a.resultado = ok ? 'ok' : 'bad';
  // Calificación automática: acierto, tiempo de respuesta y aciertos seguidos de la tarjeta
  const palabras = contarPalabras(a.t.pregunta) + a.opciones.reduce((n, o) => n + contarPalabras(o.t), 0);
  a.palabras = palabras;
  a.esperadoMs = SRS.tiempoEsperado(palabras, a.modo === 'libre' ? contarPalabras(MazoMD.variante(a.t.respuesta, 0).split(/\s+\/\s+/)[0]) : 0);
  const auto = SRS.notaAutomatica({ correcta: ok, ms: a.ms, esperadoMs: a.esperadoMs, racha: a.p.racha || 0 });
  a.nota = auto.nota;
  a.ritmo = auto.ritmo;
  if (ok) { sonarAcierto(); vibrar(30); }
  else { sonarFallo(); vibrar([90, 60, 90]); }
  renderBack();
  $('#flip').classList.add('flipped');
  mostrarSello(ok);
}

function renderBack() {
  const a = study.actual;
  const { t, p } = a;
  let verdict, cuerpo;
  verdict = a.resultado === 'ok' ? `<div class="verdict ok">${ICON_OK}<span>¡Correcto!</span></div>` : `<div class="verdict bad">${ICON_BAD}<span>${a.modo === 'libre' && !a.escrita ? 'Para la próxima' : 'Incorrecto'}</span></div>`;
  if (a.modo === 'libre') {
    cuerpo = `${a.escrita ? `<div class="answer-box"><div class="l">Tu respuesta</div>${esc(a.escrita)}</div>` : ''}
      <div class="answer-box"><div class="l">Respuesta</div><div class="md" style="font-size:1.15rem;font-weight:600">${MazoMD.render(MazoMD.variante(t.respuesta, a.version))}</div></div>`;
  } else {
    cuerpo = `<div class="opts">${a.opciones.map((o, i) => {
      const elegida = a.elegidas.has(i);
      const cls = o.ok ? 'is-ok' : elegida ? 'is-bad' : '';
      const marca = o.ok ? '✓' : elegida ? '✗' : LETRAS[i];
      const nota = o.ok && !elegida && a.modo === 'multiple' ? ' <span class="muted" style="font-size:.8rem">(te faltó)</span>' : elegida && !o.ok ? ' <span class="muted" style="font-size:.8rem">(tu respuesta)</span>' : '';
      return `<div class="opt static ${cls}"><span class="k">${marca}</span><span class="t">${MazoMD.inline(o.t)}${nota}</span></div>`;
    }).join('')}</div>`;
  }
  const explic = t.explicacion ? `<div class="explain"><div class="l">Explicación</div><div class="md">${MazoMD.render(t.explicacion)}</div></div>` : '';
  // La pregunta completa (con su imagen) también se ve al revisar, para entender mejor la falla
  $('#cardBack').innerHTML = `${verdict}<div class="q-small q-full md"><div class="l">Pregunta</div>${MazoMD.render(t.pregunta)}</div>${cuerpo}${explic}`;

  // La calificación la decide la app; solo se muestra por qué y cuándo vuelve la tarjeta
  const seg = (a.ms / 1000).toLocaleString('es', { maximumFractionDigits: 1 });
  const racha = a.resultado === 'ok' ? (p.racha || 0) + 1 : 0;
  const motivo = a.resultado === 'bad' ? 'Vuelve a aparecer en un momento'
    : a.ritmo === 'lento' ? `Respondiste en ${seg} s: con calma, la repasarás antes`
    : a.ritmo === 'rapido' && a.nota === 4 ? `Respondiste en ${seg} s y la llevas ${racha} veces seguidas: la verás más adelante`
    : `Respondiste en ${seg} s${racha > 1 ? ` · ${racha} aciertos seguidos` : ''}`;
  $('#grades').innerHTML = `
    <div class="auto-grade g${a.nota}"><span class="badge">${NOTA_TXT[a.nota]}</span><span>${esc(motivo)}</span></div>
    <div class="grades one"><button class="grade main" type="button" data-act="continue">Continuar<small>vuelve en ${SRS.cuando(p, a.nota, Date.now(), !!study.falladas)}</small></button></div>`;
  $('.kbd-help').textContent = 'Espacio o Enter: continuar';
}
const NOTA_TXT = { 1: 'Otra vez', 2: 'Difícil', 3: 'Bien', 4: 'Fácil' };

// seguir = false: guarda la respuesta y la sesión sin pasar a la siguiente tarjeta (al salir del estudio)
async function continuar(seguir = true) {
  const a = study && study.actual;
  if (!a || !a.resultado) return;
  if (!a.guardada) await guardarRespuesta(a);
  study.actual = null;
  guardarSesion();
  if (seguir) nextCard();
}

// Guarda una respuesta ya dada (progreso, conteo del día y registro). Se llama una sola vez por tarjeta:
// al continuar, al salir o si la app pasa a segundo plano con la tarjeta ya respondida.
async function guardarRespuesta(a) {
  a.guardada = true;
  // Tiempo de la sesión: lo que estuvo la tarjeta en pantalla (sin segundo plano y con tope por si se deja abierta)
  const enPantalla = performance.now() - a.inicio - a.oculto - (a.ocultoDesde != null ? performance.now() - a.ocultoDesde : 0);
  study.usado = (study.usado || 0) + Math.min(Math.max(enPantalla, 0), 120000);
  const nota = a.nota;
  const antes = a.p;
  // En el repaso de falladas la tarjeta puede no tocar todavía: se agenda sin inflar su intervalo
  a.sesionTipo = study.falladas ? study.tipoAparte : 'normal';
  a.adelantada = antes.estado === 'repaso' && antes.vence > SRS.dayStart() + SRS.DAY;
  const despues = study.falladas ? SRS.responderAdelantado(antes, nota) : SRS.responder(antes, nota);
  const acierto = nota > 1;
  if (study.falladas && !acierto && (study.vueltas[antes.id] || 0) < study.vueltasMax) {
    study.vueltas[antes.id] = (study.vueltas[antes.id] || 0) + 1;
    study.cola.splice(Math.min(3, study.cola.length), 0, antes.id);
  }
  study.hechas++;
  if (acierto) study.aciertos++;
  study.contador++;
  study.ultimaId = antes.id;
  const dia = diaDe(antes.mazoId, undefined, a.version || 0);
  const d2 = { ...dia, total: dia.total + 1, aciertos: dia.aciertos + (acierto ? 1 : 0), nuevas: dia.nuevas + (antes.estado === 'nuevo' ? 1 : 0), repasos: dia.repasos + (antes.estado === 'nuevo' ? 0 : 1) };
  const prog = { ...despues, id: claveProg(antes.id, a.version || 0) };
  delete prog.orden;
  await save('progreso', [prog]);
  await save('dias', [d2]);
  await registrar(a, antes, despues);
}

// Si la app se cierra o pasa a segundo plano a mitad de la sesión, lo respondido y la tarjeta actual quedan guardados
function guardarAlOcultar() {
  if (!study || vista !== 'estudio' || study.terminada) return;
  const a = study.actual;
  if (a && a.resultado && !a.guardada) guardarRespuesta(a);
  guardarSesion();
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') guardarAlOcultar(); });
window.addEventListener('pagehide', guardarAlOcultar);

/* ---------- Registro de respuestas (para ir ajustando la calificación automática) ---------- */
// Una fila por respuesta con lo que usó la calificación (tiempo, tiempo esperado, aciertos seguidos)
// y lo que decidió. Comparando con la respuesta siguiente de la misma tarjeta se ve si la nota fue acertada:
// si las «Fácil» se olvidan seguido, el umbral de rápido es muy generoso, etc.
const MAX_REGISTRO = IN_ZENBAN ? 600 : 5000;
async function registrar(a, antes, despues) {
  const now = Date.now();
  const fila = {
    id: `r${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    ts: now, tarjetaId: antes.id, mazoId: antes.mazoId, modo: a.modo, version: a.version || 0,
    correcta: a.resultado === 'ok', ms: Math.round(a.ms), esperadoMs: Math.round(a.esperadoMs), palabras: a.palabras,
    relacion: Math.round(a.ms / Math.max(1000, a.esperadoMs) * 100) / 100,
    ritmo: a.ritmo, nota: a.nota, rachaAntes: antes.racha || 0,
    sesion: a.sesionTipo || 'normal', adelantada: !!a.adelantada,
    estadoAntes: antes.estado, intervaloAntes: antes.intervalo || 0, intervaloDespues: despues.estado === 'repaso' ? despues.intervalo : 0,
    facilidad: despues.facilidad,
    diasDesdeAnterior: antes.ultima ? Math.round((now - antes.ultima) / SRS.DAY * 100) / 100 : null
  };
  const filas = [...S.registro.values()].sort((x, y) => x.ts - y.ts);
  const sobran = filas.length + 1 - MAX_REGISTRO;
  // Se borran de a varias para no reescribir el registro en cada respuesta
  const borrar = sobran > 0 ? filas.slice(0, sobran + Math.round(MAX_REGISTRO * 0.05)).map(f => f.id) : [];
  await save('registro', [fila], borrar);
}

// Para cada nota: cuántas veces se dio y qué pasó la vez siguiente que apareció la misma tarjeta
function analizarRegistro() {
  const filas = [...S.registro.values()].sort((x, y) => x.ts - y.ts);
  const porTarjeta = new Map();
  filas.forEach(f => { if (!porTarjeta.has(f.tarjetaId)) porTarjeta.set(f.tarjetaId, []); porTarjeta.get(f.tarjetaId).push(f); });
  const res = { 1: [], 2: [], 3: [], 4: [] };
  porTarjeta.forEach(lista => lista.forEach((f, i) => res[f.nota] && res[f.nota].push({ f, sig: lista[i + 1] || null })));
  const mediana = (v) => { if (!v.length) return null; const s = [...v].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  return {
    total: filas.length,
    desde: filas.length ? filas[0].ts : null,
    aciertos: filas.filter(f => f.correcta).length,
    notas: [1, 2, 3, 4].map(n => {
      const items = res[n];
      const conSig = items.filter(x => x.sig);
      return {
        nota: n, n: items.length,
        relacion: mediana(items.map(x => x.f.relacion)),
        siguientes: conSig.length,
        recuerdo: conSig.length ? conSig.filter(x => x.sig.correcta).length / conSig.length : null
      };
    })
  };
}

function registroCsv() {
  const cols = ['ts', 'fecha', 'tarjetaId', 'mazoId', 'modo', 'correcta', 'ms', 'esperadoMs', 'palabras', 'relacion', 'ritmo', 'nota', 'rachaAntes', 'estadoAntes', 'intervaloAntes', 'intervaloDespues', 'facilidad', 'diasDesdeAnterior', 'sesion', 'adelantada', 'version', 'pregunta'];
  const q = (v) => { const s = v == null ? '' : String(v); return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const filas = [...S.registro.values()].sort((x, y) => x.ts - y.ts).map(f => {
    const t = S.tarjetas.get(f.tarjetaId);
    const extra = { fecha: new Date(f.ts).toISOString(), pregunta: t ? t.pregunta.split('\n')[0] : '' };
    return cols.map(c => q(c in extra ? extra[c] : f[c])).join(',');
  });
  return [cols.join(','), ...filas].join('\n');
}

function renderFin(espera) {
  const pct = study.hechas ? Math.round(study.aciertos / study.hechas * 100) : 0;
  renderCounts(null);
  if (study.falladas) {
    study.terminada = true;
    if (study.tipoAparte === 'prueba') {
      const ok = study.aciertos > 0;
      // Al probar una sola tarjeta se vuelve solo a la lista (en la misma página)
      $('#studyStage').innerHTML = `<div class="card done"><div class="big">${ok ? '✅' : '📌'}</div><h3>${ok ? '¡La sabías!' : 'Para la próxima'}</h3><p class="muted">La respuesta quedó registrada y cuenta para la repetición espaciada.</p><button class="btn primary" type="button" data-act="end-study">Volver a la lista</button></div>`;
      $('#studyBar').style.width = '100%';
      return;
    }
    $('#studyStage').innerHTML = `<div class="card done"><div class="big">💪</div><h3>Repaso de las más falladas listo</h3><p class="muted">${study.hechas} respuestas · ${pct}% de aciertos. Lo que respondiste ya quedó en tu repetición espaciada: las que volviste a fallar aparecerán pronto en tu sesión normal.${sesionPendiente() ? ' Tu sesión a medias sigue intacta.' : ''}</p><button class="btn primary" type="button" data-act="end-study">Volver</button></div>`;
    $('#studyBar').style.width = '100%';
    return;
  }
  if (espera) {
    const min = Math.max(1, Math.ceil(espera / SRS.MIN));
    $('#studyStage').innerHTML = `<div class="card done"><div class="big">⏳</div><h3>Pausa breve</h3><p class="muted">Quedan tarjetas en aprendizaje. Vuelven en ${min} min; la sesión sigue sola.</p>${study.hechas ? `<p>${study.hechas} respondidas · ${pct}% de aciertos</p>` : ''}<div class="toolbar"><button class="btn" type="button" data-act="end-study">Terminar por ahora</button><button class="btn primary" type="button" data-act="study-ahead">Estudiar ya</button></div></div>`;
    study.espera = setTimeout(nextCard, Math.min(espera + 500, 2147483000));
    guardarSesion();
    return;
  }
  study.terminada = true;
  borrarSesion();
  $('#studyStage').innerHTML = `<div class="card done"><div class="big">🎉</div><h3>¡Listo por hoy!</h3><p class="muted">${study.hechas ? `${study.hechas} tarjetas respondidas · ${pct}% de aciertos.` : 'No quedan tarjetas pendientes.'} Las próximas aparecerán justo cuando estés por olvidarlas.</p><button class="btn primary" type="button" data-act="end-study">Volver a mis mazos</button></div>`;
  $('#studyBar').style.width = '100%';
}

// Práctica libre de un tipo de respuesta (también con el tipo ya al día): mismo tope de 10 min por sesión
function renderBloqueExtra() {
  const pct = study.hechas ? Math.round(study.aciertos / study.hechas * 100) : 0;
  $('#studyBar').style.width = `${Math.min(100, study.hechas / Math.max(1, study.hechas + study.cola.length) * 100)}%`;
  $('#studyStage').innerHTML = `<div class="card done"><div class="big">⏱️</div><h3>¡Sesión de ${SESION_MAX_MS / 60000} minutos lista!</h3><p class="muted">${study.hechas} tarjetas respondidas · ${pct}% de aciertos. Lo que respondiste ya quedó guardado.</p><div class="toolbar"><button class="btn" type="button" data-act="end-study">Terminar</button><button class="btn primary" type="button" data-act="more-extra">Otros ${SESION_MAX_MS / 60000} min</button></div></div>`;
}

// Deja el mazo en el tipo de respuesta con que se empezó una sesión a medias (para poder retomarla)
async function fijarModo(id, v) {
  const m = S.mazos.get(id);
  if (m && v != null && (m.modo || 0) !== v) await save('mazos', [{ ...m, modo: v }]);
}

// Practicar de nuevo un tipo de respuesta del mazo, aunque ya esté al día (las respuestas cuentan en su repetición espaciada)
async function estudiarModo(i, practica) {
  const m = S.mazos.get(mazoAbierto);
  if (!m) return;
  if ((m.modo || 0) !== i) await save('mazos', [{ ...m, modo: i }]);
  if (practica) sesionAparte(m.id, shuffle(tarjetasModo(m.id, i).map(t => t.id)), 'extra', 'Práctica');
  else startStudy(m.id, { elegido: true });
}

// Cada sesión dura como máximo 10 minutos; para seguir se pide otra
function renderBloque() {
  const pct = study.hechas ? Math.round(study.aciertos / study.hechas * 100) : 0;
  const c = SRS.conteos(candSesion(study), Infinity);
  const quedan = c.nuevas + c.aprend + c.repaso;
  renderCounts(null);
  study.terminada = true;
  borrarSesion();
  $('#studyBar').style.width = '100%';
  if (!quedan) return renderFin();
  $('#studyStage').innerHTML = `<div class="card done"><div class="big">⏱️</div><h3>¡Sesión de ${SESION_MAX_MS / 60000} minutos lista!</h3><p class="muted">${study.hechas} tarjetas respondidas · ${pct}% de aciertos. Descansa un poco: lo que respondiste ya quedó guardado.</p><p>Aún quedan ${quedan} por estudiar hoy.</p><div class="toolbar"><button class="btn" type="button" data-act="end-study">Terminar por hoy</button><button class="btn primary" type="button" data-act="more-study">Otros ${SESION_MAX_MS / 60000} min</button></div></div>`;
}

// Estudiar ya las tarjetas en aprendizaje aunque no les toque todavía
function estudiarAdelantado() {
  const lista = candSesion(study).filter(SRS.enAprendizaje).sort((a, b) => a.vence - b.vence);
  if (!lista.length) return nextCard();
  clearTimeout(study.espera);
  mostrarTarjeta(S.tarjetas.get(lista[0].id), 'aprendiendo');
}

/* ---------- Ajustes ---------- */
function abrirAjustes() {
  $('#optVibrar').checked = ajustes.vibrar;
  $('#optSonido').checked = ajustes.sonido;
  const puede = !!navigator.vibrate;
  $('#optVibrar').disabled = !puede;
  $('#vibrarNota').textContent = puede ? 'El celular vibra al fallar (y suave al acertar).' : 'Este dispositivo no permite vibrar (PC o iPhone).';
  renderRegistro();
  $('#dlg-settings').showModal();
}

function renderRegistro() {
  const r = analizarRegistro();
  $('#regTotal').textContent = r.total ? `${r.total} respuestas desde ${new Date(r.desde).toLocaleDateString('es')}` : 'Vacío';
  if (!r.total) { $('#regTabla').innerHTML = '<p class="muted" style="font-size:.85rem">Aún no hay respuestas registradas.</p>'; return; }
  const pct = (v) => v == null ? '—' : `${Math.round(v * 100)}%`;
  $('#regTabla').innerHTML = `
    <div class="table-wrap"><table class="log-table">
      <thead><tr><th>Nota de la app</th><th>Veces</th><th>Tiempo / esperado</th><th>Acertó la vez siguiente</th></tr></thead>
      <tbody>${r.notas.map(n => `<tr><td><span class="auto-grade g${n.nota}" style="margin:0"><span class="badge">${NOTA_TXT[n.nota]}</span></span></td><td class="num">${n.n}</td><td class="num">${n.relacion == null ? '—' : `×${n.relacion.toLocaleString('es')}`}</td><td class="num">${pct(n.recuerdo)}${n.siguientes ? ` <span class="muted">(${n.siguientes})</span>` : ''}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="muted" style="font-size:.78rem;margin-top:6px">Aciertos totales: ${pct(r.aciertos / r.total)}. Lo ideal es que «Acertó la vez siguiente» quede cerca del 85–90 % en Bien y Fácil: si «Fácil» queda bastante más bajo, la app manda esas tarjetas demasiado lejos.</p>`;
}

$('#optVibrar').addEventListener('change', (e) => { ajustes.vibrar = e.target.checked; guardarAjustes(); if (ajustes.vibrar) vibrar(40); });
$('#optSonido').addEventListener('change', (e) => { ajustes.sonido = e.target.checked; guardarAjustes(); if (ajustes.sonido) sonarAcierto(); });

/* ---------- Acciones ---------- */
let armado = null;
function confirmarConBoton(btn, texto, fn) {
  if (armado === btn) { armado = null; fn(); return; }
  if (armado) { armado.classList.remove('armed'); armado.textContent = armado.dataset.txt; }
  armado = btn;
  btn.dataset.txt = btn.textContent;
  btn.classList.add('armed');
  btn.textContent = texto;
  setTimeout(() => { if (armado === btn) { btn.classList.remove('armed'); btn.textContent = btn.dataset.txt; armado = null; } }, 3500);
}

/* ---------- Siglas: al tocar una sigla subrayada se abre un globo con su significado; otro toque lo cierra ---------- */
let siglaAbierta = null;
function cerrarSigla() {
  const p = document.getElementById('siglaPop');
  if (p) p.remove();
  siglaAbierta = null;
}
function tocarSigla(el) {
  if (siglaAbierta === el) { cerrarSigla(); return; }
  cerrarSigla();
  const k = el.dataset.sigla;
  const sig = MazoMD.significado(k);
  if (!sig) return;
  const p = document.createElement('div');
  p.id = 'siglaPop';
  p.className = 'sigla-pop';
  p.setAttribute('role', 'tooltip');
  p.innerHTML = `<b>${esc(k)}</b> ${esc(sig)}`;
  document.body.appendChild(p);
  const r = el.getBoundingClientRect();
  const left = Math.max(8, Math.min(r.left, window.innerWidth - p.offsetWidth - 8));
  const abajo = r.bottom + 8 + p.offsetHeight <= window.innerHeight;
  p.style.left = `${left}px`;
  p.style.top = `${abajo ? r.bottom + 8 : Math.max(8, r.top - 8 - p.offsetHeight)}px`;
  siglaAbierta = el;
}
window.addEventListener('scroll', () => { if (siglaAbierta) cerrarSigla(); }, { passive: true });

document.addEventListener('click', (e) => {
  const sigla = e.target.closest('.sigla');
  if (sigla) { tocarSigla(sigla); return; }
  if (siglaAbierta) cerrarSigla();
  if (!e.target.closest('.bar-hit')) mostrarTip(null);
  const tab = e.target.closest('[data-tab]');
  if (tab) { go(tab.dataset.tab); return; }
  const g = e.target.closest('[data-go]');
  if (g) { go(g.dataset.go); return; }
  const open = e.target.closest('[data-open]');
  if (open) { go('mazo', { mazo: open.dataset.open }); return; }
  const rv = e.target.closest('[data-revisar]');
  if (rv) { go('revisar', { mazo: rv.dataset.revisar }); return; }
  const ver = e.target.closest('[data-ver]');
  if (ver) { verTarjeta(ver.dataset.ver); return; }
  const pr = e.target.closest('[data-probar]');
  if (pr) { probarTarjeta(pr.dataset.probar); return; }
  const pag = e.target.closest('[data-pag]');
  if (pag) { REV.pagina = +pag.dataset.pag; renderRevisarLista(); $('#v-revisar').scrollIntoView({ block: 'start' }); return; }
  if (e.target.closest('#verPrev') && verIdx > 0) { verTarjeta(REV.ids[verIdx - 1]); return; }
  if (e.target.closest('#verNext') && verIdx < REV.ids.length - 1) { verTarjeta(REV.ids[verIdx + 1]); return; }
  const fa = e.target.closest('[data-falladas]');
  if (fa) { repasarFalladas(fa.dataset.falladas); return; }
  const em = e.target.closest('[data-estudiar-modo]');
  if (em) { estudiarModo(+em.dataset.estudiarModo, false); return; }
  const pm = e.target.closest('[data-practica]');
  if (pm) { estudiarModo(+pm.dataset.practica, true); return; }
  const st = e.target.closest('[data-study]');
  if (st) {
    const md = st.dataset.modo;
    fijarModo(st.dataset.study, md === undefined ? null : +md).then(() => startStudy(st.dataset.study, { soloNuevas: !!st.dataset.nuevas }));
    return;
  }
  const opt = e.target.closest('[data-opt]');
  if (opt) { elegirOpcion(+opt.dataset.opt); return; }
  const im = e.target.closest('[data-imode]');
  if (im) { setImpMode(im.dataset.imode); return; }
  const close = e.target.closest('[data-close]');
  if (close) { close.closest('dialog').close(); return; }
  const act = e.target.closest('[data-act]');
  if (!act) return;
  const m = S.mazos.get(mazoAbierto);
  switch (act.dataset.act) {
    case 'import': abrirImportar(); break;
    case 'load-example': cargarEjemplo(act.dataset.ejemplo); break;
    case 'study-all': startStudy('*'); break;
    case 'end-study': salirDelEstudio(); break;
    case 'resume': { const s = sesionPendiente(); if (s) fijarModo(s.target, s.modo == null ? null : s.modo).then(() => startStudy(s.target, { elegido: true, soloNuevas: !!s.soloNuevas })); break; }
    case 'discard-session': borrarSesion(); toast('Sesión descartada: lo respondido ya quedó guardado'); render(); break;
    case 'study-ahead': estudiarAdelantado(); break;
    case 'more-extra': study.usado = 0; study.terminada = false; nextCard(); break;
    case 'more-study': { const t = study.target; const v = study.volverA; const o = { elegido: true, soloNuevas: !!study.soloNuevas, ids: study.ids }; study = null; startStudy(t, o); if (study) study.volverA = v; break; }
    case 'check': evaluar(); break;
    case 'dont-know': evaluar(true); break;
    case 'continue': continuar(); break;
    case 'settings': abrirAjustes(); break;
    case 'log-csv': descargar(`memospark-registro-${SRS.dayKey()}.csv`, registroCsv(), 'text/csv'); break;
    case 'log-json': descargar(`memospark-registro-${SRS.dayKey()}.json`, JSON.stringify([...S.registro.values()].sort((x, y) => x.ts - y.ts), null, 1), 'application/json'); break;
    case 'log-clear':
      confirmarConBoton(act, '¿Borrar? Toca otra vez', async () => {
        await save('registro', [], [...S.registro.keys()]);
        toast('Registro borrado'); renderRegistro();
      });
      break;
    case 'copy-prompt':
      // Desde Mazos o Importar el tema suele estar vacío: se copia con [TEMA] para completarlo en la IA
      copiar(promptActual(), $('#fTema').value.trim() ? 'Instrucciones copiadas: pégalas en tu IA' : 'Instrucciones copiadas: pégalas en tu IA y cambia [TEMA] por tu tema');
      break;
    case 'share-prompt': navigator.share({ title: 'Mazo para MemoSpark', text: promptActual() }).catch(() => {}); break;
    case 'download-format': descargar('FORMATO-MemoSpark.md', promptActual()); break;
    case 'export': if (m) descargar(`${slug(m.nombre)}.md`, MazoMD.serialize(m, tarjetasDe(m.id))); break;
    case 'copy-md': if (m) copiar(MazoMD.serialize(m, tarjetasDe(m.id)), 'Mazo copiado en formato .md'); break;
    case 'reset':
      if (m) confirmarConBoton(act, '¿Seguro? Toca otra vez', async () => {
        await save('progreso', [], tarjetasDe(m.id).flatMap(t => clavesProg(t.id)));
        toast('Progreso reiniciado'); render();
      });
      break;
    case 'delete':
      if (m) confirmarConBoton(act, '¿Eliminar? Toca otra vez', async () => {
        const ids = tarjetasDe(m.id).map(t => t.id);
        await save('progreso', [], ids.flatMap(clavesProg));
        await save('tarjetas', [], ids);
        await save('dias', [], [...S.dias.values()].filter(d => d.mazoId === m.id).map(d => d.id));
        await save('mazos', [], [m.id]);
        toast(`«${m.nombre}» eliminado`); go('mazos');
      });
      break;
  }
});

// Flechas para pasar de una tarjeta a otra en «Ver tarjeta»
document.addEventListener('keydown', (e) => {
  if (!$('#dlg-ver').open) return;
  if (e.key === 'ArrowLeft' && verIdx > 0) verTarjeta(REV.ids[verIdx - 1]);
  if (e.key === 'ArrowRight' && verIdx < REV.ids.length - 1) verTarjeta(REV.ids[verIdx + 1]);
});

document.addEventListener('keydown', (e) => {
  if (vista !== 'estudio' || !study || e.ctrlKey || e.metaKey || e.altKey) return;
  const inInput = !!(e.target.matches && e.target.matches('input, textarea'));
  const a = study.actual;
  if (!a) {
    if ((e.key === ' ' || e.key === 'Enter') && !inInput) { const b = $('#studyStage [data-act="end-study"]'); if (b && !$('#studyStage [data-act="study-ahead"], #studyStage [data-act="more-study"], #studyStage [data-act="more-extra"]')) { e.preventDefault(); b.click(); } }
    return;
  }
  if (!a.resultado) {
    if (a.modo === 'libre') {
      if (e.key === 'Enter') { e.preventDefault(); evaluar(); }
      return;
    }
    if (inInput) return;
    const k = e.key.toUpperCase();
    let i = LETRAS.indexOf(k);
    if (i < 0 && /^[1-9]$/.test(e.key)) i = +e.key - 1;
    if (i >= 0 && i < a.opciones.length) { e.preventDefault(); elegirOpcion(i); return; }
    if ((e.key === 'Enter' || e.key === ' ') && a.modo === 'multiple' && a.elegidas.size) { e.preventDefault(); evaluar(); }
    return;
  }
  if (inInput && e.key !== 'Enter') return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); continuar(); }
});

['fTema', 'fCantidad', 'fNivel', 'fExtra'].forEach(id => $(`#${id}`).addEventListener('input', renderFormato));
$('#impFiles').addEventListener('change', (e) => leerArchivos(e.target.files));
let impTimer = null;
$('#impText').addEventListener('input', () => { clearTimeout(impTimer); impTimer = setTimeout(() => analizar($('#impText').value), 250); });
$('#impConfirm').addEventListener('click', confirmarImportar);
const drop = $('#dropZone');
['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', (e) => { if (e.dataTransfer && e.dataTransfer.files.length) leerArchivos(e.dataTransfer.files); });

/* ---------- Arranque ---------- */
$('#appVersion').textContent = `v${APP_VERSION}`;
const verTxt = $('#appVersion');
verTxt.title = `MemoSpark versión ${APP_VERSION}`;

// Abrir un .md con la app instalada (PC con Chrome/Edge: «Abrir con» MemoSpark)
if ('launchQueue' in window && !IN_ZENBAN) {
  window.launchQueue.setConsumer(async (params) => {
    if (!params.files || !params.files.length) return;
    const files = await Promise.all(params.files.map(h => h.getFile()));
    abrirImportar();
    leerArchivos(files);
  });
}

// Dentro de ZenBan no hay service worker y GitHub Pages deja index.html 10 minutos en caché: tras publicar,
// el marco puede seguir con la versión anterior. Si la publicada es más nueva, se recarga con una dirección
// distinta (?v=N) que no está en caché. Solo una vez por versión, así no se repite en bucle.
function revisarVersionPublicada() {
  const propia = (($('script[src^="app.js"]') || {}).getAttribute?.('src') || '').match(/v=(\d+)/);
  if (!propia) return;
  fetch('index.html', { cache: 'no-cache' }).then(r => r.ok ? r.text() : '').then(html => {
    const publicada = (html.match(/app\.js\?v=(\d+)/) || [])[1];
    if (!publicada || publicada === propia[1]) return;
    if (new URLSearchParams(location.search).get('v') === publicada) return;
    if (pluginTimer) pluginSaveNow();
    location.replace(`index.html?v=${publicada}`);
  }).catch(() => {});
}

// ---------- estilo: ZenBan (su paleta) o propio (el violeta de MemoSpark); los dos siguen el tema claro / oscuro ----------
let temaHost = null;
function aplicarEstilo() {
  const r = document.documentElement, z = ajustes.estilo === 'zenban';
  r.dataset.estilo = z ? 'zenban' : 'propio';
  const sistema = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  // Dentro de ZenBan solo el estilo de ZenBan sigue su tema; el propio es el claro de siempre (como TablaQuiz)
  r.dataset.theme = IN_ZENBAN ? (z ? (temaHost || sistema) : 'light') : sistema;
  const label = z ? '🎨 ZenBan' : '🎨 Propio';
  const title = z ? 'Estilo de ZenBan. Toca para usar el estilo propio de MemoSpark' : 'Estilo propio de MemoSpark. Toca para usar el de ZenBan';
  const b = $('#estiloBtn'); b.textContent = label; b.title = title;
  if (IN_ZENBAN && ZenBanPlugin.setBarButton) ZenBanPlugin.setBarButton(label, title); // también en la barra de la ventana, junto a ⟳
}
function cambiarEstilo() {
  ajustes.estilo = ajustes.estilo === 'zenban' ? 'propio' : 'zenban';
  aplicarEstilo();
  guardarAjustes();
  if (IN_ZENBAN) { clearTimeout(pluginTimer); pluginTimer = setTimeout(pluginSaveNow, 0); }
}
$('#estiloBtn').onclick = cambiarEstilo;
if (IN_ZENBAN && ZenBanPlugin.onBarClick) ZenBanPlugin.onBarClick(cambiarEstilo);
if (!IN_ZENBAN) matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', aplicarEstilo);
aplicarEstilo();

if (IN_ZENBAN) {
  document.body.classList.add('in-zenban');
  revisarVersionPublicada();
  ZenBanPlugin.onInit(({ state, theme, readOnly: ro }) => {
    readOnly = !!ro;
    $('#readonlyBar').hidden = !readOnly;
    if (theme) temaHost = theme === 'light' ? 'light' : 'dark';
    if (state && state.ajustes && (state.ajustes.estilo === 'zenban' || state.ajustes.estilo === 'propio')) ajustes.estilo = state.ajustes.estilo;
    aplicarEstilo();
    // Si estoy en medio de una tarjeta, solo se actualizan los datos (no se interrumpe)
    STORES.forEach(s => { S[s] = new Map(((state && state[s]) || []).map(r => [r.id, r])); });
    if (vista !== 'estudio') sesionGuardada = (state && state.sesion) || null;
    pluginReady = true;
    if (vista !== 'estudio') render();
    actualizarEjemplos();
  });
  // Si ZenBan no contesta (por ejemplo, página abierta en una ventana web vieja), igual se puede usar
  setTimeout(() => { if (!pluginReady) { pluginReady = true; render(); } }, 5000);
  window.addEventListener('pagehide', () => { if (pluginTimer) pluginSaveNow(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && pluginTimer) pluginSaveNow(); });
  render();
} else {
  (async () => {
    try { db = await openDb(); await window.refreshFromDb(); await actualizarEjemplos(); }
    catch (e) { console.warn('IndexedDB', e); render(); toast('Este navegador no permite guardar datos: lo que hagas no se conservará'); }
    try { startSync(); } catch (e) { console.warn('Sync', e); }
    if (db && typeof syncEnabled === 'function' && syncEnabled()) setTimeout(() => { if (SYNC.token) syncNow(); }, 800);
  })();
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW', err)); });
  }
}

/* ---------- Botón Instalar (PC y celular) ---------- */
let installEvt = null;
const installBtn = $('#installBtn');
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (!IN_ZENBAN && !isStandalone() && isIOS) installBtn.hidden = false;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!isStandalone() && !IN_ZENBAN) installBtn.hidden = false; });
window.addEventListener('appinstalled', () => { installEvt = null; installBtn.hidden = true; toast('MemoSpark instalada'); });
installBtn.addEventListener('click', async () => {
  if (installEvt) {
    installEvt.prompt();
    const { outcome } = await installEvt.userChoice;
    installEvt = null;
    if (outcome === 'accepted') installBtn.hidden = true;
    return;
  }
  $('#install-help').innerHTML = isIOS
    ? '<p>En Safari, toca el botón <b>Compartir</b> y luego <b>Agregar a pantalla de inicio</b>.</p>'
    : '<p>En Chrome o Edge, abre el menú <b>⋮</b> y elige <b>Instalar app</b> o <b>Agregar a pantalla de inicio</b>.</p>';
  $('#dlg-install').showModal();
});
