import { Express } from "express";

export default function init(app: Express) {
    app.get("/", (_, res) => {
        res.send("Hello world!");
    });
}
