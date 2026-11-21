
document.addEventListener("DOMContentLoaded", () => {

  // Année automatique dans le pied de page
  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // Détection de la page actuelle
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".sidebar-nav a").forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Menu mobile
  const menuButton = document.querySelector(".mobile-menu-button");
  const sidebar = document.querySelector(".sidebar");

  if (menuButton && sidebar) {
    menuButton.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Fermer le menu" : "Ouvrir le menu"
      );
      menuButton.textContent = isOpen ? "×" : "☰";
    });

    document.addEventListener("click", event => {
      if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        sidebar.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
        menuButton.textContent = "☰";
      }
    });
  }

  // Animations d'apparition
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });
  }

  // Onglets de la page compétences
  const tabs = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");

  function activateTab(tab) {
    const targetId = tab.dataset.target;

    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
      item.setAttribute("tabindex", active ? "0" : "-1");
    });

    panels.forEach(panel => {
      panel.hidden = panel.id !== targetId;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", event => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();

        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + direction + tabs.length) % tabs.length;

        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      }
    });
  });

  if (tabs.length > 0) {
    const initiallyActive = document.querySelector(".tab-button.active");
    activateTab(initiallyActive || tabs[0]);
  }

  // Un seul TP ouvert à la fois
  const tpCards = document.querySelectorAll(".tp-card");

  tpCards.forEach(card => {
    card.addEventListener("toggle", () => {
      if (card.open) {
        tpCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.open = false;
          }
        });
      }
    });
  });

});
