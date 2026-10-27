// ===== MemoSpark - Lectura de mazos en Markdown y dibujo del texto de las tarjetas =====
// Formato (ver FORMATO.md):
//   # Nombre del mazo            -> empieza un mazo (puede haber varios en un archivo)
//   texto                         -> descripción del mazo (opcional)
//   ## Pregunta                   -> empieza una tarjeta; el texto que sigue es parte de la pregunta
//   - [x] correcta / - [ ] falsa  -> alternativas (una o varias correctas)
//   Respuesta: texto              -> en vez de alternativas: tarjeta de respuesta libre
//   texto después de las alternativas -> explicación que se ve al dar vuelta la tarjeta

const MazoMD = (() => {
  const OPTION_RE = /^\s*[-*+]\s+\[( |x|X)\]\s+(.*)$/;
  const ANSWER_RE = /^\s*\*{0,2}Respuesta\*{0,2}\s*:\s*\*{0,2}\s*(.*)$/i;
  const EXPLAIN_RE = /^\s*\*{0,2}Explicaci[oó]n\*{0,2}\s*:\s*\*{0,2}\s*/i;

  // Identificador estable a partir de un texto: al volver a importar el mismo mazo se conserva el progreso
  function hash(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
  }
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const trimBlock = (lines) => {
    const out = [...lines];
    while (out.length && !out[0].trim()) out.shift();
    while (out.length && !out[out.length - 1].trim()) out.pop();
    return out.join('\n');
  };

  // Devuelve { mazos: [{ id, nombre, descripcion, tarjetas: [...] }], avisos: ['…'] }
  function parse(text) {
    let src = String(text || '').replace(/\r\n?/g, '\n').replace(/^﻿/, '');
    // Las IA a veces envuelven todo en un bloque ```markdown … ```
    const fenced = src.trim().match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```\s*$/i);
    if (fenced) src = fenced[1];

    const lines = src.split('\n');
    const mazos = [];
    const avisos = [];
    let mazo = null;
    let card = null;
    let inCode = false;

    const closeCard = () => {
      if (!card) return;
      const c = card;
      card = null;
      const pregunta = trimBlock([c.titulo, '', ...c.cuerpo]);
      const explicacion = trimBlock(c.explicacion).replace(EXPLAIN_RE, '');
      if (!c.opciones.length && !c.respuesta) {
        avisos.push(`Línea ${c.linea}: «${c.titulo.slice(0, 60)}» no tiene alternativas ni «Respuesta:», se omitió.`);
        return;
      }
      if (c.opciones.length && !c.opciones.some(o => o.ok)) {
        avisos.push(`Línea ${c.linea}: «${c.titulo.slice(0, 60)}» no tiene ninguna alternativa marcada con [x], se omitió.`);
        return;
      }
      if (c.opciones.length === 1) avisos.push(`Línea ${c.linea}: «${c.titulo.slice(0, 60)}» tiene una sola alternativa.`);
      // El id no depende de las imágenes: cambiar la dirección de una imagen no borra el progreso
      let id = 't' + hash(mazo.id + '|' + norm(pregunta.replace(/!\[[^\]]*\]\([^)]*\)/g, '')));
      while (mazo.tarjetas.some(t => t.id === id)) id += 'x';
      mazo.tarjetas.push({
        id, pregunta, explicacion,
        opciones: c.opciones,
        respuesta: c.opciones.length ? '' : c.respuesta,
        orden: mazo.tarjetas.length
      });
    };

    const ensureMazo = (lineNo) => {
      if (mazo) return;
      mazo = { id: 'm' + hash('mazo|' + norm('Mazo importado')), nombre: 'Mazo importado', descripcion: '', desc: [], tarjetas: [] };
      mazos.push(mazo);
      avisos.push(`Línea ${lineNo}: faltaba el título del mazo («# Nombre»), se usó «Mazo importado».`);
    };

    lines.forEach((line, i) => {
      const n = i + 1;
      if (/^\s*```/.test(line)) inCode = !inCode;
      if (!inCode) {
        const h1 = line.match(/^#\s+(.+?)\s*#*\s*$/);
        if (h1) {
          closeCard();
          if (mazo) mazo.descripcion = trimBlock(mazo.desc);
          const nombre = h1[1].replace(/^Mazo\s*:\s*/i, '').trim();
          mazo = { id: 'm' + hash('mazo|' + norm(nombre)), nombre, descripcion: '', desc: [], tarjetas: [] };
          const dup = mazos.find(m => m.id === mazo.id);
          if (dup) mazo = dup; else mazos.push(mazo);
          return;
        }
        const h2 = line.match(/^##\s+(.+?)\s*#*\s*$/);
        if (h2) {
          closeCard();
          ensureMazo(n);
          card = { titulo: h2[1].replace(/^(Pregunta|Tarjeta)\s*\d*\s*[:.]\s*/i, ''), cuerpo: [], opciones: [], respuesta: '', explicacion: [], linea: n, fase: 'pregunta' };
          return;
        }
      }
      if (!card) {
        if (mazo) mazo.desc.push(line);
        else if (line.trim()) ensureMazo(n);
        return;
      }
      if (!inCode && card.fase !== 'explicacion') {
        const op = line.match(OPTION_RE);
        if (op) {
          card.fase = 'opciones';
          card.opciones.push({ t: op[2].trim(), ok: op[1] !== ' ' });
          return;
        }
        const ans = line.match(ANSWER_RE);
        if (ans && !card.opciones.length) {
          card.respuesta = ans[1].trim();
          card.fase = 'explicacion';
          return;
        }
        if (card.fase === 'opciones' && line.trim()) card.fase = 'explicacion';
      }
      if (card.fase === 'pregunta') card.cuerpo.push(line);
      else if (card.fase === 'explicacion') card.explicacion.push(line);
    });
    closeCard();
    if (mazo) mazo.descripcion = trimBlock(mazo.desc);
    mazos.forEach(m => { delete m.desc; });
    const vacios = mazos.filter(m => !m.tarjetas.length);
    vacios.forEach(m => avisos.push(`El mazo «${m.nombre}» no tiene tarjetas válidas.`));
    return { mazos: mazos.filter(m => m.tarjetas.length), avisos };
  }

  // Vuelve a escribir un mazo en el mismo formato (para exportarlo o editarlo con una IA)
  function serialize(mazo, tarjetas) {
    const out = [`# ${mazo.nombre}`, ''];
    if (mazo.descripcion) out.push(mazo.descripcion, '');
    tarjetas.forEach(t => {
      const [titulo, ...resto] = t.pregunta.split('\n');
      out.push(`## ${titulo}`);
      const cuerpo = trimBlock(resto);
      if (cuerpo) out.push('', cuerpo);
      out.push('');
      if (t.opciones && t.opciones.length) t.opciones.forEach(o => out.push(`- [${o.ok ? 'x' : ' '}] ${o.t}`));
      else out.push(`Respuesta: ${t.respuesta}`);
      if (t.explicacion) out.push('', t.explicacion);
      out.push('');
    });
    return out.join('\n');
  }

  // ----- Markdown mínimo para mostrar las tarjetas (negrita, cursiva, código, imágenes, enlaces, listas) -----
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u) => /^(https?:|data:image\/|\.{0,2}\/|[\w-]+\.(png|jpe?g|gif|webp|svg)$)/i.test(u.trim()) ? u.trim() : '#';

  function inline(text, images = {}) {
    const codes = [];
    let s = String(text).replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, alt, url) => {
      const real = images[url.replace(/&amp;/g, '&')] || url.replace(/&amp;/g, '&');
      return `<img src="${esc(safeUrl(real))}" alt="${alt}">`;
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, url) => `<a href="${esc(safeUrl(url.replace(/&amp;/g, '&')))}" target="_blank" rel="noopener">${t}</a>`);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>').replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
    return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
  }

  function render(text, images = {}) {
    const lines = String(text || '').split('\n');
    const html = [];
    let para = [], list = null, code = null;
    const flushPara = () => { if (para.length) html.push(`<p>${para.map(l => inline(l, images)).join('<br>')}</p>`); para = []; };
    const flushList = () => { if (list) html.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i, images)}</li>`).join('')}</${list.tag}>`); list = null; };
    lines.forEach(line => {
      if (code) {
        if (/^\s*```/.test(line)) { html.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`); code = null; }
        else code.push(line);
        return;
      }
      if (/^\s*```/.test(line)) { flushPara(); flushList(); code = []; return; }
      const li = line.match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.*)$/);
      if (li) {
        flushPara();
        const tag = li[1] ? 'ul' : 'ol';
        if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
        list.items.push(li[3]);
        return;
      }
      const h = line.match(/^#{3,6}\s+(.*)$/);
      if (h) { flushPara(); flushList(); html.push(`<h4>${inline(h[1], images)}</h4>`); return; }
      const q = line.match(/^\s*>\s?(.*)$/);
      if (q) { flushPara(); flushList(); html.push(`<blockquote>${inline(q[1], images)}</blockquote>`); return; }
      if (!line.trim()) { flushPara(); flushList(); return; }
      flushList();
      para.push(line);
    });
    if (code) html.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
    flushPara(); flushList();
    return html.join('');
  }

  // Nombres de archivo de imagen usados en el texto (para pedirlas junto al .md)
  function imageRefs(text) {
    const refs = new Set();
    String(text || '').replace(/!\[[^\]]*\]\(([^)\s]+)/g, (_, u) => { if (!/^(https?:|data:)/i.test(u)) refs.add(u); return _; });
    return [...refs];
  }

  return { parse, serialize, render, inline, imageRefs, hash };
})();
