function changeTheme(){
    document.body.classList.toggle("light-mode");
}
ScrollReveal({
    distance: "60px",
    duration: 1500,
    delay: 200,
    reset: false
});

// Hero Section
ScrollReveal().reveal(".hero-image", {
    origin: "left"
});

ScrollReveal().reveal(".hero-content", {
    origin: "right"
});

// About Section
ScrollReveal().reveal(".about-left", {
    origin: "left"
});

ScrollReveal().reveal(".about-card", {
    origin: "right"
});

// Skill Cards
ScrollReveal().reveal(".skill-box", {
    origin: "bottom",
    interval: 200
});

// Project & Contact Cards
ScrollReveal().reveal("#projects, #contact", {
    origin: "bottom"
});
