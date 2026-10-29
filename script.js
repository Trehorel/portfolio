
/* =========================================
   PORTFOLIO BTS SIO SISR
   Interactions et animations
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Année automatique dans le pied de page
  const footer = document.querySelector(".footer-content");

  if (footer) {
    const year = document.createElement("span");
    year.className = "footer-year";
    year.textContent = new Date().getFullYear();
    footer.appendChild(year);
  }

  // 2. Apparition progressive des sections et des cartes
  const animatedElements = document.querySelectorAll(
    ".section-heading, .content-card, .project-guidance, .contact-panel"
  );

  // Repli si les animations sont désactivées dans le système
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    animatedElements.forEach((element) => {
      element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // 3. Fermeture du menu après le clic sur un lien
  const navigationLinks = document.querySelectorAll(
    ".navigation a"
  );

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigationLinks.forEach((item) => {
        item.classList.remove("active");
      });

      link.classList.add("active");
    });
  });

  // 4. Mise en évidence de la section consultée
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;

            navigationLinks.forEach((link) => {
              const isCurrent =
                link.getAttribute("href") === `#${currentId}`;

              link.classList.toggle("active", isCurrent);
            });
          }
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
