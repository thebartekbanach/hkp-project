import * as PhotoSwipe from "photoswipe";
import * as PhotoSwipeUI_Default from "photoswipe/dist/photoswipe-ui-default"

function parsePhotoswipeItems() {
    const items = document.querySelectorAll(".realizations .realization");
    const result = [];

    const get = (item: Element, property: string) => item.getAttribute("data-" + property);

    for (const item of items) {
        result.push({
            src: get(item, "original-image"),
            title: get(item, "title"),
            w: get(item, "width"),
            h: get(item, "height")
        });
    }

    return result;
}

function openGallery(index: number) {
    const gallery = new PhotoSwipe(
        document.getElementById("pswp-gallery"),
        PhotoSwipeUI_Default,
        parsePhotoswipeItems() as any,
        { index }
    );

    gallery.init();
}

function attachGalleryOpenEvents() {
    const items = document.querySelectorAll<HTMLLIElement>(".realizations .realization");

    items.forEach((item, key) => {
        item.addEventListener("click", openGallery.bind(window, key));
    });
}

export function initializePswp() {
    attachGalleryOpenEvents();
}
