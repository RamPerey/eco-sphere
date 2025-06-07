const body = document.querySelector("body");
const labelMarketing = document.querySelector(".label-marketing");
const labelUmall = document.querySelector(".label-umall");

labelMarketing.addEventListener("mouseenter", () => {
    body.style.backgroundImage = "url('/images/marketing-bg.jpg')";
});


labelMarketing.addEventListener("mouseleave", () => {
    body.style.backgroundImage = "url('/images/bg.jpg')";
});


labelUmall.addEventListener("mouseenter", () => {
    body.style.backgroundImage = "url('/images/umall-bg.jpg')";
});


labelUmall.addEventListener("mouseleave", () => {
    body.style.backgroundImage = "url('/images/bg.jpg')";
});