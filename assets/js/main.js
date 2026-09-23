/* Waigel-Baukoordination – Interaktionen (ohne Framework) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky Navigation ---- */
  var nav = document.querySelector(".nav");
  var callbar = document.querySelector(".callbar");
  var ticking = false;
  var zeigeWasImBildIst = null;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    /* Anruf-Leiste mit zwei Schwellen: erscheint weiter unten, verschwindet
       erst wieder deutlich darüber. Sonst flackert sie beim Hin- und Herwischen. */
    if (callbar) {
      var vh = window.innerHeight;
      var sichtbar = callbar.classList.contains("is-visible");
      if (!sichtbar && y > vh * 0.75) callbar.classList.add("is-visible");
      else if (sichtbar && y < vh * 0.45) callbar.classList.remove("is-visible");
    }
    parallax(y);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  /* ---- Hero Parallax / Zoom ---- */
  var heroBg = document.querySelector(".hero__bg");
  var heroVisual = document.querySelector(".hero__visual");
  var hero = document.querySelector(".hero");
  /* Auf Touch-Geräten kein Parallax: das Skalieren des Hintergrunds bei jedem
     Frame war die zweite große Bremse auf dem Handy. */
  var sparsam = window.matchMedia("(hover: none)").matches || window.innerWidth <= 960;
  function parallax(y) {
    if (reduceMotion || sparsam || !hero) return;
    var h = hero.offsetHeight;
    if (y > h) return;
    var p = y / h;
    if (heroBg) heroBg.style.transform = "translate3d(0," + (y * 0.35) + "px,0) scale(" + (1 + p * 0.08) + ")";
    if (heroVisual) heroVisual.style.transform = "translate3d(0," + (y * -0.08) + "px,0)";
  }

  /* ---- Mobiles Menü ---- */
  var toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) toggle.click();
    });
  }

  /* ---- Hochzählende Zahlen ---- */
  /* Zahlen stehen im HTML korrekt (auch ohne JS). Das Suffix (z. B. „+“ oder „%“)
     wird gemerkt, bevor der Zähler auf 0 gesetzt wird. */
  /* Die richtige Zahl steht im HTML und bleibt dort stehen. Auf 0 gesetzt wird
     erst beim Start des Zählers – so kann nie eine 0 hängen bleiben, wenn die
     Animation aus irgendeinem Grund nicht anläuft. */
  var counters = document.querySelectorAll("[data-count]");
  counters.forEach(function (el) {
    var s = el.querySelector("small");
    el.setAttribute("data-suffix", s ? s.outerHTML : "");
  });

  function countUp(el) {
    if (el.getAttribute("data-counting") === "1") return;
    el.setAttribute("data-counting", "1");
    var target = parseFloat(el.getAttribute("data-count"));
    var suffixHTML = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.innerHTML = target + suffixHTML; return; }
    var duration = 1400, start = null, fertig = false;
    el.innerHTML = "0" + suffixHTML;
    function frame(ts) {
      /* abgebrochen, weil der Block aus dem Bild gescrollt ist */
      if (el.getAttribute("data-counting") !== "1") return;
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 4);
      el.innerHTML = Math.round(target * eased) + suffixHTML;
      if (t < 1) window.requestAnimationFrame(frame);
      else fertig = true;
    }
    window.requestAnimationFrame(frame);
    /* Notbremse: läuft die Animation nicht (z. B. Tab im Hintergrund),
       steht am Ende trotzdem die richtige Zahl da. */
    window.setTimeout(function () {
      if (!fertig && el.getAttribute("data-counting") === "1") el.innerHTML = target + suffixHTML;
    }, duration + 900);
  }

  /* ---- Zeichnungen erst starten, wenn sie im Bild sind ----
     Auf dem Handy steht die Hero-Zeichnung unter dem Text. Ohne das hier wäre
     sie fertig gezeichnet, bevor man überhaupt hinscrollt. */
  var drawings = [];
  var blueprint = document.querySelector(".blueprint");
  if (blueprint) drawings.push([blueprint, blueprint.closest(".hero__visual")]);
  var deco = document.querySelector(".page-hero__deco");
  if (deco) drawings.push([deco, deco.closest(".page-hero")]);

  function startDrawing(pair) {
    pair.forEach(function (el) { if (el) el.classList.add("is-drawing"); });
  }
  function imBild(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < (window.innerHeight || doc.clientHeight);
  }
  /* Deutlich im Bild – nicht nur mit der Kante am unteren Rand. Wichtig für
     die hochzählenden Zahlen: sonst läuft der Zähler ab, während man noch
     scrollt, und man sieht nur noch das Ergebnis. */
  function gutImBild(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || doc.clientHeight;
    return r.top < vh * 0.85 && r.bottom > vh * 0.08;
  }
  if (drawings.length) {
    if ("IntersectionObserver" in window) {
      var drawIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          drawings.forEach(function (pair) { if (pair[0] === entry.target) startDrawing(pair); });
          drawIO.unobserve(entry.target);
        });
      }, { threshold: .15 });
      drawings.forEach(function (pair) { drawIO.observe(pair[0]); });
      /* Sicherheitsnetz: Steht die Zeichnung beim Laden schon im Bild (auf den
         Unterseiten der Fall), startet sie auch dann, wenn der Beobachter
         nicht anschlägt – sonst passiert im Seitenkopf gar nichts. */
      window.setTimeout(function () {
        drawings.forEach(function (pair) {
          if (!pair[0].classList.contains("is-drawing") && imBild(pair[0])) {
            startDrawing(pair);
            drawIO.unobserve(pair[0]);
          }
        });
      }, 400);
    } else {
      drawings.forEach(startDrawing);
    }
  }

  /* ---- Scroll-Reveal ---- */
  var targets = document.querySelectorAll(".reveal, .reveal-mask, .stat, .steps, .timeline li");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        /* Hohe Blöcke – etwa das Anfrageformular – erreichen 18 % erst, wenn
           man schon mittendrin ist. Die blenden ein, sobald sie ins Bild kommen. */
        var gross = el.offsetHeight > window.innerHeight * 0.55;
        if (!gross && entry.intersectionRatio < 0.18) return;
        el.classList.add("is-visible");
        io.unobserve(el);
      });
      /* etwas früher als das Element wirklich im Bild ist */
    }, { threshold: [0, 0.18], rootMargin: "0px 0px 8% 0px" });
    targets.forEach(function (el) { io.observe(el); });

    /* Sicherheitsnetz: Falls der Beobachter nicht anschlägt, blenden Elemente
       beim Scrollen trotzdem ein – kein Abschnitt bleibt unsichtbar hängen. */
    var offen = Array.prototype.slice.call(targets);
    zeigeWasImBildIst = function () {
      if (!offen.length) return;
      offen = offen.filter(function (el) {
        if (el.classList.contains("is-visible")) return false;
        if (!gutImBild(el)) return true;
        el.classList.add("is-visible");
        io.unobserve(el);
        return false;
      });
    };
    window.setTimeout(zeigeWasImBildIst, 700);
    var letztePruefung = 0;
    window.addEventListener("scroll", function () {
      var jetzt = Date.now();
      if (jetzt - letztePruefung < 150) return;   /* höchstens alle 150 ms */
      letztePruefung = jetzt;
      zeigeWasImBildIst();
    }, { passive: true });
  } else {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Die Zahlen haben einen eigenen Auslöser ----
     Alles andere blendet bewusst früh ein. Die Zahlen brauchen das Gegenteil:
     Sie dürfen erst loslaufen, wenn man sie wirklich ansieht – sonst ist das
     Hochzählen beim zügigen Scrollen vorbei, bevor man dort ankommt. */
  if ("IntersectionObserver" in window && !reduceMotion) {
    /* Die Zahl zählt erst hoch, wenn sie mitten im Bild steht. Verlässt sie das
       Bild wieder, wird zurückgesetzt – beim nächsten Hinscrollen läuft die
       Animation also erneut, statt fertig dazustehen. */
    function zaehlerZuruecksetzen(el) {
      if (el.getAttribute("data-counting") !== "1") return;
      el.removeAttribute("data-counting");
      el.innerHTML = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    }
    var zaehlerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > 0.95) countUp(el);
        else if (!entry.isIntersecting) zaehlerZuruecksetzen(el);
      });
    }, { threshold: [0, 0.96], rootMargin: "-22% 0px -32% 0px" });
    counters.forEach(function (el) { zaehlerIO.observe(el); });

    /* Zweiter Weg, falls der Beobachter nicht anschlägt: beim Scrollen prüfen,
       aber erst im oberen Bildbereich – nicht schon am unteren Rand. */
    var letzteZaehlerPruefung = 0;
    function pruefeZaehler() {
      var vh = window.innerHeight || doc.clientHeight;
      counters.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (el.getAttribute("data-counting") === "1") {
          /* ganz aus dem Bild gescrollt: zurücksetzen, damit es beim nächsten
             Hinscrollen wieder hochzählt statt fertig dazustehen */
          if (r.top > vh + 40 || r.bottom < -40) zaehlerZuruecksetzen(el);
          return;
        }
        if (r.top > vh * 0.62 || r.bottom < vh * 0.2) return;   /* noch nicht mitten im Bild */
        countUp(el);
      });
    }
    window.addEventListener("scroll", function () {
      var jetzt = Date.now();
      if (jetzt - letzteZaehlerPruefung < 120) return;
      letzteZaehlerPruefung = jetzt;
      pruefeZaehler();
    }, { passive: true });
    /* Einmal nach dem Laden: falls die Zahlen ohne Scrollen schon im Bild stehen */
    window.setTimeout(pruefeZaehler, 600);
  } else {
    counters.forEach(function (el) {
      el.innerHTML = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ---- Jahr im Footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Sprungmarken-Navigation: aktiven Abschnitt markieren ---- */
  var subnav = document.querySelector(".subnav");
  var subLinks = document.querySelectorAll(".subnav a[href^='#']");

  /* Sprungziele dürfen nicht unter der Kopf- und der Abschnittsleiste liegen */
  if (subnav) {
    var setScrollPad = function () {
      doc.style.scrollPaddingTop = (68 + subnav.offsetHeight + 10) + "px";
    };
    setScrollPad();
    window.addEventListener("resize", setScrollPad);
  }

  if (subLinks.length && "IntersectionObserver" in window) {
    var map = {};
    var list = subnav ? subnav.querySelector("ul") : null;
    var lockUntil = 0;
    subLinks.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) map[t.id] = a; });

    /* Nur die Leiste selbst waagerecht verschieben – niemals die Seite scrollen.
       (scrollIntoView hat die Seite beim Antippen kurz nach unten und sofort
       wieder nach oben gesprungen.) */
    function centerLink(a, instant) {
      if (!list || list.scrollWidth <= list.clientWidth + 4) return;
      var lr = list.getBoundingClientRect(), ar = a.getBoundingClientRect();
      var delta = (ar.left + ar.width / 2) - (lr.left + lr.width / 2);
      if (Math.abs(delta) < 8) return;
      /* Beim Antippen ohne weiche Bewegung: sonst bricht sie das weiche
         Scrollen der Seite zum Abschnitt ab und es ruckelt. */
      if (!instant && !reduceMotion && list.scrollBy) list.scrollBy({ left: delta, behavior: "smooth" });
      else list.scrollLeft += delta;
    }

    function setActive(a, instant) {
      subLinks.forEach(function (x) { x.classList.remove("is-active"); });
      a.classList.add("is-active");
      centerLink(a, instant);
    }

    /* Beim Antippen sofort markieren und den Beobachter kurz ruhigstellen,
       damit die durchlaufenden Abschnitte die Markierung nicht überschreiben */
    subLinks.forEach(function (a) {
      a.addEventListener("click", function () { lockUntil = Date.now() + 900; setActive(a, true); });
    });

    var spy = new IntersectionObserver(function (entries) {
      if (Date.now() < lockUntil) return;
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) setActive(map[e.target.id]);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---- Linien enden an der letzten Zahl, nicht am Rand ----
     Gemessen wird die Mitte des letzten Kreises; das CSS rechnet damit. */
  function measureLine(container, dotSelector) {
    var dots = container.querySelectorAll(dotSelector);
    if (!dots.length) return;
    var last = dots[dots.length - 1];
    var cr = container.getBoundingClientRect(), lr = last.getBoundingClientRect();
    container.style.setProperty("--line-x", (lr.left - cr.left + lr.width / 2) + "px");
    container.style.setProperty("--line-y", (lr.top - cr.top + lr.height / 2) + "px");
  }
  var lineBlocks = [];
  document.querySelectorAll(".steps").forEach(function (el) { lineBlocks.push([el, ".step__dot"]); });
  document.querySelectorAll(".timeline").forEach(function (el) { lineBlocks.push([el, ".timeline__dot"]); });
  function measureAllLines() { lineBlocks.forEach(function (b) { measureLine(b[0], b[1]); }); }
  if (lineBlocks.length) {
    measureAllLines();
    window.addEventListener("resize", measureAllLines);
    window.addEventListener("load", measureAllLines);
  }

  /* ---- Timeline füllt sich beim Scrollen ---- */
  var timeline = document.querySelector(".timeline");
  var tlFill = timeline && timeline.querySelector(".timeline__fill");
  function updateTimeline() {
    if (!tlFill) return;
    var r = timeline.getBoundingClientRect();
    var top = parseFloat(getComputedStyle(timeline.querySelector(".timeline__fill")).top) || 28;
    var end = parseFloat(timeline.style.getPropertyValue("--line-y")) || r.height;
    var len = Math.max(end - top, 0);
    var vh = window.innerHeight;
    var p = Math.min(Math.max((vh * 0.6 - r.top - top) / len, 0), 1);
    /* scaleY statt height: eine Höhenänderung pro Frame zwingt den Browser
       jedes Mal zum Neuberechnen des Layouts. */
    tlFill.style.height = len + "px";
    tlFill.style.transformOrigin = "top";
    tlFill.style.transform = "scaleY(" + p + ")";
  }
  if (tlFill) { window.addEventListener("scroll", function () { window.requestAnimationFrame(updateTimeline); }, { passive: true }); updateTimeline(); }

  /* ---- Kontaktformular ----
     Versand an den Endpunkt aus data-endpoint (z. B. Web3Forms, Formspree
     oder ein eigenes PHP-Skript beim Hoster). Solange kein Endpunkt
     eingetragen ist, wird nur validiert und ein Hinweis angezeigt. */
  document.querySelectorAll("form[data-contact]").forEach(function (form) {
    var wrap = form.closest(".form");
    var status = wrap.querySelector(".form__status");
    var btn = form.querySelector("button[type=submit]");

    function setError(field, on) {
      var f = field.closest(".field") || field.closest(".consent");
      if (f) f.classList.toggle("is-invalid", on);
    }
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.addEventListener("input", function () { if (el.checkValidity()) setError(el, false); });
      el.addEventListener("blur", function () { if (el.value && !el.checkValidity()) setError(el, true); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form__status";
      var firstInvalid = null;
      form.querySelectorAll("[required]").forEach(function (el) {
        var bad = !el.checkValidity();
        setError(el, bad);
        if (bad && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        status.textContent = "Bitte prüfen Sie die markierten Felder.";
        status.classList.add("is-error");
        return;
      }
      if (form.querySelector(".hp input") && form.querySelector(".hp input").value) return; // Spam-Schutz

      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        status.textContent = "Vorschau: Das Formular funktioniert, der Versand wird aktiviert, sobald das Hosting feststeht. Bis dahin bitte per Telefon oder E-Mail.";
        status.classList.add("is-info");
        return;
      }
      btn.disabled = true; btn.classList.add("is-loading");
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
        .then(function (r) { return r.text().then(function (t) { return { ok: r.ok, text: t }; }); })
        .then(function (res) {
          /* Nur als gesendet melden, wenn der Server das auch bestätigt */
          var data = null;
          try { data = JSON.parse(res.text); } catch (e) { /* keine JSON-Antwort */ }
          if (!res.ok || !data || data.ok !== true) throw new Error("kein Versand");
          wrap.classList.add("is-sent");
          wrap.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function () {
          /* In der lokalen Vorschau gibt es kein PHP – das ist kein echter Fehler */
          var vorschau = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === "file:";
          if (vorschau) {
            status.textContent = "Vorschau: Der Versand an info@waigelbau.de läuft erst auf dem Webspace (dort gibt es PHP). Das Formular selbst funktioniert.";
            status.classList.add("is-info");
            return;
          }
          status.innerHTML = 'Die Nachricht konnte leider nicht gesendet werden. Bitte rufen Sie uns an (<a href="tel:+491729502318">+49 172 9502318</a>) oder schreiben Sie an <a href="mailto:info@waigelbau.de">info@waigelbau.de</a>.';
          status.classList.add("is-error");
        })
        .then(function () { btn.disabled = false; btn.classList.remove("is-loading"); });
    });
  });

  /* ---- Vorauswahl über URL, z. B. kontakt.html?thema=sanierung ---- */
  var thema = new URLSearchParams(window.location.search).get("thema");
  if (thema) { var opt = document.querySelector('input[name="projektart"][value="' + thema + '"]'); if (opt) opt.checked = true; }

  onScroll();
})();
