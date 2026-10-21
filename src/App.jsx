import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as SolidIcons from "@fortawesome/free-solid-svg-icons";

import * as RegularIcons from "@fortawesome/free-regular-svg-icons";

import "./App.css";

import Game from "./pages/Game";

const PRICES = {

  websites: { static: 1699, cms: 2499 },

  ecommerce: { basic: 3499, advanced: 4999 },

};



const formatPrice = (value) => new Intl.NumberFormat("pl-PL").format(value);

const GA_MEASUREMENT_ID = "G-F55QNQC2WF";

const COOKIE_CONSENT_KEY = "js_cookie_consent_v1";



function loadGoogleAnalytics() {

  if (document.getElementById("ga4-script")) return;

  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  window.gtag("js", new Date());

  window.gtag("config", GA_MEASUREMENT_ID);



  const script = document.createElement("script");

  script.id = "ga4-script";

  script.async = true;

  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  document.head.appendChild(script);

}



function CookieBanner({ onAccept, onReject, onSettings, onPrivacy }) {

  return (

    <div className="cookie-banner" role="dialog" aria-label="Ustawienia plików cookies">

      <div className="cookie-banner-copy">

        <span>COOKIES / PRYWATNOŚĆ</span>

        <p>Używam Google Analytics 4, aby anonimowo analizować ruch i ulepszać portfolio. Analityka uruchamia się dopiero po Twojej zgodzie.</p>

        <button type="button" className="cookie-text-link" onClick={onPrivacy}>Polityka prywatności →</button>

      </div>

      <div className="cookie-banner-actions">

        <button type="button" onClick={onReject}>ODRZUĆ</button>

        <button type="button" onClick={onSettings}>USTAWIENIA</button>

        <button type="button" className="cookie-primary" onClick={onAccept}>AKCEPTUJ</button>

      </div>

    </div>

  );

}



function CookieSettings({ analytics, setAnalytics, onSave, onReject, onClose }) {

  return (

    <div className="cookie-settings-overlay" onClick={onClose}>

      <div className="cookie-settings" onClick={(e) => e.stopPropagation()}>

        <header><div><span>PRYWATNOŚĆ /</span><h2>Preferencje cookies</h2></div><button type="button" onClick={onClose}>×</button></header>

        <div className="cookie-setting-row"><div><strong>Niezbędne</strong><p>Zapis wyboru dotyczącego cookies i podstawowe działanie strony.</p></div><span className="cookie-always">ZAWSZE AKTYWNE</span></div>

        <div className="cookie-setting-row"><div><strong>Analityczne</strong><p>Google Analytics 4 — statystyki odwiedzin i sposobu korzystania z portfolio.</p></div><label className="cookie-switch"><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /><span /></label></div>

        <footer><button type="button" onClick={onReject}>ODRZUĆ OPCJONALNE</button><button type="button" className="cookie-primary" onClick={onSave}>ZAPISZ USTAWIENIA</button></footer>

      </div>

    </div>

  );

}







const navItems = [

  ["01", "about", "O mnie"],

  ["02", "experience", "Doświadczenie"],

  ["03", "projects", "Projekty"],


  ["04", "cv", "CV"],

  ["05", "contact", "Kontakt"],

];



const projectsData = {

  1: {

    number: "01",

    title: "Sklepy internetowe",

    shortDescription: "Projekty e-commerce na platformach Shopify i WooCommerce",

    description:

      "1. Sklep internetowy z produktami oświetleniowymi LED. Projekt obejmował konfigurację sklepu na platformie Shopify, podpięcie narzędzia DSers z sklepem internetowym, integrację z systemem płatności online Stripe, optymalizację pod kątem SEO oraz przygotowanie treści marketingowych w Google Ads.\n\n2. Sklep internetowy z artykułami szkolnymi. Stworzenie i konfiguracja sklepu internetowego z artykułami szkolnymi w oparciu o WordPress i WooCommerce, wraz z integracją BaseLinker do zarządzania produktami i zamówieniami oraz HotPay do obsługi płatności online. Konfiguracja procesu sprzedaży i automatyzacja obsługi zamówień.",

    tags: ["Shopify", "WooCommerce", "BaseLinker", "Stripe", "Sprzedaż online"],

    icon: SolidIcons.faStore,

    imageGroups: [

      {

        title: "LEDKITS — archiwalne zdjęcia projektu",

        images: [

          "/screenshots/ledkits-arc/ledkits-arc1.png",

          "/screenshots/ledkits-arc/ledkits-arc2.png",

          "/screenshots/ledkits-arc/ledkits-arc3.png",

          "/screenshots/ledkits-arc/ledkits-arc4.png",

          "/screenshots/ledkits-arc/ledkits-arc5.png",

          "/screenshots/ledkits-arc/ledkits-arc6.png",

        ],

      },

      {

        title: "EDUGEAR — archiwalne zdjęcia projektu",

        images: [

          "/screenshots/edugear-arc/edugear-arc1.png",

          "/screenshots/edugear-arc/edugear-arc2.png",

          "/screenshots/edugear-arc/edugear-arc3.png",

        ],

      },

    ],

  },

  2: {

    number: "02",

    title: "Kalkulator zysków z walut cyfrowych",

    shortDescription: "Narzędzie Excel do analizy zysków inwestycyjnych",

    description:

      "Kalkulator stworzony w Excelu dla inwestora, który chce szybko wyliczyć po kursie zakupu i sprzedaży ile wynosi jego zysk. Program umożliwia wybór spośród kilku proponowanych strategii rynkowych oraz dokładnie wylicza poziomy wyjścia ze strategii. Narzędzie zapewnia poziom Stop Loss oraz punkt wyjścia na zero.",

    tags: ["Excel", "Dane", "Formuły i formatowanie"],

    icon: SolidIcons.faTable,

    imageGroups: [

      {

        title: "Kalkulator zysków z walut cyfrowych",

        images: [

          "/screenshots/excel-arc/excel-arc1.png",

          "/screenshots/excel-arc/excel-arc2.png",

        ],

      },

    ],

  },

  3: {

    number: "03",

    title: "Autograph",

    shortDescription: "Aplikacja AI do analizy rynków finansowych",

    description:

      "Aplikacja webowa analizująca dane rynkowe wybranej spółki przy użyciu algorytmów AI i wskaźników giełdowych, generująca rekomendacje inwestycyjne w systemie BUY/HOLD/SELL. Prosty system logowania inspirowany aplikacjami giełdowymi, wybór planu oraz dostęp do rynków kryptowalut, tradycyjnych i dywidendowych. Możliwość konfiguracji własnych powiadomień.",

    tags: ["React", "WebSocket", "Gemini / Gemma API", "Axios / CORS / Express"],

    icon: SolidIcons.faChartLine,

    repoUrl: "https://github.com/czeked/Autograph-fcv",

    imageGroups: [],

  },

  4: {

    number: "04",

    title: "DOT404",

    shortDescription: "Minimalistyczna gra zręcznościowa w przeglądarce",

    description:

      "DOT404 to minimalistyczna gra przeglądarkowa stworzona w React. Gracz ma 45 sekund na zdobycie jak największej liczby punktów poprzez trafianie spadających celów o różnych wartościach. Projekt wykorzystuje Canvas API do renderowania rozgrywki oraz obsługuje sterowanie klawiaturą i urządzenia dotykowe.",

    tags: ["React", "JavaScript", "Canvas API"],

    icon: SolidIcons.faGamepad,

    playUrl: "/gra",

    imageGroups: [],

  },



};



function Reveal({ children, className = "", reducedMotion }) {

  return (

    <motion.div

      className={className}

      initial={reducedMotion ? false : { opacity: 0, y: 50 }}

      whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}

      viewport={{ once: true, amount: 0.14 }}

      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}

    >

      {children}

    </motion.div>

  );

}



function SectionTitle({ number, eyebrow, children }) {

  return (

    <div className="section-title">

      <div className="section-kicker">

        <span>{number}</span>

        <span>{eyebrow}</span>

      </div>

      <h2>{children}</h2>

    </div>

  );

}



function Hero({ reducedMotion, scrollTo }) {

  const ref = useRef(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], [0, 130]);

  const opacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);



  return (

    <section id="header" className="hero" ref={ref}>

      <div className="hero-code hero-code-a" aria-hidden="true">

        <span>const developer = &#123;</span><span>&nbsp;&nbsp;name: "Jakub",</span>

        <span>&nbsp;&nbsp;focus: ["web", "AI"],</span><span>&nbsp;&nbsp;available: true</span><span>&#125;;</span>

      </div>

      <div className="hero-code hero-code-b" aria-hidden="true">

        <span>.portfolio &#123;</span><span>&nbsp;&nbsp;display: grid;</span>

        <span>&nbsp;&nbsp;min-height: 100vh;</span><span>&nbsp;&nbsp;color: #fff;</span><span>&#125;</span>

      </div>

      <div className="hero-vignette" />

      <motion.div className="hero-center" style={reducedMotion ? {} : { y, opacity, scale }}>

        <p className="hero-overline">JAKUB SZCZĘŚNIAK <i /> PORTFOLIO</p>

        <h1><span>JUNIOR</span><span>DEVELOPER</span></h1>

        <p className="hero-sub">FRONTEND <span>/</span> E-COMMERCE <span>/</span> DANE i AI</p>

      </motion.div>

      <button className="hero-scroll" onClick={() => scrollTo("about")}>

        <span>PRZEWIŃ W DÓŁ</span><b>↓</b>

      </button>

      <span className="hero-corner hero-corner-left">50° 23' N</span>

      <span className="hero-corner hero-corner-right">PL / 2026</span>

    </section>

  );

}



function ProjectModal({ project, onClose, reducedMotion }) {

  const [selectedImage, setSelectedImage] = useState(null);

  const groups = project.imageGroups || [];



  useEffect(() => {

    const key = (e) => {

      if (e.key === "Escape") selectedImage ? setSelectedImage(null) : onClose();

    };

    window.addEventListener("keydown", key);

    return () => window.removeEventListener("keydown", key);

  }, [selectedImage, onClose]);



  return (

    <>

      <motion.div className="modal-overlay" onClick={onClose}

        initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        <motion.article

          className="modal-content"

          onClick={(e) => e.stopPropagation()}

        >

          <header className="modal-header modal-header-sticky">

            <div className="modal-heading-copy">

              <span>{project.number} / PROJEKT</span>

              <h2>{project.title}</h2>

            </div>

            <div className="modal-heading-actions">

              {project.playUrl && (

                <a href={project.playUrl}>

                  ZAGRAJ <FontAwesomeIcon icon={SolidIcons.faPlay} />

                </a>

              )}

              {project.repoUrl && (

                <a href={project.repoUrl} target="_blank" rel="noreferrer">

                    GITHUB <FontAwesomeIcon icon={SolidIcons.faArrowUpRightFromSquare} />

                  </a>

              )}

              <button type="button" onClick={onClose} aria-label="Zamknij projekt">×</button>

            </div>

          </header>

          <div className="modal-gallery">

            {groups.length ? groups.map((group, gi) => (

              <section className="image-group" key={gi}>

                <h3>{group.title}</h3>

                <div className="group-gallery">

                  {group.images.map((src, i) => (

                    <button className="gallery-item" key={src} onClick={() => setSelectedImage(src)}>

                      <img src={src} alt={`${group.title} ${i + 1}`} />

                    </button>

                  ))}

                </div>

              </section>

            )) : (

                <div className="no-screenshots">

                  {project.playUrl ? (

                    <a className="project-github-cta" href={project.playUrl}>

                      ZAGRAJ W DOT404

                      <FontAwesomeIcon icon={SolidIcons.faPlay} />

                    </a>

                  ) : project.repoUrl ? (

                    <a

                      className="project-github-cta"

                      href={project.repoUrl}

                      target="_blank"

                      rel="noreferrer"

                    >

                      ZOBACZ PROJEKT NA GITHUB

                      <FontAwesomeIcon icon={SolidIcons.faArrowUpRightFromSquare} />

                    </a>

                  ) : (

                    <span>Brak podglądu projektu.</span>

                  )}

                </div>

              )}

          </div>

          <footer className="modal-footer">

            <p>{project.description}</p>

            <div className="modal-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>

          </footer>

        </motion.article>

      </motion.div>

      <AnimatePresence>

        {selectedImage && (

          <motion.div className="lightbox-overlay" onClick={() => setSelectedImage(null)}

            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>

            <img src={selectedImage} alt="Powiększony screenshot" onClick={(e) => e.stopPropagation()} />

          </motion.div>

        )}

      </AnimatePresence>

    </>

  );

}



function PrivacyModal({ onClose, reducedMotion }) {

  useEffect(() => {

    const handleKey = (event) => event.key === "Escape" && onClose();

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);

  }, [onClose]);



  return (

    <motion.div

      className="privacy-overlay"

      onClick={onClose}

      initial={reducedMotion ? false : { opacity: 0 }}

      animate={{ opacity: 1 }}

      exit={{ opacity: 0 }}

    >

      <motion.article

        className="privacy-modal"

        onClick={(event) => event.stopPropagation()}

        initial={reducedMotion ? false : { opacity: 0, y: 28 }}

        animate={{ opacity: 1, y: 0 }}

        exit={{ opacity: 0, y: 20 }}

      >

        <header className="privacy-header">

          <div><span>PRYWATNOŚĆ /</span><h2>Polityka prywatności</h2></div>

          <button type="button" onClick={onClose} aria-label="Zamknij politykę prywatności">×</button>

        </header>

        <div className="privacy-body">

          <p className="privacy-updated">Ostatnia aktualizacja: 21.09.2026</p>



          <section><h3>1. Administrator</h3><p>Administratorem danych związanych z korzystaniem z tej strony jest Jakub Szczęśniak. W sprawach dotyczących prywatności możesz skontaktować się pod adresem <a href="mailto:jakub3szczesniak@gmail.com">jakub3szczesniak@gmail.com</a>.</p></section>



          <section><h3>2. Dane techniczne i logi serwera</h3><p>Podczas korzystania ze strony serwer hostingowy może automatycznie zapisywać dane techniczne, takie jak adres IP, data i czas żądania, adres odwiedzanego zasobu, informacje o przeglądarce, systemie operacyjnym oraz źródle wejścia. Dane te mogą być wykorzystywane do zapewnienia bezpieczeństwa i prawidłowego działania strony oraz do tworzenia zbiorczych statystyk odwiedzin.</p></section>



          <section><h3>3. Pliki cookies i Google Analytics 4</h3><p>Strona korzysta z Google Analytics 4 (Google LLC) wyłącznie po wyrażeniu zgody na cookies analityczne. Narzędzie służy do tworzenia statystyk odwiedzin i analizy sposobu korzystania z portfolio. Zgoda jest dobrowolna i może zostać w każdej chwili zmieniona przez przycisk „USTAWIENIA COOKIES” w stopce. Brak zgody nie ogranicza podstawowego działania strony.</p></section>



          <section><h3>4. Formularz kontaktowy</h3><p>Formularz dostępny na stronie przygotowuje wiadomość w domyślnym programie pocztowym użytkownika za pomocą odnośnika <code>mailto:</code>. Dane wpisane w formularzu nie są wysyłane do osobnej bazy danych przez tę stronę. Po wysłaniu wiadomości e-mail dane są przetwarzane w celu udzielenia odpowiedzi, prowadzenia korespondencji oraz — gdy wiadomość dotyczy współpracy — podjęcia działań przed zawarciem umowy.</p></section>



          <section><h3>5. Usługi i odnośniki zewnętrzne</h3><p>Strona korzysta z czcionek Google Fonts pobieranych z serwerów Google. Zawiera również odnośniki do zewnętrznych serwisów, np. GitHub. Po przejściu do zewnętrznego serwisu obowiązują zasady prywatności jego operatora.</p></section>



          <section><h3>6. Okres przechowywania i prawa</h3><p>Dane techniczne są przechowywane zgodnie z ustawieniami i okresem retencji dostawcy hostingu. Korespondencja jest przechowywana tak długo, jak jest to potrzebne do obsługi kontaktu, współpracy lub zabezpieczenia ewentualnych roszczeń. W zakresie przewidzianym przez RODO możesz żądać dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania lub wnieść sprzeciw. Masz również prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.</p></section>



          <section><h3>7. Zmiany polityki</h3><p>Polityka może zostać zaktualizowana, jeżeli zmienią się funkcje strony, wykorzystywane usługi lub wymagania prawne. Aktualna wersja jest publikowana bezpośrednio na tej stronie.</p></section>

        </div>

      </motion.article>

    </motion.div>

  );

}



export default function App() {



  const path = window.location.pathname;



  if (path === "/gra" || path === "/gra/") {

    return <Game />;

  }





  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const [pricingDetails, setPricingDetails] = useState(null);

  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [cookieConsent, setCookieConsent] = useState(() => localStorage.getItem(COOKIE_CONSENT_KEY));

  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);

  const [analyticsChoice, setAnalyticsChoice] = useState(() => localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");

  const [reducedMotion, setReducedMotion] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const [formErrors, setFormErrors] = useState({ name: "", email: "", message: "" });

  const [sent, setSent] = useState(false);

  const [footerOpen, setFooterOpen] = useState(false);

  const [contactActive, setContactActive] = useState(false);



  useEffect(() => {

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setReducedMotion(mq.matches);

    sync(); mq.addEventListener("change", sync);

    return () => mq.removeEventListener("change", sync);

  }, []);



  useEffect(() => {

    if (cookieConsent === "accepted") loadGoogleAnalytics();

  }, [cookieConsent]);



  const saveCookieConsent = (accepted) => {

    const value = accepted ? "accepted" : "rejected";

    localStorage.setItem(COOKIE_CONSENT_KEY, value);

    setCookieConsent(value);

    setAnalyticsChoice(accepted);

    setCookieSettingsOpen(false);

    if (accepted) loadGoogleAnalytics();

  };



  useEffect(() => {

    document.body.style.overflow = menuOpen || selectedProject || pricingDetails || privacyOpen || cookieSettingsOpen ? "hidden" : "";

    return () => { document.body.style.overflow = ""; };

  }, [menuOpen, selectedProject, pricingDetails, privacyOpen, cookieSettingsOpen]);



  useEffect(() => {

    const desktop = window.matchMedia(

      "(min-width: 1024px) and (hover: hover) and (pointer: fine)"

    );

    const sectionIds = ["header", "about", "experience", "projects", "cv", "contact"];



    let locked = false;

    let wheelSum = 0;

    let resetTimer;

    let unlockTimer;



    const closestSection = () => {

      const viewportCenter = window.scrollY + window.innerHeight / 2;

      let index = 0;

      let distance = Infinity;



      sectionIds.forEach((id, i) => {

        const el = document.getElementById(id);

        if (!el) return;



        const top = window.scrollY + el.getBoundingClientRect().top;

        const center = top + el.offsetHeight / 2;

        const nextDistance = Math.abs(viewportCenter - center);



        if (nextDistance < distance) {

          distance = nextDistance;

          index = i;

        }

      });



      return index;

    };



    const onWheel = (event) => {

      if (window.innerWidth < 1024 || !desktop.matches || reducedMotion || menuOpen || selectedProject || pricingDetails || privacyOpen) return;

      if (event.ctrlKey || event.target.closest(".modal-content, .lightbox-overlay")) return;



      event.preventDefault();

      if (locked) return;



      wheelSum += event.deltaY;



      clearTimeout(resetTimer);

      resetTimer = setTimeout(() => {

        wheelSum = 0;

      }, 120);

      if (Math.abs(wheelSum) < 55) return;



      const current = closestSection();

      const direction = wheelSum > 0 ? 1 : -1;



      if (current === sectionIds.length - 1 && direction > 0) {

        wheelSum = 0;

        setFooterOpen(true);

        return;

      }



      if (footerOpen && direction < 0) {

        wheelSum = 0;

        setFooterOpen(false);

        return;

      }



      const next = Math.max(0, Math.min(sectionIds.length - 1, current + direction));



      wheelSum = 0;

      if (next === current) return;



      const target = document.getElementById(sectionIds[next]);

      if (!target) return;



      locked = true;

      target.scrollIntoView({ behavior: "smooth", block: "start" });



      clearTimeout(unlockTimer);

      unlockTimer = setTimeout(() => {

        locked = false;

      }, 820);

    };



    window.addEventListener("wheel", onWheel, { passive: false });



    return () => {

      window.removeEventListener("wheel", onWheel);

      clearTimeout(resetTimer);

      clearTimeout(unlockTimer);

    };

  }, [menuOpen, selectedProject, pricingDetails, privacyOpen, reducedMotion, footerOpen]);



  useEffect(() => {

    if (!footerOpen || privacyOpen || cookieSettingsOpen) return;



    const closeOnOutsideClick = (event) => {

      if (window.innerWidth < 768) return;

      if (event.target.closest(".footer-drawer")) return;

      setFooterOpen(false);

    };



    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);

  }, [footerOpen, privacyOpen, cookieSettingsOpen]);



  useEffect(() => {

    const drawerViewport = window.matchMedia("(min-width: 768px)");



    const syncContactState = () => {

      if (!drawerViewport.matches) {

        setContactActive(false);

        setFooterOpen(false);

        return;

      }



      const contact = document.getElementById("contact");

      if (!contact) return;



      const rect = contact.getBoundingClientRect();

      const viewportCenter = window.innerHeight / 2;

      const active = rect.top <= viewportCenter && rect.bottom >= viewportCenter;

      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;



      setContactActive(active);

      if (!active) {

        setFooterOpen(false);

      } else if (tablet && nearBottom && !privacyOpen && !cookieSettingsOpen) {

        setFooterOpen(true);

      }

    };



    syncContactState();

    window.addEventListener("scroll", syncContactState, { passive: true });

    window.addEventListener("resize", syncContactState);

    drawerViewport.addEventListener?.("change", syncContactState);



    return () => {

      window.removeEventListener("scroll", syncContactState);

      window.removeEventListener("resize", syncContactState);

      drawerViewport.removeEventListener?.("change", syncContactState);

    };

  }, [privacyOpen, cookieSettingsOpen]);



  const scrollTo = (id) => {

    setMenuOpen(false);

    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), 40);

  };



  const validateContact = () => {

    const errors = { name: "", email: "", message: "" };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    if (!formData.name.trim()) {

      errors.name = "Wpisz swoje imię.";

    } else if (formData.name.trim().length < 2) {

      errors.name = "Imię powinno mieć co najmniej 2 znaki.";

    }



    if (!formData.email.trim()) {

      errors.email = "Wpisz adres e-mail.";

    } else if (!emailPattern.test(formData.email.trim())) {

      errors.email = "Podaj poprawny adres e-mail, np. nazwa@domena.pl.";

    }



    if (!formData.message.trim()) {

      errors.message = "Napisz krótką wiadomość.";

    } else if (formData.message.trim().length < 10) {

      errors.message = "Wiadomość powinna mieć co najmniej 10 znaków.";

    }



    setFormErrors(errors);

    return !Object.values(errors).some(Boolean);

  };



  const updateField = (field, value) => {

    setFormData((current) => ({ ...current, [field]: value }));

    if (formErrors[field]) {

      setFormErrors((current) => ({ ...current, [field]: "" }));

    }

  };



  const sendMail = (e) => {

    e.preventDefault();

    if (!validateContact()) return;



    const subject = encodeURIComponent(`Kontakt z portfolio - ${formData.name}`);

    const body = encodeURIComponent(

      `Imię: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`

    );



    window.location.href =

      `mailto:jakub3szczesniak@gmail.com?subject=${subject}&body=${body}`;



    setSent(true);

    setTimeout(() => setSent(false), 3000);

  };



  return (

    <div className="app">

      <nav className={`navbar ${pricingDetails ? "pricing-open" : ""}`}>

        <button className="brand" onClick={() => scrollTo("header")} aria-label="Początek strony">

          <span>JS.</span><small>JUNIOR DEVELOPER</small>

        </button>

        <div className="nav-links">

          {navItems.map(([n, id, label]) => <button key={id} onClick={() => scrollTo(id)}><i>{n}</i>{label}</button>)}

        </div>

        <button

          className={`menu-toggle ${menuOpen ? "active" : ""}`}

          type="button"

          onClick={() => setMenuOpen((v) => !v)}

          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}

          aria-expanded={menuOpen}

          aria-controls="mobile-navigation"

        >

          <span />

          <span />

        </button>

      </nav>



      <AnimatePresence>

        {menuOpen && (

          <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity: 0, y: "-100%" }} animate={{ opacity: 1, y: 0 }}

            exit={{ opacity: 0, y: "-100%" }} transition={{ duration: reducedMotion ? 0 : .5, ease: [0.76, 0, 0.24, 1] }}>

            <div className="mobile-menu-inner">

              <p>NAWIGACJA /</p>

              {navItems.map(([n, id, label], i) => (

                <motion.button key={id} onClick={() => scrollTo(id)}

                  initial={reducedMotion ? false : { opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: .12 + i * .06 }}>

                  <span>{n}</span>{label}<b><FontAwesomeIcon icon={SolidIcons.faArrowUpRightFromSquare} /></b>

                </motion.button>

              ))}

              <div className="mobile-menu-foot"><span>jakubszczesniak.pl</span><span>2026</span></div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      <Hero reducedMotion={reducedMotion} scrollTo={scrollTo} />



      <main>

        <section id="about" className="section about-section">

          <Reveal className="section-shell" reducedMotion={reducedMotion}>

            <SectionTitle number="01" eyebrow="ABOUT">O MNIE</SectionTitle>

            <div className="about-layout">

              <div className="about-lead">

                <p className="giant-copy">TWORZĘ<br />CYFROWE<br /><em>RZECZY.</em></p>

              </div>

              <div className="about-copy">

                <span className="micro-label">KIM JESTEM /</span>

                <p>Rozwijam się jako Junior Developer, tworząc aplikacje webowe i desktopowe z&#x20;

                  wykorzystaniem nowoczesnych technologii oraz rozwiązań opartych na AI.&#x20;

                  Skupiam się przede wszystkim na frontendzie, e-commerce i analizie danych, a&#x20;

                  szczególnie interesuje mnie łączenie tych obszarów z programowaniem i&#x20;

                  sztuczną inteligencją.

                  <br/><br/>

                  Szukam możliwości zdobywania doświadczenia komercyjnego i dalszego rozwoju w IT.&#x20;

                  Równolegle realizuję pierwsze zlecenia freelance, tworząc strony internetowe i sklepy dla&#x20;

                  firm oraz klientów indywidualnych.</p>

                <div className="about-note"><FontAwesomeIcon icon={SolidIcons.faMotorcycle} /><span>Poza kodem: motocykle i muzyka.</span></div>

                <div className="tech-line"><span>REACT</span><span>JAVA</span><span>MYSQL</span><span>AI</span><span>ANALIZA DANYCH</span><span>E-COMMERCE</span></div>

              </div>

            </div>

          </Reveal>

        </section>



        <section id="experience" className="section experience-section">

          <Reveal className="section-shell" reducedMotion={reducedMotion}>

            <SectionTitle number="02" eyebrow="EXPERIENCE">DOŚWIADCZENIE</SectionTitle>

            <div className="experience-list">

              {[

                ["2025 — 2026", "Kierownik", "Kebab u Pajdy", "Nadzorowanie pracy zespołu, organizacja lokalu, rekrutacja, obsługa klienta i kasy fiskalnej oraz prowadzenie firmowego Facebooka."],

                ["KWI 2026", "Praktyki zawodowe", "LEANMATE Marcin Kłeczek", "Praktyki związane z AI, analizą kodu i wykorzystaniem AI w developmentcie. Udział w projekcie Autograph, materiały w Canva oraz rola Scrum Mastera."],

                ["KWI 2025", "Praktyki zawodowe", "Motorola Solutions Polska", "Poznawanie narzędzi IT i rozwój aplikacji w Vue.js w profesjonalnym procesie developmentu."],

              ].map((x, i) => (

                <article className="experience-row" key={x[2]}>

                  <span className="experience-no">0{i + 1}</span>

                  <span className="experience-date">{x[0]}</span>

                  <div><h3>{x[1]}</h3><h4>{x[2]}</h4></div>

                  <p>{x[3]}</p>

                </article>

              ))}

            </div>

          </Reveal>

        </section>



        <section id="projects" className="section projects-section">

          <Reveal className="section-shell" reducedMotion={reducedMotion}>

            <SectionTitle number="03" eyebrow="SELECTED WORK">PROJEKTY</SectionTitle>

            <div className="project-list">

              {Object.values(projectsData).map((project) => {

                return (

                  <button className="project-row" key={project.number} onClick={() => setSelectedProject(project)}>

                    <span className="project-no">{project.number}</span>

                    <div className="project-main"><h3>{project.title}</h3><p>{project.shortDescription}</p></div>

                    <div className="project-tags-mini">{project.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}</div>

                    <span className="project-arrow"><FontAwesomeIcon icon={SolidIcons.faArrowUpRightFromSquare} /></span>

                  </button>

                );

              })}

            </div>

          </Reveal>

        </section>



      {false && (

        <section id="freelance" className="section freelance-section">

          <Reveal className="section-shell" reducedMotion={reducedMotion}>

            <SectionTitle number="04" eyebrow="FREELANCE">WSPÓŁPRACA</SectionTitle>



            <div className="freelance-intro">

              <p className="freelance-lead">Strony i sklepy internetowe dopasowane do realnych potrzeb firmy.</p>

              <p className="freelance-copy">

                Od prostej strony prezentującej markę po rozbudowany sklep internetowy.

                Wybierz wariant, aby zobaczyć dokładny zakres realizacji.

              </p>

            </div>



            <div className="pricing-grid pricing-grid-compact">

              <article className="pricing-card">

                <div className="pricing-card-heading"><span>01 / WWW</span><b>od {formatPrice(PRICES.websites.static)} zł</b></div>

                <h3>Strony internetowe</h3>

                <p className="pricing-summary">Od nowoczesnej wizytówki po rozbudowaną stronę firmową z panelem CMS.</p>

                <div className="pricing-choices">

                  <button type="button" onClick={() => setPricingDetails("web-basic")}>

                    <div><span>BASIC</span><h4>Strona internetowa BASIC</h4><p>Profesjonalna obecność firmy lub marki w sieci.</p></div>

                    <strong>od {formatPrice(PRICES.websites.static)} zł <FontAwesomeIcon icon={SolidIcons.faArrowRight} /></strong>

                  </button>

                  <button type="button" onClick={() => setPricingDetails("web-pro")}>

                    <div><span>PRO</span><h4>Strona internetowa PRO</h4><p>Rozbudowana witryna z CMS i większym zakresem funkcji.</p></div>

                    <strong>od {formatPrice(PRICES.websites.cms)} zł <FontAwesomeIcon icon={SolidIcons.faArrowRight} /></strong>

                  </button>

                </div>

              </article>



              <article className="pricing-card">

                <div className="pricing-card-heading"><span>02 / E-COMMERCE</span><b>od {formatPrice(PRICES.ecommerce.basic)} zł</b></div>

                <h3>E-commerce</h3>

                <p className="pricing-summary">Sklepy WooCommerce i Shopify przygotowane do obsługi sprzedaży, płatności i zamówień.</p>

                <div className="pricing-choices">

                  <button type="button" onClick={() => setPricingDetails("shop-basic")}>

                    <div><span>BASIC</span><h4>Sklep internetowy BASIC</h4><p>Kompletny sklep przygotowany do rozpoczęcia sprzedaży.</p></div>

                    <strong>od {formatPrice(PRICES.ecommerce.basic)} zł <FontAwesomeIcon icon={SolidIcons.faArrowRight} /></strong>

                  </button>

                  <button type="button" onClick={() => setPricingDetails("shop-pro")}>

                    <div><span>PRO</span><h4>Sklep internetowy PRO</h4><p>Integracje, automatyzacje i większa elastyczność sprzedaży.</p></div>

                    <strong>od {formatPrice(PRICES.ecommerce.advanced)} zł <FontAwesomeIcon icon={SolidIcons.faArrowRight} /></strong>

                  </button>

                </div>

              </article>

            </div>



            <div className="pricing-footer pricing-footer-compact">

              <div><span>INDYWIDUALNA WYCENA /</span><p>Ceny są startowe. Domena, hosting, płatne licencje i niestandardowe integracje rozliczane są osobno.</p></div>

              <button type="button" onClick={() => scrollTo("contact")}>OMÓW PROJEKT <FontAwesomeIcon icon={SolidIcons.faArrowRight} /></button>

            </div>



            <AnimatePresence>

              {pricingDetails && (() => {

                const details = {

                  "web-basic": {

                      no: "01 / WWW / BASIC",

                      title: "Strona internetowa BASIC",

                      price: PRICES.websites.static,

                      desc: "Dla marki, usługi, specjalisty lub portfolio potrzebującego profesjonalnej obecności w sieci.",

                      features: [

                        "Indywidualne dopasowanie wyglądu",

                        "One Page lub do 4 podstron",

                        "Pełna responsywność",

                        "Formularz kontaktowy",

                        "Integracja social media / mapa Google",

                        "Podstawowe SEO i optymalizacja",

                        "Konfiguracja domeny i SSL",

                        "Publikacja strony",

                        "2 rundy poprawek"

                      ]

                    },



                    "web-pro": {

                      no: "01 / WWW / PRO",

                      title: "Strona internetowa PRO",

                      price: PRICES.websites.cms,

                      desc: "Dla firmy potrzebującej rozbudowanej witryny i możliwości samodzielnego zarządzania treścią.",

                      includes: true,

                      features: [

                        "System CMS",

                        "Do 8 podstron",

                        "Samodzielna edycja treści",

                        "Blog / aktualności / realizacje",

                        "Rozbudowane formularze",

                        "Google Analytics 4 + Search Console",

                        "Podstawowe zabezpieczenia i backup",

                        "Wdrożenie i szkolenie z obsługi strony",

                        "3 rundy poprawek",

                        "Opieka nad stroną — 200 zł / mies.",

                        "Pierwsze 30 dni opieki bezpłatnie"

                      ]

                    },



                    "shop-basic": {

                      no: "02 / E-COMMERCE / BASIC",

                      title: "Sklep internetowy BASIC",

                      price: PRICES.ecommerce.basic,

                      desc: "Dla firmy rozpoczynającej sprzedaż online i potrzebującej kompletnego, gotowego do działania sklepu.",

                      features: [

                        "WooCommerce lub Shopify",

                        "Dopasowanie wyglądu sklepu",

                        "Konfiguracja katalogu i do 20 produktów",

                        "Kategorie i podstawowe warianty produktów",

                        "Koszyk i proces zamówienia",

                        "Integracja płatności online",

                        "Podstawowa konfiguracja dostaw",

                        "Kupony rabatowe",

                        "Maile transakcyjne",

                        "Panel obsługi zamówień",

                        "Podstawowe SEO",

                        "Google Analytics 4 + Search Console",

                        "Wdrożenie i szkolenie z obsługi sklepu",

                        "2 rundy poprawek",

                        "Opieka nad sklepem — 200 zł / mies.",

                        "Pierwsze 30 dni opieki bezpłatnie"

                      ]

                    },



                    "shop-pro": {

                      no: "02 / E-COMMERCE / PRO",

                      title: "Sklep internetowy PRO",

                      price: PRICES.ecommerce.advanced,

                      desc: "Dla rozwijającego się e-commerce wymagającego integracji, automatyzacji i większej elastyczności sprzedaży.",

                      includes: true,

                      features: [

                        "Do 80 produktów na start",

                        "Rozbudowane warianty i atrybuty produktów",

                        "Zaawansowane filtrowanie produktów",

                        "Podstawowa integracja BaseLinker",

                        "Dodatkowe integracje sprzedażowe",

                        "Rozszerzona konfiguracja dostaw",

                        "Newsletter i automatyzacje sprzedażowe",

                        "Google Analytics 4 + pomiar e-commerce",

                        "Rozszerzone SEO techniczne",

                        "3 rundy poprawek",

                        "Możliwość wdrożenia dodatkowych funkcjonalności",

                        "Opieka nad sklepem — 150 zł / mies.",

                        "Pierwsze 60 dni opieki bezpłatnie"

                      ]

                    }

                }[pricingDetails];

                return (

                  <motion.div className="pricing-detail-overlay" onClick={() => setPricingDetails(null)} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    <motion.aside className="pricing-detail-panel" onClick={(e) => e.stopPropagation()} initial={reducedMotion ? false : { x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: reducedMotion ? 0 : .42, ease: [0.22, 1, 0.36, 1] }}>

                      <div className="pricing-detail-head"><span>{details.no}</span><button type="button" onClick={() => setPricingDetails(null)} aria-label="Zamknij szczegóły">×</button></div>

                      <div className="pricing-detail-body">

                        <p className="pricing-detail-kicker">ZAKRES REALIZACJI /</p><h3>{details.title}</h3><strong>od {formatPrice(details.price)} zł</strong><p className="pricing-detail-desc">{details.desc}</p>

                        {details.includes && <span className="package-includes">WSZYSTKO Z BASIC +</span>}

                        <ul className="package-features pricing-detail-features">{details.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>

                        <div className="pricing-detail-note"><span>WAŻNE /</span><p>Ostateczny zakres i wycenę ustalam indywidualnie po krótkiej rozmowie.</p></div>

                        <button className="pricing-detail-cta" type="button" onClick={() => { setPricingDetails(null); scrollTo("contact"); }}>OMÓW PROJEKT <FontAwesomeIcon icon={SolidIcons.faArrowRight} /></button>

                      </div>

                    </motion.aside>

                  </motion.div>

                );

              })()}

            </AnimatePresence>

          </Reveal>

        </section>
        )}



        <section id="cv" className="section cv-section">

          <Reveal className="section-shell cv-shell" reducedMotion={reducedMotion}>

            <span className="micro-label">04 / CURRICULUM VITAE</span>

            <FontAwesomeIcon className="cv-watermark" icon={RegularIcons.faFile} />

            <h2>POZNAJ MNIE<br /><em>LEPIEJ.</em></h2>

            <p>Pełne CV — edukacja, kwalifikacje, doświadczenie i technologie.</p>

            <a className="outline-link" href="/cv-jakubszczesniak-f.pdf" target="_blank" rel="noreferrer">OTWÓRZ CV <span><FontAwesomeIcon icon={SolidIcons.faArrowUpRightFromSquare} /></span></a>

          </Reveal>

        </section>



        <section id="contact" className="section contact-section">

          <Reveal className="section-shell" reducedMotion={reducedMotion}>

            <span className="micro-label">05 / KONTAKT</span>

            <div className="contact-head">

              <h2>PRZEKUJEMY <em>POTENCJAŁ</em><br />W DZIAŁANIE.</h2>

              <p>Praca, projekt freelance lub współpraca?<br />Napisz do mnie.</p>

            </div>

            <div className="contact-grid">

              <div className="contact-meta">

                <a href="mailto:jakub3szczesniak@gmail.com">

                  jakub3szczesniak@gmail.com

                  <FontAwesomeIcon icon={SolidIcons.faArrowUpRightFromSquare} />

                </a>

                <div><span>STATUS</span><strong><i /> Dostępny do współpracy</strong></div>

                <div><span>LOCATION</span><strong>Polska</strong></div>

              </div>

              <form onSubmit={sendMail} noValidate>

                <label className={formErrors.name ? "field-invalid" : ""}>

                  <span>01 / IMIĘ</span>

                  <input

                    name="name"

                    placeholder="Twoje imię"

                    value={formData.name}

                    aria-invalid={Boolean(formErrors.name)}

                    aria-describedby="name-error"

                    onChange={(e) => updateField("name", e.target.value)}

                  />

                  <small id="name-error" className="field-error">{formErrors.name}</small>

                </label>

                <label className={formErrors.email ? "field-invalid" : ""}>

                  <span>02 / E-MAIL</span>

                  <input

                    name="email"

                    type="email"

                    placeholder="twoj@email.pl"

                    value={formData.email}

                    aria-invalid={Boolean(formErrors.email)}

                    aria-describedby="email-error"

                    onChange={(e) => updateField("email", e.target.value)}

                  />

                  <small id="email-error" className="field-error">{formErrors.email}</small>

                </label>

                <label className={formErrors.message ? "field-invalid" : ""}>

                  <span>03 / WIADOMOŚĆ</span>

                  <textarea

                    name="message"

                    rows="3"

                    placeholder="Opowiedz krótko, w czym mogę pomóc..."

                    value={formData.message}

                    aria-invalid={Boolean(formErrors.message)}

                    aria-describedby="message-error"

                    onChange={(e) => updateField("message", e.target.value)}

                  />

                  <small id="message-error" className="field-error">{formErrors.message}</small>

                </label>

                <button className="send-button" type="submit">

                  {sent ? "WIADOMOŚĆ GOTOWA ✓" : "WYŚLIJ WIADOMOŚĆ →"}

                </button>

              </form>

            </div>

          </Reveal>

        </section>


      </main>



      <div className={`footer-drawer ${contactActive ? "is-visible" : ""} ${footerOpen ? "is-open" : ""}`}>

        <button

          type="button"

          className="footer-drawer-handle"

          onClick={() => setFooterOpen((open) => !open)}

          aria-label={footerOpen ? "Schowaj stopkę" : "Pokaż stopkę"}

          aria-expanded={footerOpen}

        >

          <span />

        </button>



        <footer id="footer" className="footer">

          <span>© 2026 JAKUB SZCZĘŚNIAK</span>

          <div className="footer-actions">

            <button type="button" onClick={() => setPrivacyOpen(true)}>POLITYKA PRYWATNOŚCI</button>

            <button type="button" onClick={() => { setAnalyticsChoice(cookieConsent === "accepted"); setCookieSettingsOpen(true); }}>USTAWIENIA COOKIES</button>

            <button type="button" onClick={() => { setFooterOpen(false); scrollTo("header"); }}>DO GÓRY ↑</button>

          </div>

        </footer>

      </div>



      <AnimatePresence>

        {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} reducedMotion={reducedMotion} />}

      </AnimatePresence>



      {!cookieConsent && (

        <CookieBanner

          onAccept={() => saveCookieConsent(true)}

          onReject={() => saveCookieConsent(false)}

          onSettings={() => setCookieSettingsOpen(true)}

          onPrivacy={() => setPrivacyOpen(true)}

        />

      )}



      {cookieSettingsOpen && (

        <CookieSettings

          analytics={analyticsChoice}

          setAnalytics={setAnalyticsChoice}

          onSave={() => saveCookieConsent(analyticsChoice)}

          onReject={() => saveCookieConsent(false)}

          onClose={() => setCookieSettingsOpen(false)}

        />

      )}



      <AnimatePresence>

        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} reducedMotion={reducedMotion} />}

      </AnimatePresence>

    </div>

  );

}
