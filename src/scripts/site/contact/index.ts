import GoogleMapsLoader = require("google-maps");

function isPageScrolledBottom() {
    return (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2;
}

function scrollToBottom(smooth: boolean = false) {
    const body = document.body;
    const html = document.documentElement;

    const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
    );

    if (smooth) {
        window.scrollTo({ left: 0, top: height, behavior: "smooth" });
    } else {
        window.scrollTo(0, height);
    }
}

function scrollSmoothlyToBottomOfPage(): Promise<void> {
    return new Promise((resolve) => {
        let timeout = false;

        const checkScroll = () => {
            if (isPageScrolledBottom() || timeout) {
                resolve();
            } else {
                setTimeout(checkScroll, 100);
            }
        };

        scrollToBottom(true);
        setTimeout(() => timeout = true, 1000);
        checkScroll();
    });
}

async function expandMapElement(mapElement: Element) {
    if (!isPageScrolledBottom()) {
        await scrollSmoothlyToBottomOfPage();
    }

    let timeout = false;

    const updateAnimation = () => {
        scrollToBottom();

        if (!timeout) {
            requestAnimationFrame(updateAnimation);
        }
    };

    mapElement.classList.add("shown");
    setTimeout(() => timeout = true, 1000);
    updateAnimation();
}

function toggleGoogleMaps() {
    const mapElement = document.querySelector("#kontakt .map");

    if (mapElement.classList.contains("shown")) {
        mapElement.classList.remove("shown");
        return;
    }

    if (process.env.GOOGLE_MAPS_APIKEY === "unset") {
        expandMapElement(mapElement);
        return;
    }

    if (GoogleMapsLoader.isLoaded()) {
        expandMapElement(mapElement);
        return;
    }

    GoogleMapsLoader.load(() => {
        const map = new google.maps.Map(mapElement.querySelector(".google-map"));
        mapElement.classList.add("shown");
    });
}

export function initLocationMap() {
    const mapToggleButton = document.querySelector(".contact[href='#find-us-on-map']");
    mapToggleButton.addEventListener("click", toggleGoogleMaps);

    if (process.env.GOOGLE_MAPS_APIKEY === "unset") {
        return;
    }

    GoogleMapsLoader.KEY = process.env.GOOGLE_MAPS_APIKEY;
    GoogleMapsLoader.LANGUAGE = "pl";
    GoogleMapsLoader.REGION = "PL";
    GoogleMapsLoader.LIBRARIES = ["places"];
}
