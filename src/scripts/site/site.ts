import { initGallery } from "./gallery";
import { initHeader } from "./header";
import { initLocationMap } from "./contact";

export function Init() {
    initHeader();
    initGallery();
    initLocationMap();
}
