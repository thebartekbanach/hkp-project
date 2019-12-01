const welcomeImage: HTMLElement = <HTMLElement>document.querySelector("#welcome-section .cover");
const welcomeSection: HTMLElement = <HTMLElement>document.querySelector("#welcome-section"); 

function updateBlurValue() {
    let blurValue = 5 * (window.scrollY / welcomeSection.offsetHeight);
    blurValue = blurValue > 5 ? 5 : blurValue;

    welcomeImage.style.filter = `blur(${blurValue}px)`;
}

export function Init() {
    updateBlurValue();
    window.addEventListener("scroll", updateBlurValue);
}