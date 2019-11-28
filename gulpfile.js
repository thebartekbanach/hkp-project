/// <binding BeforeBuild="clean" AfterBuild="build" Clean="clean" ProjectOpened="watch" />
"use strict";

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    nunjucks = require("gulp-nunjucks-render"),
    data = require("gulp-data"),
    htmlmin = require("gulp-htmlmin"),
    fs = require("fs"),
    browserify = require("browserify"),
    tsify = require("tsify"),
    source = require("vinyl-source-stream"),
    sourcemaps = require("gulp-sourcemaps"),
    buffer = require("vinyl-buffer");

function read_and_merge_data_from(path, dataObj){
    var files = fs.readdirSync(path);

    for(var i = 0; i < files.length; ++i){
        Object.assign(dataObj, require(path + files[i]));
    }

    return dataObj;
}

function read_and_merge_data(){
    var pathes = [
        "./src/views/data/site/", 
        "./src/views/data/sections/"
    ];

    var data = {};

    for(var i = 0; i < pathes.length; ++i){
        data = read_and_merge_data_from(pathes[i], data);
    }

    return data;
}

// clean
gulp.task("clean:ts", function (cb) {
    rimraf("dist/scripts/**/*", cb);
});

gulp.task("clean:sass", function (cb) {
    rimraf("dist/styles/**/*", cb);
});

gulp.task("clean:views", function (cb) {
    rimraf("dist/views/**/*", cb);
});

gulp.task("clean:res", function(cb) {
    rimraf("dist/res/**/*", cb);
});

gulp.task("clean", gulp.parallel(["clean:ts", "clean:sass", "clean:views", "clean:res"]));

// build
gulp.task("build:ts", gulp.series("clean:ts"), function () {
    return browserify({
        basedir: "./src/scripts",
        debug: true,
        entries: ["main.ts"],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform("babelify", {
        presets: ["es2015"],
        extensions: [".ts"]
    })
    .bundle()
    .pipe(source("site.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("dist/scripts"));
});

gulp.task("build:sass", gulp.series("clean:sass"), function () {
    gulp
        .src("src/styles/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(rename("site.css"))
        .pipe(gulp.dest("dist/styles/"))
        .pipe(cssmin())
        .pipe(rename("site.min.css"))
        .pipe(gulp.dest("dist/styles/"));
});

gulp.task("build:views", gulp.series("clean:views"), function () {
    gulp
        .src("src/views/index.nunjucks")
        .pipe(data(function() {
            return read_and_merge_data();
          }))
        .pipe(nunjucks({
            path: ["src/views"]
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest("dist/views/"));
});

gulp.task("build:res", function() {
    return gulp
        .src("src/resources/**/*")
        .pipe(gulp.dest("dist/res/"));
})

gulp.task("build", gulp.parallel(["build:ts", "build:sass", "build:views", "build:res"]));

// watch
gulp.task("watch:sass", function () {
    gulp.watch("src/styles/**/*", gulp.series(["build:sass"]));
});

gulp.task("watch:ts", function () {
    gulp.watch("src/scripts/**/*", gulp.series(["build:ts"]));
});

gulp.task("watch:views", function () {
    gulp.watch("src/views/**/*", gulp.series(["build:views"]));
});

gulp.task("watch:res", function () {
    gulp.watch("src/resources/**/*", gulp.series(["build:res"]));
});

// watch
gulp.task("watch", gulp.parallel(["watch:ts", "watch:sass", "watch:views", "watch:res"]));

gulp.task("default", gulp.series(["build", "watch"]));