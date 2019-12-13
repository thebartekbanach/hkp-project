const getApiUrl = (request: string) => `${process.env.API_ENDPOINT}/welcome/${request}`;

function downloadFullBackground() {
    const normalImageUrl = getApiUrl(`${window.screen.availWidth}/${window.screen.availHeight}`);

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
        ? getApiUrl(`${200 * aspectRatio}/200`)
        : getApiUrl(`200/${200 * aspectRatio}`);

    const loader = new Image();

    loader.addEventListener("load", () => {
        const image = document.querySelector<HTMLImageElement>("#welcome-section .background.blurred");
        image.setAttribute("src", placeholderUrl);
        image.classList.remove("hidden");

        downloadFullBackground();
    });

    loader.src = placeholderUrl;
}
