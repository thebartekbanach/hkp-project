
import express from "express";

import { loadDotenv } from "./lib/loadDotenv";

import addHelloResponse from "./apis/hello";
import addWelcomeBackgroundCropper from "./apis/welcome";

async function main() {
    await loadDotenv();

    const PORT = process.env.API_SERVER_LISTENING_PORT || 8081;
    const app = express();

    addHelloResponse(app);
    addWelcomeBackgroundCropper(app);

    app.listen(PORT).on("listening", () => {
        // tslint:disable-next-line: no-console
        console.log("Server is listening on port " + PORT);
    });
}

main()
    .then(() => console.log("Application started correctly!"))
    .catch((err) => console.error("Application error: ", err));
