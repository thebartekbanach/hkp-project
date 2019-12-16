import GoogleMapsLoader = require("google-maps");

function expandMapElement(mapElement: Element) {
    mapElement.classList.add("shown");

    let timeout = false;

    const scrollToBottom = () => {
        const body = document.body;
        const html = document.documentElement;

        const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );

        window.scrollTo(0, height);
    };

    const updateAnimation = () => {
        scrollToBottom();

        if (!timeout) {
            requestAnimationFrame(updateAnimation);
        }
    };

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
