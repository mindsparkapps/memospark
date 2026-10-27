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
4. Para preguntas sin alternativas, usa una línea "Respuesta: …" en lugar de las alternativas.
5. Todo lo que vaya después de las alternativas (o de "Respuesta:") es la explicación.
6. Se permite Markdown: **negrita**, *cursiva*, \`código\`, bloques \`\`\`, listas y enlaces.
7. Imágenes: ![texto](dirección). Usa solo imágenes públicas. Lo más seguro es Wikimedia Commons con esta forma: https://commons.wikimedia.org/wiki/Special:FilePath/NOMBRE_DEL_ARCHIVO.jpg?width=400 (con el nombre exacto de un archivo que exista en Commons). Si no estás seguro de que la imagen existe, no pongas imagen. También vale el nombre de un archivo (por ejemplo ![mapa](mapa.png)) si yo voy a cargar esa imagen junto al .md.
8. Una idea por tarjeta, preguntas claras y sin ambigüedad; no repitas preguntas.
9. No escribas nada fuera del formato (ni saludos ni comentarios).`;
