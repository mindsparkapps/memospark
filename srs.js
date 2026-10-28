// ===== MemoSpark - Repetición espaciada (algoritmo SM-2, con los mismos valores por defecto que Anki) =====
// Estados de una tarjeta: nuevo -> aprendiendo (pasos de 1 y 10 min) -> repaso (días) -> si se falla, reaprendiendo.
// Notas: 1 Otra vez, 2 Difícil, 3 Bien, 4 Fácil. La app las elige sola (notaAutomatica).

const SRS = (() => {
  const MIN = 60 * 1000;
  const DAY = 24 * 60 * MIN;
  const CFG = {
    pasos: [1, 10],            // minutos, tarjetas nuevas
    pasosReaprender: [10],     // minutos, tarjetas falladas en repaso
    intervaloGraduar: 1,       // días al terminar los pasos con «Bien»
    intervaloFacil: 4,         // días al responder «Fácil» siendo nueva
    facilidadInicial: 2.5,
    facilidadMinima: 1.3,
    multDificil: 1.2,
    bonoFacil: 1.3,
    intervaloMaximo: 36500,
    adelantoAprendizaje: 20 * MIN, // si no queda nada más, se adelantan tarjetas en aprendizaje hasta 20 min
    cambioDeDia: 4             // el día de estudio empieza a las 4 de la mañana, como en Anki
  };

  // Inicio del día de estudio que contiene `ts` (a las 4:00)
  function dayStart(ts = Date.now()) {
    const d = new Date(ts - CFG.cambioDeDia * 60 * MIN);
    d.setHours(0, 0, 0, 0);
    return d.getTime() + CFG.cambioDeDia * 60 * MIN;
  }
  function dayKey(ts = Date.now()) {
    const d = new Date(dayStart(ts));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function nuevo(id, mazoId) {
    return { id, mazoId, estado: 'nuevo', paso: 0, intervalo: 0, facilidad: CFG.facilidadInicial, vence: 0, reps: 0, fallos: 0, ultima: 0 };
  }

  // Un poco de azar en los intervalos largos para que las tarjetas no se amontonen el mismo día
  function fuzz(days, rnd) {
    if (days < 2.5) return Math.round(days);
    const spread = days < 7 ? 1 : days < 30 ? Math.max(2, days * 0.15) : Math.max(4, days * 0.05);
    return Math.round(days - spread + rnd * 2 * spread);
  }
  const clampIv = (d) => Math.min(CFG.intervaloMaximo, Math.max(1, d));

  // Tiempo que debería tomar responder sin dudar: leer la pregunta y las alternativas (o escribir la respuesta)
  function tiempoEsperado(palabras, escribir = 0) {
    return 2500 + palabras * 300 + escribir * 400;
  }

  // La app califica sola, sin preguntar Difícil / Bien / Fácil:
  // - incorrecta -> Otra vez
  // - correcta pero lenta (más de 1,5 veces lo esperado) -> Difícil
  // - correcta a tiempo -> Bien
  // - correcta y rápida (menos de 0,6 veces lo esperado) -> Fácil, pero solo si ya la acertaste
  //   al menos 2 veces seguidas antes (así un acierto rápido al azar no la manda lejos)
  function notaAutomatica({ correcta, ms, esperadoMs, racha = 0 }) {
    if (!correcta) return { nota: 1, ritmo: 'error' };
    const r = ms / Math.max(1000, esperadoMs);
    if (r > 1.5) return { nota: 2, ritmo: 'lento' };
    if (r < 0.6) return racha >= 2 ? { nota: 4, ritmo: 'rapido' } : { nota: 3, ritmo: 'rapido' };
    return { nota: 3, ritmo: 'normal' };
  }

  // Devuelve el nuevo progreso tras responder `nota` (1-4). No modifica el original.
  // `racha` cuenta los aciertos seguidos de la tarjeta (vuelve a 0 al fallar).
  function responder(p, nota, now = Date.now(), rnd = Math.random()) {
    const q = { ...p, reps: (p.reps || 0) + 1, ultima: now, racha: nota > 1 ? (p.racha || 0) + 1 : 0 };
    const learning = p.estado === 'nuevo' || p.estado === 'aprendiendo';
    const relearning = p.estado === 'reaprendiendo';

    if (learning || relearning) {
      const pasos = relearning ? CFG.pasosReaprender : CFG.pasos;
      const paso = p.estado === 'nuevo' ? 0 : p.paso || 0;
      const graduar = (dias) => {
        q.estado = 'repaso'; q.paso = 0;
        q.intervalo = clampIv(dias);
        q.vence = dayStart(now) + q.intervalo * DAY;
      };
      if (nota === 1) {
        q.estado = relearning ? 'reaprendiendo' : 'aprendiendo'; q.paso = 0;
        q.vence = now + pasos[0] * MIN;
      } else if (nota === 2) {
        q.estado = relearning ? 'reaprendiendo' : 'aprendiendo'; q.paso = paso;
        const actual = pasos[paso] || pasos[pasos.length - 1];
        const demora = paso === 0 && pasos.length > 1 ? (pasos[0] + pasos[1]) / 2 : paso === 0 ? Math.min(actual * 1.5, actual + 24 * 60) : actual;
        q.vence = now + demora * MIN;
      } else if (nota === 3) {
        if (paso + 1 < pasos.length) {
          q.estado = relearning ? 'reaprendiendo' : 'aprendiendo'; q.paso = paso + 1;
          q.vence = now + pasos[paso + 1] * MIN;
        } else graduar(relearning ? p.intervalo || 1 : CFG.intervaloGraduar);
      } else {
        graduar(relearning ? (p.intervalo || 1) + 1 : CFG.intervaloFacil);
      }
      return q;
    }

    // Tarjeta en repaso
    const iv = Math.max(1, p.intervalo || 1);
    const atraso = Math.max(0, Math.floor((dayStart(now) - (p.vence || now)) / DAY));
    let fac = p.facilidad || CFG.facilidadInicial;
    if (nota === 1) {
      q.fallos = (p.fallos || 0) + 1;
      q.facilidad = Math.max(CFG.facilidadMinima, fac - 0.2);
      q.estado = 'reaprendiendo'; q.paso = 0;
      q.intervalo = 1;
      q.vence = now + CFG.pasosReaprender[0] * MIN;
      return q;
    }
    const dificil = Math.max(iv + 1, iv * CFG.multDificil);
    const bien = Math.max(dificil + 1, (iv + atraso / 2) * fac);
    const facil = Math.max(bien + 1, (iv + atraso) * fac * CFG.bonoFacil);
    if (nota === 2) { fac = Math.max(CFG.facilidadMinima, fac - 0.15); q.intervalo = clampIv(fuzz(dificil, rnd)); }
    else if (nota === 3) { q.intervalo = clampIv(fuzz(bien, rnd)); }
    else { fac += 0.15; q.intervalo = clampIv(fuzz(facil, rnd)); }
    q.facilidad = Math.round(fac * 1000) / 1000;
    q.estado = 'repaso';
    q.vence = dayStart(now) + q.intervalo * DAY;
    return q;
  }

  // Respuesta fuera de turno (repaso de las más falladas): una tarjeta en repaso que aún no vence.
  // - Si se falla, cuenta como cualquier fallo (vuelve a aprendizaje y baja la facilidad).
  // - Si se acierta, el nuevo intervalo se calcula con los días que pasaron de verdad (no con el intervalo
  //   programado) y nunca acorta lo que ya estaba programado: así repasar antes no infla los intervalos.
  function responderAdelantado(p, nota, now = Date.now(), rnd = Math.random()) {
    const noVence = p.estado === 'repaso' && p.vence > dayStart(now) + DAY;
    if (!noVence || nota === 1) return responder(p, nota, now, rnd);
    const transcurridos = Math.max(1, Math.floor((dayStart(now) - dayStart(p.ultima || now)) / DAY));
    const q = responder({ ...p, intervalo: Math.min(p.intervalo || 1, transcurridos), vence: dayStart(now) }, nota, now, rnd);
    if (q.vence < p.vence) { q.vence = p.vence; q.intervalo = p.intervalo; }
    return q;
  }

  // Texto corto del tiempo hasta la próxima vez (para mostrar en cada botón)
  function cuando(p, nota, now = Date.now(), adelantado = false) {
    const q = (adelantado ? responderAdelantado : responder)(p, nota, now, 0.5);
    if (q.estado === 'repaso') return formatoDias(q.intervalo);
    const min = Math.round((q.vence - now) / MIN);
    return min < 60 ? `${min} min` : `${Math.round(min / 60)} h`;
  }
  function formatoDias(d) {
    if (d < 30) return d === 1 ? '1 día' : `${d} días`;
    if (d < 365) { const m = Math.round(d / 30 * 10) / 10; return m === 1 ? '1 mes' : `${m.toString().replace('.', ',')} meses`; }
    const a = Math.round(d / 365 * 10) / 10;
    return a === 1 ? '1 año' : `${a.toString().replace('.', ',')} años`;
  }

  const enAprendizaje = (p) => p.estado === 'aprendiendo' || p.estado === 'reaprendiendo';

  // Elige la siguiente tarjeta de la sesión.
  // progreso: lista de progresos de las tarjetas a estudiar. nuevasRestantes: cuántas nuevas quedan hoy.
  // Devuelve { p, tipo } o { espera: ms } si solo quedan tarjetas en aprendizaje para más tarde, o null.
  function siguiente(progreso, { nuevasRestantes = 20, repasosRestantes = 200, ultimaId = null, contador = 0, now = Date.now() } = {}) {
    const finDia = dayStart(now) + DAY;
    const aprend = progreso.filter(enAprendizaje).sort((a, b) => a.vence - b.vence);
    const repasos = progreso.filter(p => p.estado === 'repaso' && p.vence < finDia).sort((a, b) => a.vence - b.vence);
    const nuevas = progreso.filter(p => p.estado === 'nuevo').sort((a, b) => (a.orden || 0) - (b.orden || 0));
    const pick = (list) => list.find(p => p.id !== ultimaId) || list[0];

    const listas = aprend.filter(p => p.vence <= now);
    if (listas.length) return { p: pick(listas), tipo: 'aprendiendo' };

    const hayRepaso = repasosRestantes > 0 && repasos.length;
    const hayNueva = nuevasRestantes > 0 && nuevas.length;
    // Una nueva cada 3 repasos (como «mezclar nuevas con repasos» de Anki)
    if (hayNueva && (!hayRepaso || contador % 4 === 3)) return { p: pick(nuevas), tipo: 'nuevo' };
    if (hayRepaso) return { p: pick(repasos), tipo: 'repaso' };

    const pronto = aprend.filter(p => p.vence <= now + CFG.adelantoAprendizaje);
    if (pronto.length) return { p: pick(pronto), tipo: 'aprendiendo' };
    if (aprend.length) return { espera: aprend[0].vence - now };
    return null;
  }

  // Conteos para la lista de mazos: nuevas disponibles hoy, en aprendizaje y para repasar
  function conteos(progreso, nuevasRestantes, now = Date.now()) {
    const finDia = dayStart(now) + DAY;
    let nuevas = 0, aprend = 0, repaso = 0;
    progreso.forEach(p => {
      if (p.estado === 'nuevo') nuevas++;
      else if (enAprendizaje(p)) { if (p.vence < finDia) aprend++; }
      else if (p.vence < finDia) repaso++;
    });
    return { nuevas: Math.min(nuevas, Math.max(0, nuevasRestantes)), nuevasTotal: nuevas, aprend, repaso };
  }

  return { CFG, DAY, MIN, dayStart, dayKey, nuevo, responder, responderAdelantado, tiempoEsperado, notaAutomatica, cuando, formatoDias, siguiente, conteos, enAprendizaje };
})();
