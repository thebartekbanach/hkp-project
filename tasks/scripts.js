import gulp from "gulp";
import rimraf from "rimraf";
import browserify from "browserify";
import tsify from "tsify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sourcemaps from "gulp-sourcemaps";
import { browserSync } from "./sync-server";

// If false then reloads browser
// after scripts change instead of
// injecting new scripts into page.
// Useful when using global data store like redux.
const STREAM_SCRIPTS = false;

gulp.task("clean:scripts", function (cb) {
    rimraf("dist/scripts/**/*", cb);
});

gulp.task("build:scripts", gulp.series("clean:scripts", function build_scripts() {
    const result = browserify({
            basedir: "./src/scripts",
            debug: true,
            entries: ["main.ts"],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .transform("babelify", {
            presets: ["@babel/preset-env"],
            extensions: [".ts"]
        })
        .bundle()
        .pipe(source("site.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/scripts"));

    return STREAM_SCRIPTS
        ? result.pipe(browserSync.stream())
        : result;
}));

gulp.task("watch:scripts", function () {
    gulp.watch("src/scripts/**/*", gulp.series(
        STREAM_SCRIPTS
            ? ["build:scripts"]
            : ["build:scripts", "run:reload-browser"]
    ));
});
