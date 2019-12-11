
export class LazyLoadController {
    private galleryPosition: ClientRect | DOMRect = null;
    private galleryItems: NodeListOf<HTMLLIElement> = null;

    public initialize() {
        this.galleryItems = document.querySelectorAll<HTMLLIElement>(".realizations .realization");

        this.onResize(); // initialize gallery position
        this.onScroll(); // page can by scrolled before initialization

        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("resize", this.onResize);
    }

    private async startLoadingThumbails(): Promise<void> {
        for (const item of this.galleryItems) {
            item.classList.toggle("loading", true);
            const imageElement = item.querySelector("img");
            const thumbnailSrc = imageElement.getAttribute("data-lazy-src");

            try {
                await this.loadThumbnail(thumbnailSrc);
            } catch (error) {
                // tslint:disable-next-line: no-console
                console.error(error);
                item.classList.add("load-error");
                continue;
            }

            item.classList.toggle("loading", false);
            imageElement.setAttribute("src", thumbnailSrc);
            item.classList.add("shown");
        }
    }

    private loadThumbnail(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new Image();
            loader.addEventListener("load", resolve as any);
            loader.addEventListener("error", reject);
            loader.src = url;
        });
    }

    private onScroll = async () => {
        if (this.galleryPosition.top - 100 > window.scrollY + window.innerHeight) {
            return;
        }

        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onResize);

        this.startLoadingThumbails();
    }

    private onResize = () => {
        const section = document.getElementById("realizacje");
        this.galleryPosition = section.getBoundingClientRect();
    }
}
