
function updateBlurValue(welcomeImage: HTMLElement, welcomeSection: HTMLElement) {
    let blurValue = 5 * (window.scrollY / welcomeSection.offsetHeight);
    blurValue = blurValue > 5 ? 5 : blurValue;

    welcomeImage.style.filter = `blur(${blurValue}px)`;
}

export function initBlur() {
    const welcomeImage: HTMLElement = document.querySelector("#welcome-section .cover") as HTMLElement;
    const welcomeSection: HTMLElement = document.querySelector("#welcome-section") as HTMLElement;

    const blurProcessor = updateBlurValue.bind(this, welcomeImage, welcomeSection);

    blurProcessor();
    window.addEventListener("scroll", blurProcessor);
}
