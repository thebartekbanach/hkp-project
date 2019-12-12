import gulp from "gulp";
import sync from "browser-sync";
import open from "open";

export const browserSync = sync.create();

gulp.task("run:sync-server", (done) => {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: "./dist",
            index: "views/index.html"
        },
        open: false,
        cors: true
    });

    done();
});

gulp.task("run:open-browser", () => {
    return open("http://localhost:8080");
});

gulp.task("run:reload-browser", (done) => {
    browserSync.reload();
    done();
});
