
export function getApiEndpointUrl() {
    return process.env.API_SERVER_ENDPOINT
        .replace("$protocol", location.protocol)
        .replace("$hostname", location.hostname)
        .replace("$port", process.env.API_SERVER_LISTENING_PORT);
}

export function makeApiUrlFor(url: string) {
    return getApiEndpointUrl() + url;
}
