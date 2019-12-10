const welcomeImage: HTMLElement = document.querySelector("#welcome-section .cover") as HTMLElement;
const welcomeSection: HTMLElement = document.querySelector("#welcome-section") as HTMLElement;

function updateBlurValue() {
    let blurValue = 5 * (window.scrollY / welcomeSection.offsetHeight);
    blurValue = blurValue > 5 ? 5 : blurValue;

    welcomeImage.style.filter = `blur(${blurValue}px)`;
}

export function initHeader() {
    updateBlurValue();
    window.addEventListener("scroll", updateBlurValue);
}
