import { task } from "gulp";
import sync from "browser-sync";
import open from "open";
import dotenv from "dotenv";
import { getEnvironmentVariables } from "./scripts/get-environment-variables";

const { BROWSERSYNC_LISTENING_PORT } = getEnvironmentVariables();

export const browserSync = sync.create();

task("run:sync-server", (done) => {
    browserSync.init({
        port: BROWSERSYNC_LISTENING_PORT,
        server: {
            baseDir: "./dist",
            index: "views/index.html"
        },
        open: false,
        cors: true
    });

    done();
});

task("run:open-browser", () => {
    return open("http://localhost:" + BROWSERSYNC_LISTENING_PORT);
});

task("run:reload-browser", (done) => {
    browserSync.reload();
    done();
});
