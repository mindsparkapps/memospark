# Formato de mazos de MemoSpark

Un mazo es un archivo Markdown (`.md`). Puedes escribirlo a mano o pedírselo a cualquier IA (ChatGPT, Claude, Gemini…) con las instrucciones de abajo. En la app, la pestaña **Crear con IA** arma esas instrucciones con tu tema y las copia con un botón.

## Ejemplo

```markdown
# Capitales de Europa

Descripción opcional del mazo.

## ¿Cuál es la capital de Francia?

![Torre Eiffel](https://commons.wikimedia.org/wiki/Special:FilePath/Tour_Eiffel_Wikimedia_Commons.jpg?width=400)

- [x] París
- [ ] Lyon
- [ ] Marsella
- [ ] Burdeos

París es la capital y la ciudad más poblada de Francia.

## ¿Qué países usan el euro?

- [x] España
- [ ] Suiza
- [x] Grecia
- [ ] Noruega

## ¿Cuál es la capital de Polonia?

Respuesta: Varsovia
```

Hay un mazo completo en [ejemplos/capitales-de-europa.md](ejemplos/capitales-de-europa.md).

## Reglas

| Línea | Significa |
|---|---|
| `# Nombre` | Empieza un mazo. Puede haber varios en un mismo archivo. |
| texto bajo `# Nombre` | Descripción del mazo (opcional). |
| `## Pregunta` | Empieza una tarjeta. Las líneas siguientes (texto, código, listas, imágenes) también son parte de la pregunta. |
| `- [x] texto` | Alternativa correcta. Si hay varias, hay que marcarlas todas para acertar. |
| `- [ ] texto` | Alternativa incorrecta. Las alternativas se muestran en orden al azar. |
| `Respuesta: texto` | En vez de alternativas: tarjeta de respuesta libre. Se escribe la respuesta; no importan mayúsculas, tildes ni signos y se acepta un error de tipeo. Varias formas válidas: `Respuesta: Varsovia / Warszawa`. |
| texto después de las alternativas | Explicación que aparece al dar vuelta la tarjeta. |
| `![texto](dirección)` | Imagen. Dirección pública (lo más seguro: `https://commons.wikimedia.org/wiki/Special:FilePath/ARCHIVO.jpg?width=400`) o el nombre de un archivo que eliges junto al `.md` al importar. |

También se puede usar **negrita**, *cursiva*, `código`, bloques de código y enlaces.

## Tipos de respuesta (modos)

Un mazo puede ofrecer varias formas de mostrar las respuestas, para elegir antes de estudiar. Bajo el título se agrega una línea `Modos:` con los nombres separados por `|`, y cada alternativa trae una versión por modo separada por `||`:

```markdown
# Servicios de AWS

Modos: Solo el nombre | Nombre y para qué sirve

## ¿Qué servicio de AWS es este?

![ícono](https://icon.icepanel.io/AWS/svg/Compute/EC2.svg)

- [x] Amazon EC2 || **Amazon EC2** — servidores virtuales
- [ ] AWS Lambda || **AWS Lambda** — funciones sin servidores
```

- Al tocar **Estudiar** la app pregunta qué tipo usar y lo recuerda para la próxima vez (también se cambia en el detalle del mazo). El progreso de cada tarjeta es el mismo en todos los modos.
- Si una alternativa no trae `||`, se muestra igual en todos los modos.
- En `Respuesta: corta || larga`, lo que escribes se compara siempre con la versión corta.
- Si varias tarjetas tienen la misma pregunta y solo cambia la imagen (como «¿Qué servicio es este?»), cada una se distingue por su imagen.

Hay un mazo completo con modos en [ejemplos/aws-arquitecto.md](ejemplos/aws-arquitecto.md).

## Volver a importar

Cada tarjeta se identifica por el nombre del mazo y el texto de su pregunta (sin contar las imágenes). Si corriges o amplías un mazo y lo importas de nuevo:

- las preguntas que no cambiaron conservan su progreso,
- las nuevas se agregan,
- las que ya no están se quitan.

Con **Copiar para la IA** (en el detalle de un mazo) copias el mazo en este formato para pedirle a una IA que lo amplíe o lo corrija.

## Instrucciones para la IA

Reemplaza lo que está entre corchetes y pégalo en la IA:

```text
Necesito un mazo de tarjetas de estudio para la app MemoSpark sobre: [TEMA]
Cantidad de tarjetas: [NÚMERO, por ejemplo 30]. Nivel: [por ejemplo, 3.º medio / universitario / principiante].

Responde SOLO con el contenido de un archivo Markdown (.md) que siga EXACTAMENTE este formato:

# Nombre del mazo

Una o dos líneas que describan el mazo (opcional).

## Texto de la pregunta (una línea)

Texto adicional opcional de la pregunta: contexto, código, una lista o una imagen
![descripción de la imagen](https://dirección-pública-de-la-imagen.jpg)

- [x] Alternativa correcta
- [ ] Alternativa incorrecta
- [ ] Alternativa incorrecta
- [ ] Alternativa incorrecta

Explicación breve que se muestra al dar vuelta la tarjeta (opcional, pero recomendada).

## Pregunta de respuesta libre (sin alternativas)

Respuesta: la respuesta correcta en una línea

Explicación opcional.

Reglas:
1. Cada mazo empieza con una línea "# Nombre". Puede haber varios mazos en el mismo archivo.
2. Cada tarjeta empieza con una línea "## " seguida de la pregunta.
3. Las alternativas son líneas "- [x] " (correcta) o "- [ ] " (incorrecta). Usa 4 alternativas por tarjeta, todas plausibles y de largo parecido. Si hay más de una correcta, márcalas todas con [x].
4. Para preguntas sin alternativas, usa una línea "Respuesta: …" en lugar de las alternativas. Hay que escribir esa respuesta para acertar, así que debe ser corta (una a tres palabras) y exacta. Si se aceptan varias formas, sepáralas con " / " (por ejemplo: Respuesta: Varsovia / Warszawa).
5. Todo lo que vaya después de las alternativas (o de "Respuesta:") es la explicación.
6. Se permite Markdown: **negrita**, *cursiva*, `código`, bloques ```, listas y enlaces.
7. Imágenes: ![texto](dirección). Usa solo imágenes públicas. Lo más seguro es Wikimedia Commons con esta forma: https://commons.wikimedia.org/wiki/Special:FilePath/NOMBRE_DEL_ARCHIVO.jpg?width=400 (con el nombre exacto de un archivo que exista en Commons). Si no estás seguro de que la imagen existe, no pongas imagen. También vale el nombre de un archivo (por ejemplo ![mapa](mapa.png)) si yo voy a cargar esa imagen junto al .md.
8. Una idea por tarjeta, preguntas claras y sin ambigüedad; no repitas preguntas.
9. No escribas nada fuera del formato (ni saludos ni comentarios).
10. Opcional, solo si lo pido: varios tipos de respuesta para elegir antes de estudiar. Bajo el título del mazo agrega una línea "Modos: Nombre del tipo 1 | Nombre del tipo 2" y escribe cada alternativa (y cada "Respuesta:") con una versión por tipo separadas por " || ", en el mismo orden. Ejemplo: "- [x] Amazon S3 || **Amazon S3** — almacenamiento de objetos".
```

Si cambias el formato, actualiza también `formato.js` (es el mismo texto que copia la app).
