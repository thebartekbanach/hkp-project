/// <binding BeforeBuild='clean' AfterBuild='build' Clean='clean' ProjectOpened='watch' />
"use strict";

var gulp = require('gulp'),
    rimraf = require('rimraf'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    nunjucks = require('gulp-nunjucks-render'),
    babel = require('gulp-babel'),
    data = require('gulp-data'),
    htmlmin = require('gulp-htmlmin'),
    fs = require("fs");

function read_and_merge_data(){
    var path = "./src/views/data/"
    var files = fs.readdirSync(path);
    var dataObj = {};

    for(var i = 0; i < files.length; ++i){
        Object.assign(dataObj, require(path + files[i]));
    }

    return dataObj;
}

// clean
gulp.task("clean:js", function (cb) {
    rimraf("dist/scripts/**/*.js", cb);
});

gulp.task("clean:css", function (cb) {
    rimraf("dist/styles/**/*.css", cb);
});

gulp.task("clean:views", function (cb) {
    rimraf("dist/views/**/*.html", cb);
});

gulp.task("clean:resources", function(cb) {
    rimraf("dist/resources/**/*", cb);
});

gulp.task("clean:simple", ["clean:js", "clean:css", "clean:views"]);
gulp.task("clean:all", ["clean:js", "clean:css", "clean:views", "clean:resources"]);

// build
gulp.task("build:js", function () {
    gulp
        .src("src/scripts/script.js")
        .pipe(babel({presets: ['es2015']}))
        .pipe(rename("site.js"))
        .pipe(gulp.dest("dist/scripts/"))
        .pipe(uglify())
        .pipe(rename("site.min.js"))
        .pipe(gulp.dest("dist/scripts/"))
});

gulp.task("build:css", function () {
    gulp
        .src("src/styles/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('site.css'))
        .pipe(gulp.dest("dist/styles/"))
        .pipe(cssmin())
        .pipe(rename('site.min.css'))
        .pipe(gulp.dest("dist/styles/"));
});

gulp.task('build:html', function () {
    gulp
        .src('src/views/index.nunjucks')
        .pipe(data(function() {
            return read_and_merge_data();
          }))
        .pipe(nunjucks({
            path: ['src/views']
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/views/'));
});

gulp.task('build:resources', function() {
    gulp
        .src('src/resources/**/*')
        .pipe(gulp.dest('dist/res/'));
})

gulp.task("build:simple", ["build:js", "build:css", "build:html", "build:resources"]);
gulp.task("build:all", ["build:js", "build:css", "build:html", "build:resources"]);

// watch
gulp.task('watch:css', function () {
    gulp.watch('src/styles/**/*.scss', ['build:css']);
});

gulp.task('watch:js', function () {
    gulp.watch('src/scripts/**/*.js', ['build:js']);
});

gulp.task('watch:html', function () {
    gulp.watch('src/views/**/*', ['build:html']);
});

gulp.task('watch:resources', function () {
    gulp.watch('src/resources/**/*', ['build:resources']);
});

// watch
gulp.task('watch:simple', ['watch:js', 'watch:css', 'watch:html']);
gulp.task('watch:all', ['watch:js', 'watch:css', 'watch:html', 'watch:resources']);

