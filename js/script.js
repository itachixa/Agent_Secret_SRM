document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".fade-in");

    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, index * 300); // Chaque élément apparaît 300ms après le précédent
    });
});
let index = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;
const sliderWrapper = document.querySelector(".slider-wrapper");

function nextSlide() {
    index=index+1;
    if (index >= totalSlides) {
        index = 0;
    }
    sliderWrapper.style.transform = `translateX(${-index * 34}%)`;
}


setInterval(nextSlide, 3000);


