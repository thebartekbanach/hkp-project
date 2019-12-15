import { makeApiUrlFor } from "../../lib/api";

function downloadFullBackground() {
    const normalImageUrl = makeApiUrlFor(`/welcome/${window.screen.availWidth}/${window.screen.availHeight}`);

    const loader = new Image();

    loader.addEventListener("load", () => {
        const image = document.querySelector<HTMLImageElement>("#welcome-section .background.normal");
        const placeholder = document.querySelector<HTMLImageElement>("#welcome-section .background.blurred");

        image.setAttribute("src", normalImageUrl);
        image.classList.remove("hidden");
        placeholder.classList.add("hidden");
    });

    loader.src = normalImageUrl;
}

export function startLoadingBackground() {
    const { availWidth: width, availHeight: height } = window.screen;

    const aspectRatio = width > height
        ? width / height
        : height / width;

    const placeholderUrl = width > height
        ? makeApiUrlFor(`/welcome/${200 * aspectRatio}/200`)
        : makeApiUrlFor(`/welcome/200/${200 * aspectRatio}`);

    const loader = new Image();

    loader.addEventListener("load", () => {
        const image = document.querySelector<HTMLImageElement>("#welcome-section .background.blurred");
        image.setAttribute("src", placeholderUrl);
        image.classList.remove("hidden");

        downloadFullBackground();
    });

    loader.src = placeholderUrl;
}
