import gulp from "gulp";
import sync from "browser-sync";
import open from "open";

export const browserSync = sync.create();

gulp.task("run:sync-server", () => {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: "./dist",
            index: "views/index.html"
        },
        open: false
    });
});

gulp.task("run:open-browser", () => {
    open("http://localhost:8080");
});

gulp.task("run:reload-browser", () => {
    browserSync.reload();
});
