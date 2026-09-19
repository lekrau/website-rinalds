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

const hamburgerMenuButton = document.querySelector(".hamburger-menu");
hamburgerMenuButton.addEventListener("click", toggleHamburgerMenu);

function closeHamburgerMenu() {
    const nav = document.querySelector("header nav");
    nav.classList.remove("responsive");

    hamburgerMenuButton.setAttribute("aria-expanded", "false");
}