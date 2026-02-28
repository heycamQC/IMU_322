

// ———————————————————————————————
// 1 Alternar tema (oscuro / claro)
// ———————————————————————————————
(function () {
  const STORAGE_KEY = 'pref-theme';
  const CLASS_LIGHT = 'theme-light';
  const BTN_ID = 'toggle-theme';

  const systemPrefersLight = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  function applyTheme(mode) {
    const isLight = mode === 'light';
    document.body.classList.toggle(CLASS_LIGHT, isLight);

    const btn = document.getElementById(BTN_ID);
    if (btn) {
      btn.textContent = isLight ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
    }
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return systemPrefersLight() ? 'light' : 'dark';
  }

  function initTheme() {
    const current = getInitialTheme();
    applyTheme(current);
    
    //! EVENTO 1: click
    const btn = document.getElementById(BTN_ID);
    if (btn) {
      btn.addEventListener('click', () => {
        const next = document.body.classList.contains(CLASS_LIGHT) ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      });
    }

    //! EVENTO 2: storage, toma en cuenta los cambios entre las pestanas
    // sincroniza entre pestañas
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue);
      }
    });
  }

  //! EVENTO 3: DOMContentLoaded
  // !Inicializa el sistema de tema al cargar el DOM.
  document.addEventListener('DOMContentLoaded', initTheme);
})();



// ?=========================================================
// ?IF:  Saludo dinámico pagina inicio
// ?======================================================
export function showGreeting() {
  const greeting = document.getElementById('greeting');
  if (!greeting) return; 

  const hour = new Date().getHours();
  let message;

  if (hour >= 6 && hour < 12) {
    message = "🎬 ¡Buenos días, cinéfil@!";
  } else if (hour >= 12 && hour < 18) {
    message = "🍿 Buenas tardes, disfruta de un maratón.";
  } else if (hour >= 18 && hour < 24) {
    message = "🌙 Buenas noches, hora de una buena película.";
  } else {
    message = "😴 ¿Aún despiert@? Perfecto para un clásico nocturno.";
  }

  greeting.textContent = message;
  
}
//! EVENTO 4: DOMContentLoaded
document.addEventListener('DOMContentLoaded', showGreeting);

// ?=======================================================
// ?SWITCH: Mensaje del día en la sección Noticias
// ?==========================================================

(function () {
  const el = document.getElementById("news-msg");
  if (!el) return; // solo ejecuta si existe ese elemento

  const dia = new Date().getDay(); // 0=Domingo, 6=Sábado
  let mensaje;

  switch (dia) {
    case 0:
      mensaje = "🌞 Domingo de descanso: aprovecha para ver tus películas favoritas.";
      break;
    case 1:
      mensaje = "🎬 Lunes de estrenos: revisa las novedades de la semana.";
      break;
    case 2:
      mensaje = "🍿 Martes de recomendaciones: descubre críticas recientes.";
      break;
    case 3:
      mensaje = "📺 Miércoles de maratón: continúa tu serie favorita.";
      break;
    case 4:
      mensaje = "🎧 Jueves de podcast: análisis y curiosidades cinematográficas.";
      break;
    case 5:
      mensaje = "🎥 Viernes de estreno: no te pierdas los lanzamientos del fin de semana.";
      break;
    case 6:
      mensaje = "🎉 Sábado de palomitas: comparte una película con tus amigos.";
      break;
    default:
      mensaje = "🎞️ Disfruta del contenido audiovisual que más te gusta.";
  }

  el.textContent = mensaje;
})();


// ?==========================================================



//*MENU DINAMICO
  (function(){
    const btn = document.getElementById('nav-toggle');
    if (!btn) return;
    //! EVENTO 5: click
    btn.addEventListener('click', function(){
      const open = document.body.classList.toggle('nav-open');
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  })();


//=======================================================
// Noticias DATE: ultima actualización, fechas, ordenar y filtrar
// =======================================================
//! EVENTO 6: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const LOCALE = 'es-BO';
  const TZ = 'America/La_Paz';

  // ----- Última actualización (ahora) -----
  const lastUpdateEl = document.getElementById('news-last-update');
  if (lastUpdateEl) {
    const now = new Date();
    lastUpdateEl.dateTime = now.toISOString();
    lastUpdateEl.textContent = now.toLocaleString(LOCALE, {
      day:'2-digit', month:'long', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });
  }

  // ----- Tarjetas: fecha formateada -----
  const cards = Array.from(document.querySelectorAll('.news-card'));
  cards.forEach(card => {
    const pubStr = card.getAttribute('data-published');
    if (!pubStr) return;
    const pub = new Date(pubStr);

    const dateEl = card.querySelector('.news-date');
    const agoEl  = card.querySelector('.news-ago');

    if (dateEl) {
      dateEl.dateTime = pub.toISOString();
      dateEl.textContent = pub.toLocaleString(LOCALE, {
        timeZone: TZ,
        weekday:'long', day:'2-digit', month:'long', year:'numeric',
        hour:'2-digit', minute:'2-digit'
      });
    }
    if (agoEl) agoEl.textContent = timeAgo(pub); // ← sin prefijo '· '
  });

  // ----- Ordenar por fecha -----
  const sortSelect = document.getElementById('news-sort');
  if (sortSelect && cards.length) {
    const container = cards[0].parentElement;
    function sortCards(order){
      const sorted = [...cards].sort((a,b)=>{
        const da = new Date(a.getAttribute('data-published')).getTime();
        const db = new Date(b.getAttribute('data-published')).getTime();
        return order === 'asc' ? da - db : db - da;
      });
      sorted.forEach(c => container.appendChild(c));
    }
    //! EVENTO 7: change, cambia el orden de las noticias
    sortSelect.addEventListener('change', () => sortCards(sortSelect.value));
    sortCards(sortSelect.value);
  }

  // ----- Filtros (chips) -----
  const chips = Array.from(document.querySelectorAll('.filters .chip'));
  if (chips.length && cards.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');

        const f = chip.getAttribute('data-filter');
        cards.forEach(card => {
          const cat = card.getAttribute('data-cat') || 'all';
          card.style.display = (f === 'all' || cat === f) ? '' : 'none';
        });
      });
    });
  }

  // ----- Utilidad: tiempo relativo con singular/plural correcto -----
  function timeAgo(date){
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff/1000);
    const min = Math.floor(sec/60);
    const hr  = Math.floor(min/60);
    const day = Math.floor(hr/24);

    if (sec < 30) return 'hace unos segundos';
    if (sec < 60) return 'hace menos de 1 min';
    if (min < 60) return `hace ${min} min`;
    if (hr  < 24) return `hace ${hr} h`;
    if (day < 30) return `hace ${day} ${day===1 ? 'día' : 'días'}`;

    const months = Math.floor(day/30);
    if (months < 12) return `hace ${months} ${months===1 ? 'mes' : 'meses'}`;

    const years = Math.floor(months/12);
    return `hace ${years} ${years===1 ? 'año' : 'años'}`;
  }
});


