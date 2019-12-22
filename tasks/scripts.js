import { task, series, dest, watch } from "gulp";
import rimraf from "rimraf";
import browserify from "browserify";
import tsify from "tsify";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import sourcemaps from "gulp-sourcemaps";
import prettyError from "pretty-error";
import envify from "envify/custom";
import { browserSync } from "./sync-server";
import { getEnvironmentVariables } from "./scripts/get-environment-variables"

// If false then reloads browser
// after scripts change instead of
// injecting new scripts into page.
// Useful when using global data store like redux.
const STREAM_SCRIPTS = false;

task("clean:scripts", function (cb) {
    rimraf("dist/scripts/**/*", cb);
});

task("build:scripts", series("clean:scripts", function build_scripts() {
    const result = browserify({
            basedir: "./src/scripts",
            debug: true,
            entries: ["main.ts"],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify, require("../tsconfig.client.json").compilerOptions)
        .transform("babelify", {
            presets: ["@babel/preset-env"],
            extensions: [".ts"]
        })
        .transform(envify(getEnvironmentVariables()))
        .bundle()
        .on("error", (e) => console.error(new prettyError().render(e)))
        .pipe(source("site.js"))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write("./"))
        .pipe(dest("dist/scripts"));

    return STREAM_SCRIPTS
        ? result.pipe(browserSync.stream())
        : result;
}));

task("watch:scripts", function (done) {
    watch("src/scripts/**/*", series(
        STREAM_SCRIPTS
            ? ["build:scripts"]
            : ["build:scripts", "run:reload-browser"]
    ));

    done();
});
