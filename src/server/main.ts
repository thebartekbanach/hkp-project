import express from "express";

const PORT = process.env.PORT || 8081;
const app = express();

app.get("/", (_, res) => {
    res.send("Hello world!");
});

app.listen(PORT).on("listening", () => {
    console.log("Server is listening on port " + PORT);
});
