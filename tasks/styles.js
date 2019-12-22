import { task, series, src, dest, watch } from "gulp";
import rimraf from "rimraf";
import rename from "gulp-rename";
import sass from "gulp-sass";
import cssmin from "gulp-cssmin";

import { browserSync } from "./sync-server";

task("clean:styles", function (cb) {
    rimraf("dist/styles/**/*", cb);
});

task("build:styles", series("clean:styles", function build_styles() {
    return src("./src/styles/style.scss")
        .pipe(sass({ includePaths: [
            "node_modules", "src/styles", "."
        ]}).on("error", sass.logError))
        .pipe(rename("site.css"))
        .pipe(dest("dist/styles/"))
        .pipe(cssmin())
        .pipe(rename("site.min.css"))
        .pipe(dest("dist/styles/"))
        .pipe(browserSync.stream());
}));

task("watch:styles", function (done) {
    watch("src/styles/**/*", series(["build:styles"]));
    done();
});
