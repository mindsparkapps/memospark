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

// Instrucciones para pedirle 10 PRUEBAS de una asignatura (alternativas, con tiempo) a una IA con el temario cargado (p. ej. un cuaderno de NotebookLM).
// [ASIGNATURA] y [MATERIAL] los reemplaza promptPrueba() en pruebas.js. El formato de cada archivo es el que lee PruebaMD.
window.MEMOSPARK_PRUEBA = `ASIGNATURA: [ASIGNATURA]
Material de estudio en que se basan las pruebas: [MATERIAL]

Necesito 10 pruebas de alternativas (selección múltiple) formateadas para la app MemoSpark sobre la asignatura indicada arriba, basándote en el temario oficial cargado en el cuaderno y los videos/materiales correspondientes.

Instrucciones de parámetros desde el temario:
- Revisa el temario oficial cargado para esta asignatura y extrae la cantidad exacta de preguntas por prueba que especifica el documento.
- Extrae el tiempo oficial asignado para rendir la prueba desde el temario.
- Cada una de las 10 pruebas debe cubrir de forma integral todo el temario y los videos/materiales de la asignatura.

Formato de entrega:
- Cada prueba debe quedar en un archivo Markdown (.md) independiente con el nombre \`prueba_[nombre_asignatura]_[numero].md\` (ejemplo: \`prueba_matematicas_1.md\`).

Estructura y reglas EXACTAS para cada archivo Markdown (.md):

1. La primera línea del archivo debe ser \`# Prueba: [Nombre descriptivo de la asignatura - Prueba N° X]\`.
2. La segunda línea debe ser \`Tiempo: [Tiempo en minutos extraído del temario]\`.
3. Una o dos líneas opcionales con una descripción general de la prueba.
4. Las preguntas deben estar numeradas explícitamente en el encabezado (ejemplo: \`## 1. ¿Enunciado de la pregunta?\`, \`## 2. ¿Enunciado de la pregunta?\`) hasta completar el total de preguntas que indica el temario. NO incluyas etiquetas genéricas tipo "(Test 1)".
5. Cada pregunta debe tener exactamente 4 alternativas plausibles y de longitud similar:
   - [x] Alternativa correcta
   - [ ] Alternativa incorrecta
   - [ ] Alternativa incorrecta
   - [ ] Alternativa incorrecta
   (Una sola alternativa correcta. NO utilices "todas las anteriores" ni "ninguna de las anteriores").
6. Inmediatamente después de las alternativas, incluye exactamente estas tres líneas:
   Tema: [Nombre corto de la unidad o concepto, repetido exactamente igual en preguntas del mismo tema]
   Referencia: [Título del video/clase con minuto si aplica, o sección/página del temario]
   Explicación: [Justificación clara de 1 a 2 frases de por qué la alternativa elegida es la correcta]

Genera los 10 archivos de forma completa y respetando estrictamente el formato Markdown para MemoSpark.`;
