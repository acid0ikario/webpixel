/* ============================================================
   pixels. — site behavior
   Menu, ES/EN language toggle, scroll reveal.
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

  /* ----------------------------------------------------------
     i18n — [es, en] for every key, mirrored from the handoff.
     ---------------------------------------------------------- */
  var I18N = {
    nav_nosotros: ['Nosotros', 'About'],
    nav_servicios: ['Servicios', 'Services'],
    nav_portafolio: ['Portafolio', 'Portfolio'],
    nav_planes: ['Planes', 'Plans'],
    nav_cta: ['Empezar', 'Get started'],
    hero_badge: ['Publicidad + Desarrollo de software', 'Advertising + Software development'],
    hero_t1: ['Creamos ideas que generan ', 'We create ideas that generate '],
    hero_t2: ['GRANDES', 'BIG'],
    hero_t3: [' negocios', ' business'],
    hero_sub: ['Cumplimos los objetivos comerciales de nuestros clientes con un enfoque creativo y tecnológicamente moderno.', 'We meet our clients’ business goals with a creative, technologically modern approach.'],
    hero_cta1: ['¿Cuándo empezamos?', 'When do we start?'],
    hero_cta2: ['Ver servicios', 'See services'],
    can_hint: ['Arrastra para girar', 'Drag to rotate'],
    about_label: ['Nosotros', 'About us'],
    about_h2: ['Tu aliado estratégico a largo plazo', 'Your long-term strategic ally'],
    mision_t: ['Misión', 'Mission'],
    mision_p: ['Cumplir los objetivos comerciales de nuestros clientes con un enfoque creativo y tecnológicamente moderno.', 'Meet our clients’ business objectives with a creative and technologically modern approach.'],
    vision_t: ['Visión', 'Vision'],
    vision_p: ['Ser aliado estratégico de nuestros clientes a largo plazo.', 'Be our clients’ long-term strategic ally.'],
    pillar1_p: ['Equipo multidisciplinario que trabaja en pro de tu marca.', 'A multidisciplinary team working for your brand.'],
    pillar2_t: ['Portafolio integral', 'Full-range portfolio'],
    pillar2_p: ['Múltiples soluciones para diferentes medios publicitarios.', 'Multiple solutions across advertising media.'],
    pillar3_t: ['Innovación', 'Innovation'],
    pillar3_p: ['Pensamos fuera de la caja, usando la tecnología como un boost de la creatividad.', 'We think outside the box, using technology as a boost for creativity.'],
    pillar4_t: ['Regionalización', 'Regional reach'],
    pillar4_p: ['Contamos con clientes desde USA hasta Panamá.', 'We serve clients from the USA to Panama.'],
    serv_label: ['Servicios', 'Services'],
    serv_h2: ['Soluciones para cada medio y cada objetivo', 'Solutions for every medium and every goal'],
    serv_sub: ['Cada campaña es una estrategia hecha a la medida: integramos ATL, BTL, social media y tecnología.', 'Every campaign is a tailor-made strategy: we integrate ATL, BTL, social media and technology.'],
    s1_t: ['Social Media', 'Social Media'],
    s1_p: ['Captamos la atención de tu público en las diferentes redes sociales. Un gran reto, pero con creatividad todo es posible.', 'We capture your audience’s attention across social networks. A big challenge — but with creativity, everything is possible.'],
    s2_t: ['Campañas 360º', '360º Campaigns'],
    s2_p: ['Estrategias a la medida que integran medios tradicionales y nuevos canales de comunicación.', 'Tailor-made strategies integrating traditional media and new communication channels.'],
    s3_t: ['Webinars', 'Webinars'],
    s3_p: ['Transformamos educación en ventas: atrae, educa y convierte prospectos en clientes.', 'We turn education into sales: attract, educate and convert prospects into clients.'],
    s4_t: ['Chatbot IA', 'AI Chatbot'],
    s4_p: ['Atención automatizada 24/7 que convierte el interés en ventas, con embudos y seguimiento de leads.', '24/7 automated attention that turns interest into sales, with funnels and lead follow-up.'],
    s5_t: ['Impresión y DOOH', 'Print & DOOH'],
    s5_p: ['Impresión en pequeño y GRAN formato, y publicidad exterior digital para una diferenciación visual.', 'Small and LARGE format printing, plus digital out-of-home for visual differentiation.'],
    s6_t: ['Desarrollo de software', 'Software development'],
    s6_p: ['Usamos la tecnología como un boost de la creatividad: web, automatización y herramientas a la medida.', 'We use technology as a creativity boost: web, automation and custom tools.'],
    port_label: ['Portafolio', 'Portfolio'],
    port_h2: ['Marcas que confían en nosotros', 'Brands that trust us'],
    port_p: ['Clientes desde USA hasta Panamá, en retail, industria, servicios y más.', 'Clients from the USA to Panama, in retail, industry, services and more.'],
    plan_label: ['Planes', 'Plans'],
    plan_h2: ['Ni caro, ni barato… rentable', 'Not cheap, not expensive… profitable'],
    plan_p: ['Paquetes pensados para generar leads y ventas. El presupuesto de pauta es aparte del fee mensual.', 'Packages built to generate leads and sales. Ad spend is separate from the monthly fee.'],
    pl1_p: ['Tráfico y conversión digital con un embudo completo.', 'Digital traffic and conversion with a complete funnel.'],
    pl1_b1: ['TikTok: contenido optimizado para alcance masivo orgánico', 'TikTok: content optimized for massive organic reach'],
    pl1_b2: ['Meta Ads: consideración y remarketing', 'Meta Ads: consideration and remarketing'],
    pl1_b3: ['Google Ads: intención de compra', 'Google Ads: purchase intent'],
    pl1_b4: ['Pauta mensual sugerida de $200 (aparte del fee)', 'Suggested $200 monthly ad spend (separate from fee)'],
    pl2_p: ['Eventos digitales de alto impacto para generar leads calificados.', 'High-impact digital events that generate qualified leads.'],
    pl2_b1: ['Concepto, estructura y material gráfico del webinar', 'Webinar concept, structure and graphic material'],
    pl2_b2: ['Campaña de convocatoria y chatbot de captación', 'Promotion campaign and lead-capture chatbot'],
    pl2_b3: ['Soporte técnico integral en vivo', 'Full live technical support'],
    pl2_b4: ['Seguimiento post-webinar, reportería y métricas', 'Post-webinar follow-up, reporting and metrics'],
    plan_pop: ['Popular', 'Popular'],
    pl3_p: ['Ventas 24/7: automatiza la atención y convierte prospectos en clientes.', '24/7 sales: automate attention and convert prospects into clients.'],
    price_mo: ['/mes', '/mo'],
    pl3_b1: ['Licencia de plataforma y configuración personalizada', 'Platform license and custom configuration'],
    pl3_b2: ['Embudo de ventas automatizado', 'Automated sales funnel'],
    pl3_b3: ['Seguimiento de leads y remarketing enfocado en ventas', 'Lead follow-up and sales-focused remarketing'],
    pl3_b4: ['Reportería y métricas clave', 'Reporting and key metrics'],
    pl4_t: ['Eventos', 'Events'],
    pl4_p: ['Presencia estratégica donde ya existe intención comercial.', 'Strategic presence where commercial intent already exists.'],
    pl4_b1: ['Identificación de espacios y gestión de participación', 'Venue identification and participation management'],
    pl4_b2: ['Activación de marca en el evento', 'Brand activation at the event'],
    pl4_b3: ['Captación de leads y seguimiento comercial', 'Lead capture and commercial follow-up'],
    pl4_b4: ['Reporte de resultados y oportunidades', 'Results and opportunity reporting'],
    price_custom: ['A la medida', 'Custom'],
    price_custom2: ['A la medida', 'Custom'],
    price_custom3: ['A la medida', 'Custom'],
    plan_cta: ['Cotizar', 'Get a quote'],
    plan_cta2: ['Cotizar', 'Get a quote'],
    plan_cta3: ['Empezar ahora', 'Start now'],
    plan_cta4: ['Cotizar', 'Get a quote'],
    faq_h2: ['Preguntas frecuentes', 'Frequently asked questions'],
    f1_q: ['¿La pauta publicitaria está incluida en el fee mensual?', 'Is ad spend included in the monthly fee?'],
    f1_a: ['No, el presupuesto de pauta es aparte del fee mensual. Así puedes escalar la inversión publicitaria según los resultados.', 'No — the ad budget is separate from the monthly fee, so you can scale your investment based on results.'],
    f2_q: ['¿En qué plataformas trabajan?', 'Which platforms do you work with?'],
    f2_a: ['TikTok, Meta, Google Ads, LinkedIn y Spotify Ads, además de medios tradicionales, impresión y publicidad exterior. Más puntos de contacto = más oportunidades de venta.', 'TikTok, Meta, Google Ads, LinkedIn and Spotify Ads, plus traditional media, print and out-of-home. More touchpoints = more sales opportunities.'],
    f3_q: ['¿Trabajan fuera de El Salvador?', 'Do you work outside El Salvador?'],
    f3_a: ['Sí. Contamos con clientes desde USA hasta Panamá y adaptamos cada estrategia a su mercado.', 'Yes. We serve clients from the USA to Panama, adapting each strategy to its market.'],
    f4_q: ['¿Los precios incluyen IVA?', 'Do prices include VAT?'],
    f4_a: ['Los precios se muestran sin IVA; el impuesto se detalla aparte en cada propuesta.', 'Prices are shown without VAT; the tax is itemized separately in each proposal.'],
    f5_q: ['¿Cómo empezamos?', 'How do we start?'],
    f5_a: ['Escríbenos y agendamos una reunión para conocer tus objetivos. En la primera semana recibes una propuesta hecha a la medida.', 'Write to us and we’ll schedule a meeting to learn your goals. Within the first week you get a tailor-made proposal.'],
    cta_h2: ['¿Cuándo empezamos?', 'When do we start?'],
    cta_p: ['Cuéntanos tus objetivos comerciales y te proponemos una estrategia rentable, hecha a la medida.', 'Tell us your business goals and we’ll propose a profitable, tailor-made strategy.'],
    cta_btn: ['Escríbenos — www.padsv.com', 'Write to us — www.padsv.com'],
    foot_tag: ['Creamos ideas que generan GRANDES negocios.', 'We create ideas that generate BIG business.'],
    foot_nosotros: ['Nosotros', 'About'],
    foot_servicios: ['Servicios', 'Services'],
    foot_planes: ['Planes', 'Plans']
  };

  var TITLE = {
    es: 'pixels. — Creamos ideas que generan GRANDES negocios',
    en: 'pixels. — We create ideas that generate BIG business'
  };

  var lang = 'es';
  var langBtn = document.getElementById('langToggle');

  function applyLang(next) {
    var i = next === 'en' ? 1 : 0;

    Object.keys(I18N).forEach(function (key) {
      var els = document.querySelectorAll('[data-i18n="' + key + '"]');
      for (var n = 0; n < els.length; n++) els[n].textContent = I18N[key][i];
    });

    lang = next;
    document.documentElement.lang = next;
    document.title = TITLE[next];

    // The pill shows the language you'd switch *to*, not the current one.
    langBtn.textContent = next === 'es' ? 'EN' : 'ES';
    langBtn.setAttribute('aria-label', next === 'es' ? 'Switch to English' : 'Cambiar a español');
  }

  langBtn.addEventListener('click', function () {
    applyLang(lang === 'es' ? 'en' : 'es');
  });

  /* ----------------------------------------------------------
     mobile menu
     ---------------------------------------------------------- */
  var menu = document.getElementById('mobileMenu');
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');

  function setMenu(open) {
    menu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menuClose.focus();
    else menuToggle.focus();
  }

  menuToggle.addEventListener('click', function () { setMenu(menu.hidden); });
  menuClose.addEventListener('click', function () { setMenu(false); });

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) setMenu(false);
  });

  // Resizing past the breakpoint hides the overlay via CSS; unlock scroll to match.
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
    if (e.matches && !menu.hidden) setMenu(false);
  });

  /* ----------------------------------------------------------
     scroll reveal
     ---------------------------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal]');

  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    targets.forEach(function (el) {
      el.style.setProperty('--reveal-i', el.getAttribute('data-reveal') || '0');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }
})();
