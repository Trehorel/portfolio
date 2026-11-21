
/* =========================================
   PORTFOLIO BTS SIO SISR
   Navigation multipage et interactions
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


    // 2. Détection de la page actuelle

    const currentPage = window.location.pathname
        .split("/")
        .pop() || "index.html";

    const navigationLinks = document.querySelectorAll(".navigation a");

    navigationLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });


    // 3. Apparition progressive des éléments

    const animatedElements = document.querySelectorAll(
        ".section-heading, .content-card, .project-guidance, " +
        ".contact-panel, .tp-card, .objectif-card, " +
        ".competence-tabs, .hero-card, .profile-highlight"
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


    // 4. Onglets interactifs des compétences
    // Fonctionnement uniquement sur la page compétences

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

        tab.addEventListener("keydown", (event) => {

            if (
                event.key !== "ArrowRight" &&
                event.key !== "ArrowLeft"
            ) return;

            event.preventDefault();

            const direction =
                event.key === "ArrowRight" ? 1 : -1;

            const nextIndex =
                (index + direction + tabs.length) % tabs.length;

            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);

        });

    });

    if (tabs.length > 0) {

        const initialTab =
            document.querySelector(".competence-tab.active") || tabs[0];

        activateTab(initialTab);

    }


    // 5. Gestion des cartes de travaux pratiques

    const tpCards = document.querySelectorAll(".tp-card");

    tpCards.forEach((card) => {

        card.addEventListener("toggle", () => {

            if (card.open) {

                tpCards.forEach((otherCard) => {

                    if (otherCard !== card) {
                        otherCard.open = false;
                    }

                });

            }

        });

    });

});
