// ===== MemoSpark - Pruebas: alternativas con tiempo, notas y estadísticas =====
// Una «prueba» es un tipo de prueba (Matemática, Inglés…) con sus preguntas de alternativas. Cada vez que se rinde queda
// un «intento» con una copia de las preguntas tal como se vieron, las respuestas, la nota y la fecha, así se puede abrir
// de nuevo con lo bueno en verde y lo malo en rojo aunque después se vuelva a importar la prueba.
// Se carga después de app.js y usa sus funciones (S, save, go, $, esc, toast, shuffle, copiar, confirmarConBoton…).

/* ---------- Lectura del .md de una prueba ---------- */
const PruebaMD = (() => {
  const normN = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  const TEMA_RE = /^\s*\*{0,2}Tema\*{0,2}\s*:\s*\*{0,2}\s*(.*)$/i;
  const REF_RE = /^\s*\*{0,2}(?:Referencia|D[oó]nde repasar|Repasar en|Fuente)\*{0,2}\s*:\s*\*{0,2}\s*(.*)$/i;
  const EXP_RE = /^\s*\*{0,2}Explicaci[oó]n\*{0,2}\s*:\s*\*{0,2}\s*/i;
  const TIEMPO_RE = /^\s*\*{0,2}Tiempo\*{0,2}\s*:\s*\*{0,2}\s*(\d+(?:[.,]\d+)?)\s*(?:min\w*|m\b)?\s*\*{0,2}\s*$/i;

  const esPrueba = (texto) => /^#\s+Prueba\s*:/im.test(String(texto || ''));

  function meta(expl) {
    const out = { tema: '', ref: '', exp: [] };
    String(expl || '').split('\n').forEach(l => {
      let m;
      if ((m = l.match(TEMA_RE))) out.tema = m[1].trim();
      else if ((m = l.match(REF_RE))) out.ref = m[1].trim();
      else out.exp.push(l.replace(EXP_RE, ''));
    });
    return { tema: out.tema, ref: out.ref, explicacion: out.exp.join('\n').trim() };
  }

  // Devuelve { pruebas: [{ id, nombre, descripcion, minutos, preguntas }], avisos }
  function parse(texto) {
    const res = MazoMD.parse(texto);
    const avisos = [...res.avisos];
    const pruebas = res.mazos.map(m => {
      const nombre = m.nombre.replace(/^Prueba\s*:\s*/i, '').trim() || 'Prueba';
      let minutos = 0;
      const desc = String(m.descripcion || '').split('\n').filter(l => {
        const t = l.match(TIEMPO_RE);
        if (t) { minutos = Math.round(parseFloat(t[1].replace(',', '.'))); return false; }
        return true;
      }).join('\n').trim();
      const preguntas = [];
      m.tarjetas.forEach(t => {
        if (!t.opciones.length) { avisos.push(`«${t.pregunta.split('\n')[0].slice(0, 60)}» no tiene alternativas, se omitió.`); return; }
        const x = meta(t.explicacion);
        preguntas.push({ id: t.id, enunciado: t.pregunta, opciones: t.opciones.map(o => ({ t: o.t, ok: o.ok })), explicacion: x.explicacion, tema: x.tema, ref: x.ref });
      });
      // El tiempo sale del temario: sin «Tiempo: N min» no se inventa uno
      if (!minutos && preguntas.length) { avisos.push(`«${nombre}» no tiene la línea «Tiempo: N min» bajo el título, no se importó.`); return null; }
      return { id: 'p' + MazoMD.hash('prueba|' + normN(nombre)), nombre, descripcion: desc, minutos, preguntas };
    }).filter(p => p && p.preguntas.length);
    return { pruebas, avisos };
  }
  return { esPrueba, parse };
})();

/* ---------- Estado y utilidades ---------- */
const PR = { enCurso: null, idx: 0, timer: null, intento: null, filtro: 'todas', statsSel: null, iniciar: null };
const ENCURSO_KEY = 'memospark_prueba_en_curso';
const EXIGENCIA = 0.6; // nota 4,0 con el 60 % de las preguntas buenas (escala 1 a 7)
let statsTab = 'tarjetas';

try { PR.enCurso = JSON.parse(localStorage.getItem(ENCURSO_KEY) || 'null'); } catch (e) {}
// Al reabrir la app el tiempo de la prueba siguió corriendo, pero el rato con la app cerrada no se cuenta a ninguna pregunta
if (PR.enCurso) { PR.idx = PR.enCurso.idx || 0; PR.enCurso.qDesde = Date.now(); }

const pruebasOrdenadas = () => [...S.pruebas.values()].sort((a, b) => (a.creado || 0) - (b.creado || 0));
const intentosDe = (pruebaId) => [...S.intentos.values()].filter(i => !pruebaId || i.pruebaId === pruebaId).sort((a, b) => a.ts - b.ts);

function notaDe(buenas, total) {
  if (!total) return 1;
  const p = buenas / total;
  const n = p >= EXIGENCIA ? 4 + 3 * (p - EXIGENCIA) / (1 - EXIGENCIA) : 1 + 3 * p / EXIGENCIA;
  return Math.round(n * 10) / 10;
}
const fmtNota = (n) => n == null ? '—' : Number(n).toLocaleString('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const colorNota = (n) => n >= 4 ? 'var(--good)' : 'var(--bad)';
function fmtTiempo(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), seg = s % 60;
  const dos = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${dos(m)}:${dos(seg)}` : `${dos(m)}:${dos(seg)}`;
}
const fmtFecha = (ts) => new Date(ts).toLocaleString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/\./g, '');
const primeraLinea = (md) => String(md || '').split('\n')[0];
const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;

// «Referencia»: texto con enlaces (los de YouTube con ?t= llevan al minuto)
function refHtml(ref) {
  if (!ref) return '';
  const md = String(ref).replace(/(^|[\s(])(https?:\/\/[^\s)]+)/g, (_, pre, url) => `${pre}[abrir enlace ↗](${url})`);
  return MazoMD.inline(md, {}, { siglas: false });
}

/* ---------- Guardar pruebas importadas ---------- */
async function guardarPruebas(pruebas) {
  const now = Date.now();
  let total = 0;
  for (const p of pruebas) {
    const ex = S.pruebas.get(p.id);
    await save('pruebas', [{ ...(ex || { creado: now }), id: p.id, nombre: p.nombre, descripcion: reemplazarImagenes(p.descripcion), minutos: p.minutos,
      preguntas: p.preguntas.map(q => ({ ...q, enunciado: reemplazarImagenes(q.enunciado), opciones: q.opciones.map(o => ({ t: reemplazarImagenes(o.t), ok: o.ok })), explicacion: reemplazarImagenes(q.explicacion) })) }]);
    total += p.preguntas.length;
  }
  return total;
}

// Vista previa dentro del diálogo de importar (la llama analizar() de app.js)
function analizarPrueba(texto) {
  const res = PruebaMD.parse(texto);
  impParsed = { mazos: [], pruebas: res.pruebas, avisos: res.avisos };
  const prev = $('#impPreview');
  if (!res.pruebas.length) {
    prev.innerHTML = `<div class="imp-err">No se encontró ninguna pregunta. Revisa que el texto siga el formato de pruebas (pestaña <b>Pruebas</b> → «Pedirle una prueba a la IA»).${res.avisos.length ? `<ul>${res.avisos.slice(0, 8).map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}</div>`;
    $('#impConfirm').disabled = true;
    return;
  }
  const decks = res.pruebas.map(p => {
    const ex = S.pruebas.get(p.id);
    const sinRef = p.preguntas.filter(q => !q.ref).length;
    return `<div class="imp-deck"><b>📝 ${esc(p.nombre)}</b><span class="muted" style="font-size:.85rem">${plural(p.preguntas.length, 'pregunta', 'preguntas')} · ${p.minutos} min${ex ? ' · ya existe: se actualiza (tus pruebas rendidas se conservan)' : ''}${sinRef ? ` · ${sinRef} sin «Referencia»` : ''}</span></div>`;
  }).join('');
  const avisos = res.avisos;
  prev.innerHTML = decks + (avisos.length ? `<div class="imp-warn"><b>Revisa:</b><ul>${avisos.slice(0, 12).map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : '');
  $('#impConfirm').disabled = false;
}

/* ---------- Prompt para la IA ---------- */
function promptPrueba() {
  const v = (id, d) => ($(`#${id}`).value || '').trim() || d;
  return window.MEMOSPARK_PRUEBA
    .replace('[ASIGNATURA]', () => v('pTema', '[Escribe aquí la asignatura y curso, ej: Matemáticas 8° Básico / Ciencias Naturales 1° Medio]'))
    .replace('[MATERIAL]', () => v('pMaterial', 'el temario oficial y los videos/materiales cargados en el cuaderno'))
    + (v('pExtra', '') ? `\n\nIndicaciones extra: ${v('pExtra', '')}` : '');
}

/* ---------- Vista: Pruebas (menú) ---------- */
function renderPruebas() {
  const pruebas = pruebasOrdenadas();
  $('#promptPrueba').textContent = promptPrueba();
  const en = PR.enCurso;
  const reanudar = en ? `
    <div class="resume">
      <div class="grow"><b>Tienes una prueba en curso</b><span>${esc(en.nombre)} · el tiempo sigue corriendo <b class="queda" id="pruebaQueda">${fmtTiempo(en.inicio + en.limiteMs - Date.now())}</b></span></div>
      <button class="btn primary" type="button" data-pr="volver">Volver a la prueba ▶</button>
    </div>` : '';
  const tarjetas = pruebas.map(p => {
    const its = intentosDe(p.id);
    const ult = its[its.length - 1];
    return `
      <article class="deck">
        <div>
          <div class="deck-top"><span class="deck-name" style="cursor:default">📝 ${esc(p.nombre)}</span></div>
          ${p.descripcion ? `<div class="deck-desc">${esc(p.descripcion.replace(/[#*_`>!\[\]()]/g, ''))}</div>` : ''}
        </div>
        <div class="deck-counts">
          <span class="chip">${plural(p.preguntas.length, 'pregunta', 'preguntas')}</span>
          <span class="chip">⏱ ${p.minutos} min</span>
          <span class="chip">${its.length ? `${plural(its.length, 'rendida', 'rendidas')}` : 'sin rendir'}</span>
        </div>
        <div class="muted" style="font-size:.82rem">${ult ? `Última nota: <b style="color:${colorNota(ult.nota)}">${fmtNota(ult.nota)}</b> · ${esc(fmtFecha(ult.ts))}` : 'Aún no la has rendido'}</div>
        <div class="deck-foot">
          <button class="btn ghost sm" type="button" data-pr="stats" data-id="${esc(p.id)}" ${its.length ? '' : 'disabled'}>Estadísticas</button>
          ${esAlumno() ? '' : `<button class="btn ghost sm danger" type="button" data-pr="borrar" data-id="${esc(p.id)}" ${readOnly ? 'disabled' : ''}>Eliminar</button>`}
          <span class="grow"></span>
          <button class="btn primary" type="button" data-pr="rendir" data-id="${esc(p.id)}" ${en ? 'disabled title="Termina primero la prueba en curso"' : ''}>Rendir</button>
        </div>
      </article>`;
  }).join('');
  $('#pruebas-body').innerHTML = reanudar + (pruebas.length
    ? `<div class="decks">${tarjetas}</div>`
    : `<div class="empty"><div style="font-size:2.6rem">📝</div><h3>Aún no tienes pruebas</h3><p>${esAlumno() ? 'Tu profe aún no ha cargado pruebas aquí. Cuando las cargue las rindes con un temporizador que no se puede pausar y después ves tu nota, el tiempo en cada pregunta y dónde repasar.' : 'Pídele a una IA una prueba con el formato de MemoSpark (abajo) e impórtala. La rindes con un temporizador que no se puede pausar, como una prueba real, y después ves tu nota y dónde repasar lo que fallaste.'}</p></div>`);
}

/* ---------- Rendir una prueba ---------- */
function guardarEnCurso() {
  try { if (PR.enCurso) localStorage.setItem(ENCURSO_KEY, JSON.stringify(PR.enCurso)); else localStorage.removeItem(ENCURSO_KEY); } catch (e) {}
}

function pedirInicio(id) {
  const p = S.pruebas.get(id);
  if (!p || PR.enCurso) return;
  PR.iniciar = id;
  $('#iniciarPrueba').innerHTML = `<b>${esc(p.nombre)}</b>: ${plural(p.preguntas.length, 'pregunta', 'preguntas')} de alternativas en <b>${p.minutos} minutos</b>.<br><br>Al empezar corre el tiempo y <b>no se puede pausar</b>, ni siquiera si cierras la app. Puedes ir y volver entre las preguntas y cambiar tus respuestas hasta entregar o hasta que se acabe el tiempo.`;
  $('#dlg-prueba').showModal();
}

function iniciarPrueba() {
  const p = S.pruebas.get(PR.iniciar);
  $('#dlg-prueba').close();
  if (!p || PR.enCurso) return;
  PR.enCurso = {
    pruebaId: p.id, nombre: p.nombre, inicio: Date.now(), limiteMs: p.minutos * 60000, resp: {}, t: {}, idx: 0, qDesde: Date.now(),
    preguntas: p.preguntas.map(q => ({ id: q.id, enunciado: q.enunciado, explicacion: q.explicacion || '', tema: q.tema || '', ref: q.ref || '', opciones: shuffle(q.opciones.map(o => ({ t: o.t, ok: o.ok }))) }))
  };
  PR.idx = 0;
  guardarEnCurso();
  asegurarReloj();
  go('rendir');
}

function asegurarReloj() {
  if (PR.enCurso && !PR.timer) PR.timer = setInterval(tick, 500);
  if (!PR.enCurso && PR.timer) { clearInterval(PR.timer); PR.timer = null; }
  if (PR.enCurso) tick();
}
function tick() {
  const e = PR.enCurso;
  if (!e) { asegurarReloj(); return; }
  const resta = e.inicio + e.limiteMs - Date.now();
  if (resta <= 0) { entregarPrueba(true); return; }
  const t = $('#rtTime');
  if (t && vista === 'rendir') {
    t.textContent = fmtTiempo(resta);
    t.closest('.rt-bar').dataset.alerta = resta < 60000 ? '2' : resta < 5 * 60000 ? '1' : '0';
    $('#rtProg').style.width = `${Math.min(100, (1 - resta / e.limiteMs) * 100)}%`;
  }
  const q = $('#pruebaQueda');
  if (q) q.textContent = fmtTiempo(resta);
}

// Tiempo en cada pregunta: lo que pasa desde que se abrió la pregunta actual se le suma a ella al cambiar de pregunta o entregar
function cerrarTramo() {
  const e = PR.enCurso;
  if (!e) return;
  const now = Date.now(), q = e.preguntas[PR.idx];
  if (q) { e.t = e.t || {}; e.t[q.id] = (e.t[q.id] || 0) + Math.max(0, now - (e.qDesde || now)); }
  e.qDesde = now;
}
function irAPregunta(i) {
  const e = PR.enCurso;
  if (!e) return;
  cerrarTramo();
  PR.idx = Math.min(Math.max(0, i), e.preguntas.length - 1);
  e.idx = PR.idx;
  guardarEnCurso();
  pintarPregunta();
}

const respondidas = (e) => e.preguntas.filter(q => (e.resp[q.id] || []).length).length;

function renderRendir() {
  const e = PR.enCurso;
  if (!e) { go('pruebas'); return; }
  PR.idx = Math.min(Math.max(0, PR.idx), e.preguntas.length - 1);
  const resta = e.inicio + e.limiteMs - Date.now();
  $('#rendir-body').innerHTML = `
    <div class="rt-bar" data-alerta="${resta < 60000 ? 2 : resta < 5 * 60000 ? 1 : 0}">
      <div class="rt-nombre">${esc(e.nombre)}<small class="muted" id="rtResp"></small></div>
      <div class="rt-time" id="rtTime" role="timer" aria-label="Tiempo restante">${fmtTiempo(resta)}</div>
      <button class="btn primary" type="button" data-pr="entregar">Entregar</button>
    </div>
    <div class="progress-line"><i id="rtProg" style="width:${Math.min(100, (1 - resta / e.limiteMs) * 100)}%"></i></div>
    <p class="muted rt-aviso">⏱ El tiempo no se puede pausar. Puedes pasar a cualquier pregunta y volver; entrega cuando termines.</p>
    <div class="rt-nav" id="rtNav"></div>
    <div id="rtQ"></div>
    <div class="rt-foot">
      <button class="btn" type="button" data-pr="ant">‹ Anterior</button>
      <span class="grow"></span>
      <button class="btn" type="button" data-pr="sig">Siguiente ›</button>
    </div>`;
  pintarPregunta();
}

function pintarPregunta() {
  const e = PR.enCurso;
  if (!e) return;
  const q = e.preguntas[PR.idx];
  const sel = new Set(e.resp[q.id] || []);
  const multi = q.opciones.filter(o => o.ok).length > 1;
  $('#rtNav').innerHTML = e.preguntas.map((p, i) => `<button type="button" class="rt-n${(e.resp[p.id] || []).length ? ' hecha' : ''}${i === PR.idx ? ' actual' : ''}" data-pr="ir" data-i="${i}" aria-label="Pregunta ${i + 1}${(e.resp[p.id] || []).length ? ' respondida' : ''}">${i + 1}</button>`).join('');
  $('#rtResp').textContent = ` · ${respondidas(e)} de ${e.preguntas.length} respondidas`;
  $('#rtQ').innerHTML = `
    <div class="card rt-q">
      <div class="face-tag"><span class="chip">Pregunta ${PR.idx + 1} de ${e.preguntas.length}</span>${multi ? '<span class="chip">Marca todas las correctas</span>' : ''}</div>
      <div class="qtext">${MazoMD.render(q.enunciado, {}, { siglas: false })}</div>
      <div class="opts">${q.opciones.map((o, i) => `
        <button type="button" class="opt" data-pr="opt" data-i="${i}" aria-pressed="${sel.has(i)}"><span class="k">${LETRAS[i]}</span><span class="t">${MazoMD.inline(o.t, {}, { siglas: false })}</span></button>`).join('')}
      </div>
    </div>`;
  const ant = $('[data-pr="ant"]'), sig = $('[data-pr="sig"]');
  if (ant) ant.disabled = PR.idx === 0;
  if (sig) sig.disabled = PR.idx === e.preguntas.length - 1;
}

function elegirRespuesta(i) {
  const e = PR.enCurso;
  if (!e) return;
  const q = e.preguntas[PR.idx];
  const multi = q.opciones.filter(o => o.ok).length > 1;
  const sel = new Set(e.resp[q.id] || []);
  if (sel.has(i)) sel.delete(i); // tocar de nuevo la alternativa elegida la quita
  else { if (!multi) sel.clear(); sel.add(i); }
  e.resp[q.id] = [...sel];
  guardarEnCurso();
  pintarPregunta();
}

function entregarPrueba(agotado) {
  const e = PR.enCurso;
  if (!e) return;
  cerrarTramo();
  const now = Date.now();
  let buenas = 0, malas = 0, blancas = 0;
  const preguntas = e.preguntas.map(q => {
    const sel = new Set(e.resp[q.id] || []);
    const estado = !sel.size ? 'blanco' : q.opciones.every((o, i) => o.ok === sel.has(i)) ? 'ok' : 'mal';
    if (estado === 'ok') buenas++; else if (estado === 'mal') malas++; else blancas++;
    return { id: q.id, enunciado: q.enunciado, explicacion: q.explicacion, tema: q.tema, ref: q.ref, estado, ms: (e.t && e.t[q.id]) || 0, opciones: q.opciones.map((o, i) => ({ t: o.t, ok: o.ok, sel: sel.has(i) })) };
  });
  const total = preguntas.length;
  const intento = {
    id: 'i' + now.toString(36) + Math.random().toString(36).slice(2, 6), pruebaId: e.pruebaId, nombre: e.nombre,
    ts: now, inicio: e.inicio, limiteMs: e.limiteMs, usadoMs: Math.min(now - e.inicio, e.limiteMs), agotado: !!agotado,
    buenas, malas, blancas, total, nota: notaDe(buenas, total), preguntas
  };
  PR.enCurso = null;
  guardarEnCurso();
  asegurarReloj();
  save('intentos', [intento]);
  PR.intento = intento.id;
  PR.filtro = 'todas';
  PR.volverA = 'lista';
  if (agotado) toast('Se acabó el tiempo: la prueba se entregó sola');
  go('intento');
}

/* ---------- Resultado de una prueba rendida (también al abrirla de nuevo desde las estadísticas) ---------- */
const ESTADO = { ok: ['Correcta', 'good'], mal: ['Incorrecta', 'bad'], blanco: ['Sin responder', 'muted'] };

function filaRepasar(q, n) {
  const correctas = q.opciones.filter(o => o.ok).map(o => MazoMD.inline(o.t, {}, { siglas: false })).join(' · ');
  return `<tr>
    <td class="num">${n}</td>
    <td class="rep-q"><span>${MazoMD.inline(primeraLinea(q.enunciado), {}, { siglas: false })}</span></td>
    <td class="rep-a">${correctas}</td>
    <td>${q.tema ? esc(q.tema) : '<span class="muted">—</span>'}</td>
    <td class="rep-r">${q.ref ? refHtml(q.ref) : '<span class="muted">Sin referencia</span>'}</td>
  </tr>`;
}

function barraTemas(filas) {
  // filas: [{ tema, ok, mal }] ordenadas por más errores
  return `<div class="tema-bars">${filas.map(f => {
    const t = f.ok + f.mal;
    return `<div class="tema-row"><span class="tema-n">${esc(f.tema)}</span>
      <div class="meter tema-m" title="${f.ok} bien · ${f.mal} mal"><i style="width:${(f.ok / t * 100).toFixed(1)}%;background:var(--good)"></i><i style="width:${(f.mal / t * 100).toFixed(1)}%;background:var(--bad)"></i></div>
      <span class="muted tema-c">${f.mal} de ${t} mal</span></div>`;
  }).join('')}</div>`;
}

// Preguntas ordenadas de la que más tiempo tomó a la que menos. filas: [{ n, q, ms, det }]
function tablaTiempos(filas, colTiempo) {
  const max = Math.max(...filas.map(f => f.ms), 1);
  return `<div class="table-wrap"><table class="log-table rep-table">
    <thead><tr><th>N.º</th><th>Pregunta</th><th>${colTiempo}</th><th>Resultado</th></tr></thead>
    <tbody>${filas.map(f => `<tr>
      <td class="num">${f.n}</td>
      <td class="rep-q"><span>${MazoMD.inline(primeraLinea(f.q.enunciado), {}, { siglas: false })}</span></td>
      <td style="white-space:nowrap"><b>${fmtTiempo(f.ms)}</b><div class="meter" style="height:6px;margin-top:4px;min-width:70px"><i style="width:${(f.ms / max * 100).toFixed(1)}%;background:var(--accent)"></i></div></td>
      <td style="white-space:nowrap">${f.det}</td></tr>`).join('')}</tbody></table></div>`;
}
const detEstado = (e) => { const [txt, c] = ESTADO[e]; return `<span class="chip st-${c}">${txt}</span>`; };

function renderIntento() {
  const it = S.intentos.get(PR.intento);
  if (!it) { go('pruebas'); return; }
  const malas = it.preguntas.map((q, i) => ({ q, n: i + 1 })).filter(x => x.q.estado !== 'ok');
  const pct = Math.round(it.buenas / it.total * 100);
  const temas = {};
  it.preguntas.forEach(q => { if (!q.tema) return; const t = temas[q.tema] || (temas[q.tema] = { tema: q.tema, ok: 0, mal: 0 }); if (q.estado === 'ok') t.ok++; else t.mal++; });
  const filasTemas = Object.values(temas).sort((a, b) => b.mal - a.mal || b.ok - a.ok);
  const lista = it.preguntas.map((q, i) => ({ q, n: i + 1 })).filter(x => PR.filtro === 'todas' || x.q.estado !== 'ok');
  const conTiempo = it.preguntas.some(q => q.ms > 0); // los intentos anteriores a medir el tiempo no lo tienen
  $('#intento-body').innerHTML = `
    <div class="toolbar"><button class="btn ghost sm" type="button" data-pr="${PR.volverA === 'stats' ? 'stats-lista' : 'lista'}">← ${PR.volverA === 'stats' ? 'Estadísticas' : 'Pruebas'}</button></div>
    <div class="head-row">
      <div><div class="eyebrow">${esc(it.nombre)} · ${esc(fmtFecha(it.ts))}</div><h2>Resultado de la prueba</h2></div>
      <div class="toolbar">
        <button class="btn" type="button" data-pr="rendir" data-id="${esc(it.pruebaId)}" ${S.pruebas.has(it.pruebaId) && !PR.enCurso ? '' : 'disabled'}>Rendirla otra vez</button>
        ${esAlumno() ? '' : `<button class="btn danger" type="button" data-pr="borrar-intento" data-id="${esc(it.id)}" ${readOnly ? 'disabled' : ''}>Eliminar este intento</button>`}
      </div>
    </div>
    ${it.agotado ? '<div class="imp-warn" style="margin:0">⏱ Se acabó el tiempo y la prueba se entregó sola con lo que estaba respondido.</div>' : ''}
    <div class="today">
      <div class="stat nota"><div class="v" style="color:${colorNota(it.nota)}">${fmtNota(it.nota)}</div><div class="l">Nota (escala 1 a 7 · 4,0 con ${Math.round(EXIGENCIA * 100)}%)</div></div>
      <div class="stat"><div class="v">${it.buenas}<small class="muted" style="font-size:1rem"> / ${it.total}</small></div><div class="l">Correctas · ${pct}%</div></div>
      <div class="stat"><div class="v">${fmtTiempo(it.usadoMs)}</div><div class="l">Tiempo usado de ${fmtTiempo(it.limiteMs)}</div></div>
      <div class="stat"><div class="v">${it.malas}<small class="muted" style="font-size:1rem"> + ${it.blancas}</small></div><div class="l">Incorrectas + sin responder</div></div>
    </div>
    <div class="card">
      <div class="card-h"><h3>Mapa de preguntas</h3><span class="chip">${esc(fmtFecha(it.ts))}</span></div>
      <div class="meter" style="height:12px;margin-bottom:12px"><i style="width:${it.buenas / it.total * 100}%;background:var(--good)"></i><i style="width:${it.malas / it.total * 100}%;background:var(--bad)"></i><i style="width:${it.blancas / it.total * 100}%;background:var(--line)"></i></div>
      <div class="rt-nav">${it.preguntas.map((q, i) => `<button type="button" class="rt-n ${q.estado}" data-pr="ir-q" data-i="${i}" title="${esc(ESTADO[q.estado][0])}">${i + 1}</button>`).join('')}</div>
      <p class="muted" style="font-size:.8rem;margin-top:8px"><span class="dot good"></span>correcta <span class="dot bad"></span>incorrecta <span class="dot blanco"></span>sin responder · toca una para verla abajo</p>
    </div>
    ${malas.length ? `<div class="card">
      <div class="card-h"><h3>Para repasar</h3><span class="chip">${plural(malas.length, 'pregunta', 'preguntas')}</span></div>
      <p class="muted" style="font-size:.84rem;margin:-4px 0 10px">Lo que fallaste o dejaste en blanco, con la respuesta correcta y dónde encontrarla en el material.</p>
      <div class="table-wrap"><table class="log-table rep-table">
        <thead><tr><th>N.º</th><th>Pregunta</th><th>Respuesta correcta</th><th>Tema</th><th>Dónde repasar</th></tr></thead>
        <tbody>${malas.map(x => filaRepasar(x.q, x.n)).join('')}</tbody>
      </table></div></div>` : '<div class="card"><div class="chart-empty" style="height:90px">¡Sin errores! Todas correctas 🎯</div></div>'}
    ${filasTemas.length ? `<div class="card"><div class="card-h"><h3>Resultado por tema</h3></div>${barraTemas(filasTemas)}</div>` : ''}
    ${conTiempo ? `<div class="card">
      <div class="card-h"><h3>Tiempo por pregunta</h3><span class="chip">De la más lenta a la más rápida</span></div>
      <p class="muted" style="font-size:.84rem;margin:-4px 0 10px">Cuánto estuviste en cada pregunta. Las primeras son las que más te costaron.</p>
      ${tablaTiempos(it.preguntas.map((q, i) => ({ n: i + 1, q, ms: q.ms || 0, det: detEstado(q.estado) })).sort((a, b) => b.ms - a.ms), 'Tiempo')}</div>` : ''}
    <div class="card">
      <div class="card-h"><h3>Revisión pregunta por pregunta</h3>
        <div class="seg"><button type="button" data-pr="filtro" data-f="todas" aria-selected="${PR.filtro === 'todas'}">Todas</button><button type="button" data-pr="filtro" data-f="falladas" aria-selected="${PR.filtro !== 'todas'}">Falladas (${malas.length})</button></div>
      </div>
      <div class="rev-list">${lista.map(({ q, n }) => {
        const [txt, c] = ESTADO[q.estado];
        return `<article class="rev-q ${q.estado}" id="rq${n - 1}">
          <div class="face-tag"><span class="chip">Pregunta ${n}</span><span class="chip st-${c}">${txt}</span>${conTiempo ? `<span class="chip">⏱ ${fmtTiempo(q.ms || 0)}</span>` : ''}</div>
          <div class="qtext">${MazoMD.render(q.enunciado, {}, { siglas: false })}</div>
          <div class="opts">${q.opciones.map((o, i) => {
            const c2 = o.ok ? 'is-ok' : o.sel ? 'is-bad' : '';
            const tag = o.sel && o.ok ? 'tu respuesta ✓' : o.sel ? 'tu respuesta ✗' : o.ok ? 'respuesta correcta' : '';
            return `<div class="opt static ${c2}"><span class="k">${LETRAS[i]}</span><span class="t">${MazoMD.inline(o.t, {}, { siglas: false })}</span>${tag ? `<span class="opt-tag">${tag}</span>` : ''}</div>`;
          }).join('')}</div>
          ${q.explicacion ? `<div class="explain"><div class="l">Explicación</div><div class="md">${MazoMD.render(q.explicacion, {}, { siglas: false })}</div></div>` : ''}
          ${q.tema || q.ref ? `<div class="rev-meta">${q.tema ? `<span><b>Tema:</b> ${esc(q.tema)}</span>` : ''}${q.ref ? `<span><b>Dónde repasar:</b> ${refHtml(q.ref)}</span>` : ''}</div>` : ''}
        </article>`;
      }).join('') || '<div class="chart-empty" style="height:90px">No hay preguntas falladas 🎯</div>'}</div>
    </div>`;
}

/* ---------- Estadísticas de pruebas (se ven desde la pestaña Estadísticas) ---------- */
function renderStatsSeg() {
  if (esAlumno()) { statsTab = 'pruebas'; $('#stats-seg').innerHTML = ''; return; } // el alumno solo tiene estadísticas de pruebas
  $('#stats-seg').innerHTML = `<div class="seg" role="tablist" aria-label="Tipo de estadísticas">
    <button type="button" data-statstab="tarjetas" aria-selected="${statsTab === 'tarjetas'}">Tarjetas</button>
    <button type="button" data-statstab="pruebas" aria-selected="${statsTab === 'pruebas'}">Pruebas</button></div>`;
}

const promedio = (arr) => arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : null;

function notasGrafico(its) {
  const ult = its.slice(-20);
  return graficoBarras(ult.map(i => ({ v: i.nota, etiqueta: fechaCorta(i.ts), tip: `${fechaCorta(i.ts)} · ${i.nombre}: nota ${fmtNota(i.nota)} (${i.buenas}/${i.total})` })),
    { cadaEtiqueta: Math.max(1, Math.ceil(ult.length / 6)), resaltarUltima: true, tope: 7, vacio: 'Aún no hay pruebas rendidas' });
}

function listaIntentos(its) {
  return `<div class="card-list">${[...its].reverse().slice(0, 30).map(i => `
    <div class="card-row">
      <div class="q"><b>${esc(i.nombre)}</b> <span class="muted">· ${esc(fmtFecha(i.ts))}</span></div>
      <div class="when" style="min-width:auto"><b style="color:${colorNota(i.nota)};font-size:1.05rem">${fmtNota(i.nota)}</b> <span class="muted">${i.buenas}/${i.total}</span></div>
      <button class="btn sm" type="button" data-pr="abrir" data-id="${esc(i.id)}">Abrir</button>
    </div>`).join('')}</div>${its.length > 30 ? `<p class="muted" style="font-size:.78rem;margin-top:6px">Se muestran las 30 más recientes.</p>` : ''}`;
}

function renderStatsPruebas() {
  const body = $('#stats-body');
  const todos = intentosDe();
  if (!todos.length) {
    body.innerHTML = `<div class="empty"><div style="font-size:2.6rem">📝</div><h3>Aún no has rendido pruebas</h3><p>Cuando rindas una prueba verás aquí tu nota, el avance y qué temas te cuestan más.</p><button class="btn primary" type="button" data-go="pruebas">Ir a Pruebas</button></div>`;
    return;
  }
  if (PR.statsSel && !S.pruebas.has(PR.statsSel) && !todos.some(i => i.pruebaId === PR.statsSel)) PR.statsSel = null;
  const sel = PR.statsSel;
  const its = sel ? intentosDe(sel) : todos;
  const notas = its.map(i => i.nota);
  const tot = its.reduce((s, i) => s + i.total, 0), bien = its.reduce((s, i) => s + i.buenas, 0);
  const resumen = `
    <div class="today">
      <div class="stat"><div class="v">${its.length}</div><div class="l">${its.length === 1 ? 'Prueba rendida' : 'Pruebas rendidas'}</div></div>
      <div class="stat"><div class="v" style="color:${colorNota(promedio(notas))}">${fmtNota(promedio(notas))}</div><div class="l">Nota promedio</div></div>
      <div class="stat"><div class="v" style="color:var(--good)">${fmtNota(Math.max(...notas))}</div><div class="l">Mejor nota</div></div>
      <div class="stat"><div class="v">${pctTxt(bien, tot)}</div><div class="l">Respuestas correctas</div></div>
    </div>`;
  if (!sel) {
    const filas = [...new Set(todos.map(i => i.pruebaId))].map(id => {
      const xs = intentosDe(id), u = xs[xs.length - 1];
      return `<tr>
        <td><button class="link" type="button" data-pr="stats" data-id="${esc(id)}">${esc(u.nombre)}</button></td>
        <td class="num">${xs.length}</td>
        <td class="num" style="color:${colorNota(u.nota)}"><b>${fmtNota(u.nota)}</b></td>
        <td class="num">${fmtNota(promedio(xs.map(i => i.nota)))}</td>
        <td class="num">${fmtNota(Math.max(...xs.map(i => i.nota)))}</td>
        <td class="muted">${esc(fmtFecha(u.ts))}</td>
        <td><button class="btn sm" type="button" data-pr="stats" data-id="${esc(id)}">Ver detalle</button></td></tr>`;
    }).join('');
    body.innerHTML = `${resumen}
      <div class="card"><div class="card-h"><h3>Notas de tus pruebas</h3><span class="chip">Últimas ${Math.min(20, its.length)}</span></div>
        <p class="muted chart-sub">Escala de 1 a 7. La línea del medio es el 4,0 (aprobado).</p>${notasGrafico(its)}</div>
      <div class="card"><div class="card-h"><h3>Por tipo de prueba</h3></div>
        <div class="table-wrap"><table class="log-table"><thead><tr><th>Prueba</th><th>Rendidas</th><th>Última nota</th><th>Promedio</th><th>Mejor</th><th>Última vez</th><th></th></tr></thead><tbody>${filas}</tbody></table></div></div>
      <div class="card"><div class="card-h"><h3>Pruebas rendidas</h3></div>${listaIntentos(todos)}</div>`;
    return;
  }

  // Detalle de un tipo de prueba: temas y preguntas más falladas en todos los intentos
  const temas = {}, preg = new Map();
  its.forEach(i => i.preguntas.forEach(q => {
    if (q.tema) { const t = temas[q.tema] || (temas[q.tema] = { tema: q.tema, ok: 0, mal: 0 }); if (q.estado === 'ok') t.ok++; else t.mal++; }
    const p = preg.get(q.id) || { q, mal: 0, total: 0, ms: 0, conMs: 0 };
    p.q = q; p.total++; if (q.estado !== 'ok') p.mal++;
    if (q.ms > 0) { p.ms += q.ms; p.conMs++; }
    preg.set(q.id, p);
  }));
  const filasTemas = Object.values(temas).filter(t => t.mal).sort((a, b) => b.mal / (b.ok + b.mal) - a.mal / (a.ok + a.mal) || b.mal - a.mal);
  const falladas = [...preg.values()].filter(p => p.mal).sort((a, b) => b.mal / b.total - a.mal / a.total || b.mal - a.mal).slice(0, 15);
  // El número es la posición de la pregunta en la última vez que se rindió la prueba
  const ultimo = its[its.length - 1];
  const lentas = [...preg.values()].filter(p => p.conMs).map(p => ({ ...p, n: ultimo.preguntas.findIndex(q => q.id === p.q.id) + 1 || '—' }))
    .sort((a, b) => b.ms / b.conMs - a.ms / a.conMs).slice(0, 15);
  body.innerHTML = `
    <div class="toolbar"><button class="btn ghost sm" type="button" data-pr="stats-lista">← Todas las pruebas</button></div>
    <div class="head-row"><div><div class="eyebrow">Estadísticas de la prueba</div><h3 style="font-size:1.4rem">📝 ${esc(its[its.length - 1].nombre)}</h3></div></div>
    ${resumen}
    <div class="card"><div class="card-h"><h3>Evolución de la nota</h3><span class="chip">Últimas ${Math.min(20, its.length)}</span></div>
      <p class="muted chart-sub">Escala de 1 a 7. La línea del medio es el 4,0 (aprobado).</p>${notasGrafico(its)}</div>
    <div class="card"><div class="card-h"><h3>Temas con más errores</h3></div>
      ${filasTemas.length ? barraTemas(filasTemas) : '<div class="chart-empty" style="height:90px">Sin errores por tema 🎯</div>'}</div>
    <div class="card"><div class="card-h"><h3>Preguntas más falladas</h3>${falladas.length ? `<span class="chip">${falladas.length >= 15 ? 'Las 15 primeras' : plural(falladas.length, 'pregunta', 'preguntas')}</span>` : ''}</div>
      ${falladas.length ? `<div class="table-wrap"><table class="log-table rep-table">
        <thead><tr><th>Falladas</th><th>Pregunta</th><th>Respuesta correcta</th><th>Tema</th><th>Dónde repasar</th></tr></thead>
        <tbody>${falladas.map(p => `<tr>
          <td class="num" style="white-space:nowrap">${p.mal}<span class="muted"> / ${p.total}</span></td>
          <td class="rep-q"><span>${MazoMD.inline(primeraLinea(p.q.enunciado), {}, { siglas: false })}</span></td>
          <td class="rep-a">${p.q.opciones.filter(o => o.ok).map(o => MazoMD.inline(o.t, {}, { siglas: false })).join(' · ')}</td>
          <td>${p.q.tema ? esc(p.q.tema) : '<span class="muted">—</span>'}</td>
          <td class="rep-r">${p.q.ref ? refHtml(p.q.ref) : '<span class="muted">Sin referencia</span>'}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="chart-empty" style="height:90px">Aún no has fallado ninguna pregunta 🎯</div>'}</div>
    ${lentas.length ? `<div class="card"><div class="card-h"><h3>Preguntas que más tiempo tomaron</h3><span class="chip">${lentas.length >= 15 ? 'Las 15 primeras' : plural(lentas.length, 'pregunta', 'preguntas')}</span></div>
      <p class="muted chart-sub">Tiempo promedio por pregunta en todos los intentos, de mayor a menor.</p>
      ${tablaTiempos(lentas.map(p => ({ n: p.n, q: p.q, ms: p.ms / p.conMs, det: `${p.mal} mal de ${p.total}` })), 'Promedio')}</div>` : ''}
    <div class="card"><div class="card-h"><h3>Historial</h3></div>${listaIntentos(its)}</div>`;
}

/* ---------- Acciones (clics) ---------- */
document.addEventListener('click', (e) => {
  const st = e.target.closest('[data-statstab]');
  if (st) { statsTab = st.dataset.statstab; PR.statsSel = null; renderStats(); return; }
  const b = e.target.closest('[data-pr]');
  if (!b) return;
  const id = b.dataset.id;
  switch (b.dataset.pr) {
    case 'rendir': pedirInicio(id); break;
    case 'volver': go('rendir'); break;
    case 'lista': go('pruebas'); break;
    case 'stats': statsTab = 'pruebas'; PR.statsSel = id; go('stats'); break;
    case 'stats-lista': statsTab = 'pruebas'; PR.statsSel = null; go('stats'); break;
    case 'abrir': PR.intento = id; PR.filtro = 'todas'; PR.volverA = 'stats'; go('intento'); break;
    case 'ir': irAPregunta(+b.dataset.i); break;
    case 'ant': irAPregunta(PR.idx - 1); break;
    case 'sig': irAPregunta(PR.idx + 1); break;
    case 'opt': elegirRespuesta(+b.dataset.i); break;
    case 'entregar': {
      const falta = PR.enCurso ? PR.enCurso.preguntas.length - respondidas(PR.enCurso) : 0;
      confirmarConBoton(b, falta ? `${plural(falta, 'sin responder', 'sin responder')}. Toca otra vez` : '¿Entregar? Toca otra vez', () => entregarPrueba(false));
      break;
    }
    case 'filtro': PR.filtro = b.dataset.f; renderIntento(); break;
    case 'ir-q': {
      PR.filtro = 'todas'; renderIntento();
      const el = document.getElementById(`rq${b.dataset.i}`);
      if (el) { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); el.classList.add('resalta'); setTimeout(() => el.classList.remove('resalta'), 1600); }
      break;
    }
    case 'borrar': {
      if (esAlumno()) break;
      const p = S.pruebas.get(id);
      if (p) confirmarConBoton(b, '¿Eliminar? Toca otra vez', async () => {
        await save('intentos', [], intentosDe(id).map(i => i.id));
        await save('pruebas', [], [id]);
        toast(`«${p.nombre}» eliminada con sus intentos`); render();
      });
      break;
    }
    case 'borrar-intento':
      if (esAlumno()) break;
      confirmarConBoton(b, '¿Eliminar? Toca otra vez', async () => {
        await save('intentos', [], [id]);
        toast('Intento eliminado'); go(PR.volverA === 'stats' ? 'stats' : 'pruebas');
      });
      break;
  }
});
document.addEventListener('click', (e) => {
  if (e.target.closest('#iniciarPruebaBtn')) iniciarPrueba();
  if (e.target.closest('[data-act="copy-prompt-prueba"]')) copiar(promptPrueba(), $('#pTema').value.trim() ? 'Instrucciones copiadas: pégalas en tu IA' : 'Instrucciones copiadas: pégalas en tu IA y cambia [TEMA] por tu tema');
  if (e.target.closest('[data-act="share-prompt-prueba"]')) navigator.share({ title: 'Prueba para MemoSpark', text: promptPrueba() }).catch(() => {});
});
['pTema', 'pMaterial', 'pExtra'].forEach(id => $(`#${id}`).addEventListener('input', () => { $('#promptPrueba').textContent = promptPrueba(); }));
$('#sharePromptPruebaBtn').hidden = !navigator.share;

// El reloj sigue corriendo aunque la app estuviera cerrada: render() (app.js) llama a asegurarReloj() cuando ya cargaron
// los datos, y ahí se entrega sola la prueba que ya se quedó sin tiempo. Si los datos llegaron antes que este script,
// se revisa de nuevo un poco después.
setTimeout(() => { if (db || pluginReady) asegurarReloj(); }, 2500);

// Abierta fuera de ZenBan con ?modo=alumno (para probar la vista del alumno); dentro de ZenBan lo decide el permiso del usuario
if (!IN_ZENBAN) { try { if (new URLSearchParams(location.search).get('modo') === 'alumno') aplicarModo('alumno'); } catch (e) {} }
