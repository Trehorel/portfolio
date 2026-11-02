/* =========================================
   PORTFOLIO BTS SIO SISR
   Interactions et animations
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // 1. Année automatique dans le pied de page
  const footer = document.querySelector(".footer-content");

  if (footer && !footer.querySelector(".footer-year")) {
    const year = document.createElement("span");
    year.className = "footer-year";
    year.textContent = new Date().getFullYear();
    footer.appendChild(year);
  }

  // 2. Apparition progressive des éléments
  const animatedElements = document.querySelectorAll(
    ".section-heading, .content-card, .project-guidance, " +
    ".contact-panel, .tp-card, .objectif-card, .competence-tabs"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    animatedElements.forEach((element) => {
      element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    animatedElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // 3. Onglets interactifs des compétences
  const tabs = document.querySelectorAll(".competence-tab");
  const panels = document.querySelectorAll(".competence-panel");

  function activateTab(tab) {
    const targetId = tab.dataset.target;

    tabs.forEach((item) => {
      const selected = item === tab;

      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel.id === targetId;

      panel.classList.toggle("active", selected);
      panel.hidden = !selected;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    // Navigation au clavier avec les flèches
    tab.addEventListener("keydown", (event) => {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft"
      ) return;

      event.preventDefault();

      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (index + direction + tabs.length) % tabs.length;

      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });

  // État initial des panneaux
  if (tabs.length > 0) {
    const initialTab =
      document.querySelector(".competence-tab.active") || tabs[0];

    activateTab(initialTab);
  }

  // 4. Mise en évidence des liens de navigation
  const navigationLinks = document.querySelectorAll(".navigation a");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigationLinks.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");
    });
  });

  // 5. Détection de la section consultée
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navigationLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isCurrent);
          });
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px"
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

});
