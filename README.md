# MemoSpark

Tarjetas de memoria con repetición espaciada (el mismo algoritmo SM-2 que usa Anki). Cada tarjeta muestra una pregunta con alternativas; al responder se da vuelta y dice si acertaste, cuál era la correcta y una explicación. Los mazos se crean con cualquier IA en un archivo Markdown.

App publicada: https://mindsparkapps.github.io/memospark/

## Cómo se usa

1. **Crear con IA**: escribe el tema, la cantidad de tarjetas y el nivel; **Copiar instrucciones** y pégalas en ChatGPT, Claude, Gemini…
2. Guarda la respuesta como `.md` (o cópiala).
3. **Importar .md**: elige el archivo (y sus imágenes, si usa propias) o pega el texto. Antes de importar ves cuántas tarjetas hay y qué hay que revisar.
4. **Estudiar**: elige una alternativa (o escribe la respuesta) → la tarjeta se da vuelta, suena si acertaste y la app decide sola cuándo volver a mostrártela.

El formato completo está en [FORMATO.md](FORMATO.md).

Un mazo puede traer varios **tipos de respuesta** (por ejemplo «Solo el nombre» y «Nombre y para qué sirve»): al tocar **Estudiar** la app pregunta cuál usar y lo recuerda; también se cambia en el detalle del mazo.

Mazos incluidos en `ejemplos/`: capitales de Europa y **AWS Solutions Architect – Servicios clave** (95 tarjetas con los íconos oficiales y dos tipos de respuesta).

## Repetición espaciada

Mismos valores por defecto que Anki:

- **Nuevas**: pasos de 1 y 10 minutos; con **Bien** al terminar los pasos pasa a 1 día, con **Fácil** directo a 4 días. 20 nuevas por día por mazo (se cambia en el detalle del mazo).
- **Repaso**: el intervalo se multiplica por la facilidad de la tarjeta (empieza en 250 %). **Difícil** ×1,2 y baja la facilidad, **Fácil** suma un 30 % y la sube.
- **Fallo**: la tarjeta vuelve a aprendizaje (10 minutos), baja la facilidad y su intervalo vuelve a 1 día.
- El día de estudio cambia a las 4 de la mañana. Los intervalos largos llevan un poco de azar para no amontonar repasos.

### Calificación automática

No se pregunta Difícil / Bien / Fácil: la app lo calcula con el acierto, el tiempo de respuesta y los aciertos seguidos de la tarjeta.

- **Incorrecta** (o «No la sé») → **Otra vez**: vuelve en 1 minuto (o 10 si ya estaba en repaso).
- El tiempo esperado es 2,5 s + 0,3 s por palabra de la pregunta y las alternativas (+0,4 s por palabra a escribir en respuesta libre). No cuenta el rato con la app en segundo plano.
- **Correcta y lenta** (más de 1,5 veces lo esperado) → **Difícil**.
- **Correcta a tiempo** → **Bien**.
- **Correcta y rápida** (menos de 0,6 veces lo esperado) → **Fácil**, solo si ya la acertaste al menos 2 veces seguidas; si no, **Bien** (un acierto rápido al azar no la manda lejos).

Al dar vuelta la tarjeta aparece un check verde (acierto) o una cruz roja (fallo) grande y animada, suena un tono (sube al acertar, baja al fallar) y el celular vibra (Android). Debajo se ve la nota que puso la app, por qué y cuándo vuelve.

### Estadísticas

La pestaña **Estadísticas** muestra:

- respondidas y aciertos de hoy, tiempo medio por respuesta, recuerdo en los repasos de los últimos 30 días y racha (actual / mejor);
- el estado de todas las tarjetas: sin ver, aprendiendo, en repaso y dominadas (intervalo de 21 días o más);
- respuestas por día de los últimos 30 días y repasos programados para los próximos 14 (toca o pasa el mouse por una barra para ver el detalle);
- una tabla por mazo con tarjetas, sin ver, dominadas, aciertos de 30 días y lo que toca hoy.

### Ajustes (⚙️)

- **Vibración** (activada por defecto) y **Sonidos** (activados por defecto). Se guardan en cada dispositivo; dentro de ZenBan duran mientras la ventana esté abierta.
- **Registro de respuestas**: cada respuesta queda anotada (tiempo, tiempo esperado, relación entre ambos, aciertos seguidos, nota que puso la app, estado e intervalo antes y después). La tabla muestra, para cada nota, qué porcentaje de esas tarjetas se acertó la vez siguiente: si **Bien** y **Fácil** quedan cerca del 85–90 %, la calificación va bien; si **Fácil** queda bastante más bajo, el umbral de «rápido» es muy generoso. Se descarga en CSV o JSON para ajustar `notaAutomatica` y `tiempoEsperado` en `srs.js`. Se guardan las últimas 5000 respuestas (600 dentro de ZenBan) y se sincronizan como el resto de los datos.

Respuesta libre: no importan mayúsculas, tildes ni signos, y se acepta un error de tipeo (dos en respuestas de 10 letras o más).

Atajos de teclado: `A`–`D` o `1`–`4` para elegir, `Enter` para comprobar, `Espacio` o `Enter` para continuar.

## Plugin de ZenBan

MemoSpark funciona también como objeto del lienzo de ZenBan:

1. En ZenBan: ⚙️ Configuración › Plugins › pega `https://mindsparkapps.github.io/memospark/` › Agregar.
2. Botón derecho en el lienzo › Agregar aquí › MemoSpark.

Dentro de ZenBan la ventana va aislada, así que sus mazos y su progreso se guardan **dentro del objeto** y se sincronizan con el Drive de ZenBan (no usa la cuenta de Google de MemoSpark). Cada objeto tiene sus propios mazos. En un tablero de solo lectura se puede estudiar, pero no se guarda.

- `zenban-plugin.json`: nombre, ícono y tamaño del plugin.
- `zenban-plugin-sdk.js`: copia del SDK de ZenBan.

## Cuenta de Google y sincronización

- Funciona sin conexión y sin iniciar sesión: los datos se guardan al instante en el dispositivo (IndexedDB).
- Con **Iniciar sesión** los datos se guardan también en la carpeta oculta de la app en tu Google Drive (`memospark-data.json`), así que son los mismos en el PC y en el celular. Se combinan registro por registro (mazos, tarjetas, progreso de cada tarjeta, conteo de cada día y registro de respuestas).
- El punto junto a tu foto indica el estado: verde sincronizado, amarillo pendiente o sin conexión, rojo error.

## Instalar como app

- **Android (Chrome):** menú ⋮ → **Instalar app** (o el botón **Instalar** de la app).
- **iPhone (Safari):** Compartir → **Agregar a pantalla de inicio**.
- **PC (Chrome o Edge):** el ícono de instalar en la barra de direcciones. Instalada, se puede abrir un `.md` con «Abrir con › MemoSpark».

## Estructura

```
index.html         interfaz
styles.css         estilos (tema claro y oscuro)
app.js             vistas, importación, sesión de estudio, almacenamiento y modo ZenBan
srs.js             repetición espaciada (SM-2 como Anki)
mazo-md.js         lectura del formato .md y dibujo del Markdown de las tarjetas
formato.js         instrucciones para la IA (mismo texto que FORMATO.md)
sync.js            login con Google y sincronización con Google Drive (mismo patrón que TotalStats)
config.js          ID del cliente OAuth "MindSpark"
manifest.json      app instalable (incluye abrir archivos .md)
sw.js              service worker (modo sin conexión)
zenban-plugin.json / zenban-plugin-sdk.js   plugin de ZenBan
ejemplos/          mazo de ejemplo
icons/             íconos (normales, maskable y Apple)
```

Al publicar cambios, sube `APP_VERSION` en `app.js`, los `?v=` de `index.html` y `sw.js`, y `CACHE_NAME` en `sw.js`.

## Configuración de Google

Usa el cliente OAuth compartido "MindSpark". `https://mindsparkapps.github.io` ya está en **Orígenes de JavaScript autorizados**. Para el inicio de sesión dentro de la app instalada, agrega `https://mindsparkapps.github.io/memospark/` en **URI de redireccionamiento autorizados**.
