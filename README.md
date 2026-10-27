# MemoSpark

Tarjetas de memoria con repetición espaciada (el mismo algoritmo SM-2 que usa Anki). Cada tarjeta muestra una pregunta con alternativas; al responder se da vuelta y dice si acertaste, cuál era la correcta y una explicación. Los mazos se crean con cualquier IA en un archivo Markdown.

App publicada: https://mindsparkapps.github.io/memospark/

## Cómo se usa

1. **Crear con IA**: escribe el tema, la cantidad de tarjetas y el nivel; **Copiar instrucciones** y pégalas en ChatGPT, Claude, Gemini…
2. Guarda la respuesta como `.md` (o cópiala).
3. **Importar .md**: elige el archivo (y sus imágenes, si usa propias) o pega el texto. Antes de importar ves cuántas tarjetas hay y qué hay que revisar.
4. **Estudiar**: elige una alternativa → la tarjeta se da vuelta → si acertaste, elige **Difícil / Bien / Fácil**; si fallaste, vuelve en 1 minuto.

El formato completo está en [FORMATO.md](FORMATO.md).

## Repetición espaciada

Mismos valores por defecto que Anki:

- **Nuevas**: pasos de 1 y 10 minutos; con **Bien** al terminar los pasos pasa a 1 día, con **Fácil** directo a 4 días. 20 nuevas por día por mazo (se cambia en el detalle del mazo).
- **Repaso**: el intervalo se multiplica por la facilidad de la tarjeta (empieza en 250 %). **Difícil** ×1,2 y baja la facilidad, **Fácil** suma un 30 % y la sube.
- **Fallo**: la tarjeta vuelve a aprendizaje (10 minutos), baja la facilidad y su intervalo vuelve a 1 día.
- El día de estudio cambia a las 4 de la mañana. Los intervalos largos llevan un poco de azar para no amontonar repasos.

Con alternativas, la app sabe si acertaste: un error cuenta siempre como **Otra vez**. En las tarjetas de respuesta libre te calificas tú (si escribes la respuesta y coincide, te lo indica).

Atajos de teclado: `A`–`D` o `1`–`4` para elegir, `Espacio` para **Bien** o continuar, `1`–`4` para calificar.

## Plugin de ZenBan

MemoSpark funciona también como objeto del lienzo de ZenBan:

1. En ZenBan: ⚙️ Configuración › Plugins › pega `https://mindsparkapps.github.io/memospark/` › Agregar.
2. Botón derecho en el lienzo › Agregar aquí › MemoSpark.

Dentro de ZenBan la ventana va aislada, así que sus mazos y su progreso se guardan **dentro del objeto** y se sincronizan con el Drive de ZenBan (no usa la cuenta de Google de MemoSpark). Cada objeto tiene sus propios mazos. En un tablero de solo lectura se puede estudiar, pero no se guarda.

- `zenban-plugin.json`: nombre, ícono y tamaño del plugin.
- `zenban-plugin-sdk.js`: copia del SDK de ZenBan.

## Cuenta de Google y sincronización

- Funciona sin conexión y sin iniciar sesión: los datos se guardan al instante en el dispositivo (IndexedDB).
- Con **Iniciar sesión** los datos se guardan también en la carpeta oculta de la app en tu Google Drive (`memospark-data.json`), así que son los mismos en el PC y en el celular. Se combinan registro por registro (mazos, tarjetas, progreso de cada tarjeta y conteo de cada día).
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
