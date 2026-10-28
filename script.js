"use strict";

// simple function to use for callback in the intersection observer
const changeNav = (entries, observer) => {
    entries.forEach((entry) => {
        // verify the element is intersecting
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            // remove old active class
            const oldActive = document.querySelector(".active");
            if (oldActive !== null) {
                oldActive.classList.remove("active");
            }
            // get id of the intersecting section
            const id = entry.target.getAttribute("id");
            // find matching link & add appropriate class
            const newLink = document.querySelector(`[href="#${id}"]`)
            if (newLink !== null) {
                newLink.classList.add("active");
            }
        }
    });
}

// init the observer
const options = {
    threshold: 0.55
}

if (document.body.classList.contains("blog-overview")) {
    setupOverviewNavigation();
} else {
    const observer = new IntersectionObserver(changeNav, options);

    // target the elements to be observed
    const sections = document.querySelectorAll(".hero, section, footer");
    sections.forEach((section) => {
        observer.observe(section);
    });
}

function setupOverviewNavigation() {
    const header = document.querySelector("header");
    const nav = header.querySelector("nav");

    function targetFromHash(hash) {
        try {
            return document.getElementById(decodeURIComponent(hash.slice(1)));
        } catch {
            return null;
        }
    }

    const items = [];
    const links = nav.querySelectorAll("a");

    for (const link of links) {
        const url = new URL(link.href);
        const isSamePage = url.origin === location.origin && url.pathname === location.pathname;
        if (!isSamePage || !url.hash) continue;

        const target = targetFromHash(url.hash);
        if (target) {
            items.push({ link, target });
        }
    }
    if (!items.length) return;

    function markActive(selected) {
        items.forEach(({ link }) => {
            const active = link === selected.link;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }

    function hashItem() {
        const target = targetFromHash(location.hash);
        return items.find((item) => item.target === target || (target && item.target.contains(target)));
    }

    function updateActive() {
        const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollRange <= 1) {
            markActive(hashItem() || items[0]);
            return;
        }
        const readingLine = header.getBoundingClientRect().bottom + 26;
        let selected = items[0];
        items.forEach((item) => {
            if (item.target.getBoundingClientRect().top <= readingLine) selected = item;
        });
        // Short desktop pages may reach the bottom before the last anchor can align.
        if (window.scrollY > 0 && window.scrollY >= scrollRange - 1) selected = items.at(-1);
        markActive(selected);
    }

    let scheduled = false;
    function scheduleUpdate() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            if (!nav.classList.contains("responsive")) updateActive();
        });
    }

    new ResizeObserver(() => {
        // The expanded mobile menu is an overlay, not the normal header height.
        if (nav.classList.contains("responsive")) return;
        document.body.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
        scheduleUpdate();
    }).observe(header);
    items.forEach((item) => item.link.addEventListener("click", () => markActive(item)));
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", () => {
        const item = hashItem();
        if (item) markActive(item);
        else scheduleUpdate();
    });
    window.addEventListener("pageshow", scheduleUpdate);
    markActive(hashItem() || items[0]);
}

/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function toggleHamburgerMenu() {
    const nav = document.querySelector("header nav");
    const CLASS_NAME = "responsive";
    const isOpen = nav.classList.contains(CLASS_NAME);

    if (isOpen) {
        nav.classList.remove(CLASS_NAME);
    } else {
        nav.classList.add(CLASS_NAME);
    }

    hamburgerMenuButton.setAttribute("aria-expanded", !isOpen);
}

function closeHamburgerMenu() {
    const nav = document.querySelector("header nav");
    nav.classList.remove("responsive");

    hamburgerMenuButton.setAttribute("aria-expanded", "false");
}

function resetResponsiveState() {
    const menuBreakpoint = 700;
    if (window.innerWidth > menuBreakpoint) {
        closeHamburgerMenu();
    }
}

const hamburgerMenuButton = document.querySelector(".hamburger-menu");
hamburgerMenuButton.addEventListener("click", toggleHamburgerMenu);

const navLinks = document.querySelectorAll("#nav a");
navLinks.forEach(link => {
    link.addEventListener("click", closeHamburgerMenu);
});

window.addEventListener("resize", resetResponsiveState);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hamburgerMenuButton.getAttribute("aria-expanded") === "true") {
        closeHamburgerMenu();
        hamburgerMenuButton.focus();
    }
});

// FAQ content stays in HTML so it can later be supplied by a CMS or translated.
const faqTabs = Array.from(document.querySelectorAll(".FAQ__questions [role='tab']"));

function selectFaqTab(selectedTab) {
    faqTabs.forEach((tab) => {
        const isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        document.getElementById(tab.getAttribute("aria-controls")).hidden = !isSelected;
    });
}

function selectFaqFromHash() {
    let targetId;
    try {
        targetId = decodeURIComponent(window.location.hash.slice(1));
    } catch {
        return;
    }
    const selectedTab = faqTabs.find((tab) =>
        tab.id === targetId || tab.getAttribute("aria-controls") === targetId
    );
    if (!selectedTab) return;

    selectFaqTab(selectedTab);
    // Show the questions together with the answer, below the fixed header.
    requestAnimationFrame(() => {
        document.getElementById("FAQ").scrollIntoView({ block: "start" });
    });
}

selectFaqFromHash();
window.addEventListener("hashchange", selectFaqFromHash);
// Image loading and the browser's initial fragment jump can change the position.
window.addEventListener("load", selectFaqFromHash);

faqTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectFaqTab(tab));
    tab.addEventListener("keydown", (event) => {
        let nextIndex;
        switch (event.key) {
            case "ArrowDown":
                nextIndex = (index + 1) % faqTabs.length;
                break;
            case "ArrowUp":
                nextIndex = (index - 1 + faqTabs.length) % faqTabs.length;
                break;
            case "Home":
                nextIndex = 0;
                break;
            case "End":
                nextIndex = faqTabs.length - 1;
                break;
            default:
                return;
        }

        event.preventDefault();
        selectFaqTab(faqTabs[nextIndex]);
        faqTabs[nextIndex].focus({ preventScroll: true });
    });
});

const clipboardButtons = document.querySelectorAll(".contact-copy");
clipboardButtons.forEach((button) => {
    button.addEventListener("click", copyToClipboard);
});

async function copyToClipboard(event) {
    const button = event.currentTarget;
    const value = button.dataset.copyValue;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
        } else {
            copyToClipboardFallback(value);
        }

        showCopyFeedback(button, "Kopiert", true);
    } catch {
        showCopyFeedback(button, "Kopieren fehlgeschlagen", false);
    }
}

function copyToClipboardFallback(value) {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();

    let copied = false;
    try {
        copied = document.execCommand("copy");
    } finally {
        textArea.remove();
    }

    if (!copied) {
        throw new Error("Copy command failed");
    }
}

function showCopyFeedback(button, message, wasSuccessful) {
    const label = button.dataset.copyLabel;
    const feedback = button.querySelector(".contact-copy__feedback");

    window.clearTimeout(button.copyFeedbackTimeout);
    button.classList.toggle("is-copied", wasSuccessful);
    button.classList.toggle("has-copy-error", !wasSuccessful);
    button.setAttribute(
        "aria-label",
        wasSuccessful ? `${label} kopiert` : `${label} konnte nicht kopiert werden`
    );
    feedback.textContent = message;

    button.copyFeedbackTimeout = window.setTimeout(() => {
        button.classList.remove("is-copied", "has-copy-error");
        button.setAttribute("aria-label", `${label} ${button.dataset.copyValue} kopieren`);
        feedback.textContent = "";
    }, 2500);
}
