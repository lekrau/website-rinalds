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