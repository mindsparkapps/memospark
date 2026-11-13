// ===== MemoSpark - Instrucciones del formato para pedirle un mazo a cualquier IA =====
// El mismo texto está en FORMATO.md. Si cambias el formato, actualiza los dos.
window.MEMOSPARK_FORMATO = `Necesito un mazo de tarjetas de estudio para la app MemoSpark sobre: [TEMA]
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
6. Se permite Markdown: **negrita**, *cursiva*, \`código\`, bloques \`\`\`, listas y enlaces.
7. Imágenes: ![texto](dirección). Usa solo imágenes públicas. Lo más seguro es Wikimedia Commons con esta forma: https://commons.wikimedia.org/wiki/Special:FilePath/NOMBRE_DEL_ARCHIVO.jpg?width=400 (con el nombre exacto de un archivo que exista en Commons). Si no estás seguro de que la imagen existe, no pongas imagen. También vale el nombre de un archivo (por ejemplo ![mapa](mapa.png)) si yo voy a cargar esa imagen junto al .md.
8. Una idea por tarjeta, preguntas claras y sin ambigüedad; no repitas preguntas.
9. No escribas nada fuera del formato (ni saludos ni comentarios).
10. Opcional, solo si lo pido: varios tipos de respuesta para elegir antes de estudiar. Bajo el título del mazo agrega una línea "Modos: Nombre del tipo 1 | Nombre del tipo 2" y escribe cada alternativa (y cada "Respuesta:") con una versión por tipo separadas por " || ", en el mismo orden. Ejemplo: "- [x] Amazon S3 || **Amazon S3** — almacenamiento de objetos".
11. Opcional, solo si lo pido: glosario de siglas. Bajo el título del mazo agrega una línea por sigla con el formato "Sigla: S3 = Simple Storage Service". En las tarjetas, esas siglas salen subrayadas y al tocarlas se ve su significado. Si además agregas un tipo de respuesta cuyo nombre empiece con "Sigla" (por ejemplo "Modos: Solo el nombre | Sigla y significado"), ese tipo muestra la sigla del servicio correcto de cada tarjeta y hay que escribir su significado.`;

// Instrucciones para pedirle una PRUEBA (alternativas, con tiempo) a cualquier IA. Mismo texto en FORMATO.md.
window.MEMOSPARK_PRUEBA = `Necesito una prueba de alternativas (selección múltiple) para la app MemoSpark sobre: [TEMA]
Cantidad de preguntas: [NÚMERO]. Nivel: [NIVEL]. Tiempo para rendirla: [MINUTOS] minutos.
Material de estudio en que se basa la prueba: [MATERIAL]

Responde SOLO con el contenido de un archivo Markdown (.md) que siga EXACTAMENTE este formato:

# Prueba: Nombre de la prueba

Tiempo: [MINUTOS] min

Una o dos líneas que describan la prueba (opcional).

## Enunciado de la pregunta (una línea)

Texto adicional opcional: contexto, datos, código o una imagen
![descripción de la imagen](https://dirección-pública-de-la-imagen.jpg)

- [x] Alternativa correcta
- [ ] Alternativa incorrecta
- [ ] Alternativa incorrecta
- [ ] Alternativa incorrecta

Tema: unidad o tema al que pertenece la pregunta
Referencia: dónde encontrar la respuesta para repasar
Explicación: por qué esa alternativa es la correcta (una o dos frases).

Reglas:
1. La primera línea es "# Prueba: Nombre". Después va la línea "Tiempo: N min" (minutos para rendir la prueba completa).
2. Cada pregunta empieza con una línea "## " seguida del enunciado.
3. Cada pregunta tiene 4 alternativas: "- [x] " (correcta) o "- [ ] " (incorrecta). Una sola correcta, salvo que el enunciado diga "marca todas las correctas". Alternativas plausibles y de largo parecido; no uses "todas las anteriores" ni "ninguna de las anteriores".
4. Después de las alternativas van tres líneas: "Tema:", "Referencia:" y "Explicación:".
5. "Tema:" es un nombre corto de la unidad o concepto (por ejemplo "Factorización"). Repite exactamente el mismo nombre en las preguntas del mismo tema: así la app agrupa los errores por tema.
6. "Referencia:" dice dónde se encuentra la respuesta en el material, para que el alumno pueda repasar:
   - Video de YouTube: el título y el minuto, por ejemplo: Video «Ecuaciones de segundo grado» — minuto 12:30 (o el tramo 12:30–14:10). Si conoces la dirección del video, agrégala con el segundo de inicio: https://youtu.be/ID?t=750
   - Libro, apuntes o PDF: nombre, capítulo y página, por ejemplo: Apuntes de Física, capítulo 3, p. 45.
   - Sitio web: la dirección y la sección.
   Si no conoces el minuto, la página o la dirección exactos, NO los inventes: indica solo el tema o la sección donde se estudia.
7. Preguntas claras y sin ambigüedad, mezclando dificultad. No repitas preguntas.
8. Se permite Markdown: **negrita**, *cursiva*, \`código\`, bloques \`\`\`, listas. Imágenes solo públicas (Wikimedia Commons: https://commons.wikimedia.org/wiki/Special:FilePath/NOMBRE.jpg?width=400); si no estás seguro de que existe, no pongas imagen.
9. No escribas nada fuera del formato (ni saludos ni comentarios).`;
