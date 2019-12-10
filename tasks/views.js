import gulp from "gulp";
import rimraf from "rimraf";
import data from "gulp-data";
import nunjucks from "gulp-nunjucks-render";
import htmlmin from "gulp-htmlmin";

import { read_and_merge_data } from "./scripts/read-and-merge-data";

gulp.task("clean:views", function (cb) {
    rimraf("dist/views/**/*", cb);
});

gulp.task("build:views", gulp.series("clean:views", function build_views() {
    return gulp
        .src("src/views/index.nunjucks")
        .pipe(data(function() {
            return read_and_merge_data();
        }))
        .pipe(nunjucks({
            path: ["src/views"]
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/views/"));
}));

gulp.task("watch:views", function () {
    gulp.watch("src/views/**/*", gulp.series(["build:views", "run:reload-browser"]));
});
