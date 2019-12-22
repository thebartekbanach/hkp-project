import { task, series, src, dest, watch } from "gulp";
import rimraf from "rimraf";
import data from "gulp-data";
import nunjucks from "gulp-nunjucks-render";
import htmlmin from "gulp-htmlmin";

import { read_and_merge_data } from "./scripts/read-and-merge-data";

task("clean:views", function (cb) {
    rimraf("dist/views/**/*", cb);
});

task("build:views", series("clean:views", function build_views() {
    return src("src/views/index.nunjucks")
        .pipe(data(read_and_merge_data))
        .pipe(nunjucks({
            path: ["src/views"]
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest("dist/views/"));
}));

task("watch:views", function (done) {
    watch("src/views/**/*", series(["build:views", "run:reload-browser"]));
    done();
});
