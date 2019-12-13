import { initBlur } from "./blur";
import { startLoadingBackground } from "./downloadBackground";
import { initNavbarScroll } from "./navbarScroll";

export function initHeader() {
    initBlur();
    initNavbarScroll();
    startLoadingBackground();
}
