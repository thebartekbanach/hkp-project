import gulp from "gulp";
import sync from "browser-sync";
import open from "open";
import dotenv from "dotenv";
import chalk from "chalk";

const { BROWSERSYNC_LISTENING_PORT } = dotenv.config().parsed;

export const browserSync = sync.create();

gulp.task("run:sync-server", (done) => {
    browserSync.init({
        port: BROWSERSYNC_LISTENING_PORT,
        server: {
            baseDir: "./dist",
            index: "views/index.html"
        },
        open: false,
        cors: true,
        plugins: ["browser-sync-logger"]
    });

    done();
});

gulp.task("run:open-browser", () => {
    return open("http://localhost:" + BROWSERSYNC_LISTENING_PORT);
});

gulp.task("run:reload-browser", (done) => {
    browserSync.reload();
    done();
});
