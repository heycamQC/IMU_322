//* =======================================================
// *library.js — FOR / WHILE / DO...WHILE (Movisionary)
// * Funciones reales para catálogo audiovisual
// * - FOR: renderiza filas por lote desde un arreglo
// * - WHILE: "Cargar más" agrega hasta completar el lote
// * - DO...WHILE: sugerencias aleatorias sin repetición
// *=======================================================

document.addEventListener("DOMContentLoaded", () => {
  //!EVENTO 1: DOMContentLoaded
  // !Este evento asegura que todo el HTML esté cargado antes de ejecutar el script.
  // !Forma parte de los criterios "captura de eventos con addEventListener".

  // Datos: pelis y series "no tan mainstream"
  // t= título, tipo= Película/Serie, y= año, g= género, r= rating (0-10)
  const TITULOS = [
    { t: "Luz de Altura",             tipo: "Película", y: 2024, g: "Drama",        r: 8.1 },
    { t: "Sendero de Sal",            tipo: "Película", y: 2019, g: "Aventura",     r: 7.4 },
    { t: "Estación Puente",           tipo: "Serie",    y: 2021, g: "Thriller",     r: 8.0 },
    { t: "Río Inverso",               tipo: "Película", y: 2020, g: "Fantasía",     r: 7.2 },
    { t: "Barrio Neblina",            tipo: "Serie",    y: 2022, g: "Noir",         r: 8.5 },
    { t: "Cables a Medianoche",       tipo: "Película", y: 2018, g: "Ciencia Ficción", r: 7.0 },
    { t: "Mapa de Voces",             tipo: "Película", y: 2025, g: "Documental",   r: 8.7 },
    { t: "Último Turno",              tipo: "Serie",    y: 2023, g: "Suspenso",     r: 7.9 },
    { t: "Casa en Espiral",           tipo: "Película", y: 2021, g: "Psicológico",  r: 7.6 },
    { t: "Kilómetro 13",              tipo: "Serie",    y: 2020, g: "Crimen",       r: 7.8 },
    { t: "Cielo Partido",             tipo: "Película", y: 2019, g: "Romance",      r: 6.9 },
    { t: "Ruido Blanco",              tipo: "Serie",    y: 2024, g: "Misterio",     r: 8.3 }
  ];
  const BATCH = 2;           // filas por clic
  let cursor = 0;            // índice del próximo ítem a pintar

  const $rows = document.getElementById("lib-rows");
  const $more = document.getElementById("btn-more");
  const $sug  = document.getElementById("lib-suggest");

  if (!$rows || !$more || !$sug) return;

  // -------------------------------------------------------
  //* FOR → genera 'count' filas a partir del índice 'from'
  // - Usa DocumentFragment para evitar reflows múltiples
  // -------------------------------------------------------
  function renderBatch(from, count){
    const to = Math.min(from + count, TITULOS.length);
    const frag = document.createDocumentFragment();

    for (let i = from; i < to; i++){
      const it = TITULOS[i];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${it.t}</td>
        <td>${it.tipo}</td>
        <td>${it.y}</td>
        <td>${it.g}</td>
        <td>${it.r.toFixed(1)}</td>
      `;
      frag.appendChild(tr);
    }

    $rows.appendChild(frag);
    cursor = to; // avanza exactamente 'count'
  }

  // -------------------------------------------------------
  //* WHILE → "Cargar más"
  // - Agrega elementos de a 1 hasta completar un lote (BATCH)
  //   o hasta que no queden más por mostrar.
  // - Deja el botón en "No hay más" cuando termina.
  // -------------------------------------------------------
  function onMore(){
    $more.disabled = true; // evita doble clic durante el render

    let pintados = 0;
    while (pintados < BATCH && cursor < TITULOS.length){
      renderBatch(cursor, 1); // reusa FOR; pinta 1 por vuelta
      pintados++;
    }

    if (cursor >= TITULOS.length){
      $more.textContent = "No hay más";
    } else {
      $more.disabled = false;
    }
  }

  // -------------------------------------------------------
  // *DO...WHILE → sugerencias aleatorias sin repetición
  // - Garantiza al menos 1 sugerencia.
  // -------------------------------------------------------
  function renderSuggestions(n = 3) {
    const picks = new Set();
    do {
      const r = Math.floor(Math.random() * TITULOS.length);
      picks.add(r);
    } while (picks.size < Math.min(n, TITULOS.length));

    const frag = document.createDocumentFragment();
    picks.forEach(i => {
      const it = TITULOS[i];
      const div = document.createElement("div");
      div.className = "mini";
      div.innerHTML = `
        <strong>${it.t}</strong><br>
        <span class="muted">${it.tipo} · ${it.g} · ${it.y} · ⭐ ${it.r.toFixed(1)}</span>
      `;
      frag.appendChild(div);
    });
    $sug.innerHTML = "";
    $sug.appendChild(frag);
  }

  // ===== Inicio =====
  renderBatch(0, BATCH);          // FOR: primeras filas
  renderSuggestions(3);           // DO...WHILE: sugerencias

  // ! EVENTO 2: CLICK
  // !Captura de evento 'click' en el botón "Cargar más" usando addEventListener.
  // !Este evento activa la función onMore() → acción observable: muestra nuevas filas.
  $more.addEventListener("click", onMore, { passive: true });

  $sug.addEventListener("mouseover", () => $sug.style.boxShadow = "0 0 10px var(--brand1)");
  $sug.addEventListener("mouseout",  () => $sug.style.boxShadow = "");
});
