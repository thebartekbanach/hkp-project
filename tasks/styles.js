import gulp from "gulp";
import rimraf from "rimraf";
import rename from "gulp-rename";
import sass from "gulp-sass";
import cssmin from "gulp-cssmin";

import { browserSync } from "./sync-server";

gulp.task("clean:styles", function (cb) {
    rimraf("dist/styles/**/*", cb);
});

gulp.task("build:styles", gulp.series("clean:styles", function build_styles() {
    return gulp
        .src("./src/styles/style.scss")
        .pipe(sass({ includePaths: [
            "node_modules", "src/styles", "."
        ]}).on("error", sass.logError))
        .pipe(rename("site.css"))
        .pipe(gulp.dest("dist/styles/"))
        .pipe(cssmin())
        .pipe(rename("site.min.css"))
        .pipe(gulp.dest("dist/styles/"))
        .pipe(browserSync.stream());
}));

gulp.task("watch:styles", function () {
    gulp.watch("src/styles/**/*", gulp.series(["build:styles"]));
});
