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

const observer = new IntersectionObserver(changeNav, options);

// target the elements to be observed
const sections = document.querySelectorAll(".hero, section, footer");
sections.forEach((section) => {
    observer.observe(section);
});

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
    if (window.innerWidth > 500) {
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
