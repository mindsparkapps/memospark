// ===== MemoSpark - Configuración (solo profe): qué tarjetas (mazos) y pruebas ve cada alumno =====
// Un registro por alumno en el almacén «config»: { id: correo en minúsculas, nombre, mazos: [ids], pruebas: [ids] }.
// Sin registro, o con las listas vacías, el alumno no ve nada. El profe siempre ve todo.
// La lista de alumnos sale de las personas del espacio compartido de ZenBan (las que no tienen «Editar todo»);
// también se puede agregar un correo a mano. Se carga después de pruebas.js.

const alumnosConfig = () => [...S.config.values()];

// Personas que ZenBan dice que son alumnos (permiso distinto de «Editar todo») + las ya configuradas
function listaAlumnos() {
  const out = new Map();
  miembros.forEach(m => {
    const email = claveAlumno(m.email);
    if (!email || m.role === 'owner' || m.nivel === 'edit') return;
    out.set(email, { email, nombre: m.nombre || '', cfg: S.config.get(email) || null, deZenBan: true });
  });
  alumnosConfig().forEach(c => { if (!out.has(c.id)) out.set(c.id, { email: c.id, nombre: c.nombre || '', cfg: c, deZenBan: false }); });
  return [...out.values()].sort((a, b) => (a.nombre || a.email).localeCompare(b.nombre || b.email, 'es'));
}

function opcionesAsignar(tipo, lista, marcados, vacio) {
  if (!lista.length) return `<p class="muted" style="font-size:.84rem">${vacio}</p>`;
  return `<div class="asig-list">${lista.map(x => `
    <label class="asig-item"><input type="checkbox" data-asig="${tipo}" value="${esc(x.id)}" ${marcados.has(x.id) ? 'checked' : ''} ${readOnly ? 'disabled' : ''}>
      <span>${esc(x.nombre)}${x.extra ? ` <small class="muted">${esc(x.extra)}</small>` : ''}</span></label>`).join('')}</div>`;
}

function renderConfig() {
  const alumnos = listaAlumnos();
  const mazos = mazosOrdenados().map(m => ({ id: m.id, nombre: m.nombre, extra: `${tarjetasDe(m.id).length} tarjetas${m.carpeta ? ` · ${m.carpeta}` : ''}` }));
  const pruebas = pruebasOrdenadas().map(p => ({ id: p.id, nombre: p.nombre, extra: `${p.preguntas.length} preguntas · ${p.minutos} min` }));
  const abiertos = new Set([...document.querySelectorAll('#config-body details[data-alumno][open]')].map(d => d.dataset.alumno));
  $('#config-body').innerHTML = `
    <div class="head-row"><div><div class="eyebrow">Solo el profe ve esto</div><h2>Configuración</h2></div></div>
    <p class="muted" style="margin:-4px 0 14px">Elige qué mazos de tarjetas y qué pruebas puede ver cada alumno. Un alumno al que no le asignes nada no verá ningún mazo ni prueba.</p>
    ${alumnos.length ? alumnos.map(a => {
      const cfg = a.cfg || { mazos: [], pruebas: [] };
      const ms = new Set((cfg.mazos || []).filter(id => S.mazos.has(id))), ps = new Set((cfg.pruebas || []).filter(id => S.pruebas.has(id)));
      return `<details class="card alumno-card" data-alumno="${esc(a.email)}" ${abiertos.has(a.email) ? 'open' : ''}>
        <summary><h3>${esc(a.nombre || a.email)}</h3>
          <span class="muted">${a.nombre ? esc(a.email) + ' · ' : ''}${plural(ms.size, 'mazo', 'mazos')} · ${plural(ps.size, 'prueba', 'pruebas')}</span></summary>
        <div class="grid" style="margin-top:12px">
          <div class="c6">
            <div class="card-h"><h3 style="font-size:1rem">🃏 Tarjetas</h3><span class="toolbar">
              <button class="btn ghost sm" type="button" data-cfg="todo" data-tipo="mazos" ${readOnly ? 'disabled' : ''}>Todos</button>
              <button class="btn ghost sm" type="button" data-cfg="nada" data-tipo="mazos" ${readOnly ? 'disabled' : ''}>Ninguno</button></span></div>
            ${opcionesAsignar('mazos', mazos, ms, 'Aún no hay mazos. Impórtalos en la pestaña Mazos.')}
          </div>
          <div class="c6">
            <div class="card-h"><h3 style="font-size:1rem">📝 Pruebas</h3><span class="toolbar">
              <button class="btn ghost sm" type="button" data-cfg="todo" data-tipo="pruebas" ${readOnly ? 'disabled' : ''}>Todas</button>
              <button class="btn ghost sm" type="button" data-cfg="nada" data-tipo="pruebas" ${readOnly ? 'disabled' : ''}>Ninguna</button></span></div>
            ${opcionesAsignar('pruebas', pruebas, ps, 'Aún no hay pruebas. Impórtalas en la pestaña Pruebas.')}
          </div>
        </div>
        ${a.deZenBan ? '' : `<div class="toolbar" style="margin-top:10px"><button class="btn ghost sm danger" type="button" data-cfg="quitar" ${readOnly ? 'disabled' : ''}>Quitar a este alumno</button></div>`}
      </details>`;
    }).join('') : `<div class="empty"><div style="font-size:2.6rem">🎓</div><h3>Aún no hay alumnos</h3>
      <p>${IN_ZENBAN ? 'Los alumnos son las personas de tu espacio compartido de ZenBan con permiso «Crear» o «Solo ver». Cuando los agregues aparecerán aquí.' : 'Fuera de ZenBan agrega a cada alumno con su correo.'} También puedes agregar un correo a mano.</p></div>`}
    <div class="card">
      <div class="card-h"><h3>Agregar un alumno por correo</h3></div>
      <div class="frow" style="align-items:end">
        <label class="f">Correo<input type="email" id="alumnoNuevo" placeholder="alumno@correo.com" autocomplete="off" ${readOnly ? 'disabled' : ''}></label>
        <button class="btn primary" type="button" data-cfg="agregar" ${readOnly ? 'disabled' : ''}>Agregar</button>
      </div>
    </div>`;
}

function guardarAsignacion(det) {
  const email = det.dataset.alumno;
  const prev = S.config.get(email) || { id: email };
  const al = listaAlumnos().find(a => a.email === email);
  const marcados = (tipo) => [...det.querySelectorAll(`input[data-asig="${tipo}"]:checked`)].map(i => i.value);
  save('config', [{ ...prev, id: email, nombre: prev.nombre || (al && al.nombre) || '', mazos: marcados('mazos'), pruebas: marcados('pruebas') }]);
  renderConfig();
}

document.addEventListener('change', (e) => {
  const cb = e.target.closest('input[data-asig]');
  if (!cb || esAlumno()) return;
  guardarAsignacion(cb.closest('details[data-alumno]'));
});

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-cfg]');
  if (!b || esAlumno()) return;
  const det = b.closest('details[data-alumno]');
  switch (b.dataset.cfg) {
    case 'todo':
    case 'nada':
      det.querySelectorAll(`input[data-asig="${b.dataset.tipo}"]`).forEach(i => { i.checked = b.dataset.cfg === 'todo'; });
      guardarAsignacion(det);
      break;
    case 'quitar': {
      const email = det.dataset.alumno;
      confirmarConBoton(b, '¿Quitar? Toca otra vez', async () => { await save('config', [], [email]); toast('Alumno quitado'); renderConfig(); });
      break;
    }
    case 'agregar': {
      const inp = $('#alumnoNuevo');
      const email = claveAlumno(inp.value);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Escribe un correo válido'); return; }
      if (!S.config.has(email)) save('config', [{ id: email, nombre: '', mazos: [], pruebas: [] }]);
      toast('Alumno agregado: ahora elige qué ve');
      renderConfig();
      const d = document.querySelector(`details[data-alumno="${CSS.escape(email)}"]`);
      if (d) d.open = true;
      break;
    }
  }
});
