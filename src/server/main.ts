import dotenv from "dotenv";
import express from "express";
import addWelcomeBackgroundCropper from "./welcomeBackgroundCropper";

dotenv.config();

const PORT = process.env.API_SERVER_LISTENING_PORT || 8081;
const app = express();

app.get("/", (_, res) => {
    res.send("Hello world!");
});

addWelcomeBackgroundCropper(app);

app.listen(PORT).on("listening", () => {
    // tslint:disable-next-line: no-console
    console.log("Server is listening on port " + PORT);
});
