import { LazyLoadController } from "./lazyLoadController";
import { initializePswp } from "./photoswipeInit";

export function initGallery() {
    initializePswp();

    const lazyLoadController = new LazyLoadController();
    lazyLoadController.initialize();
}
