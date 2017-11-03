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
    data = require('gulp-data'),
    htmlmin = require('gulp-htmlmin'),
    fs = require("fs"),
    browserify = require('browserify'),
    tsify = require('tsify'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer = require('vinyl-buffer');

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

gulp.task("clean", ["clean:ts", "clean:sass", "clean:views", "clean:res"]);

// build
gulp.task("build:ts", function () {
    gulp.start("clean:ts");
    return browserify({
        basedir: './src/scripts',
        debug: true,
        entries: ['main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('site.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task("build:sass", function () {
    gulp.start("clean:sass");
    gulp
        .src("src/styles/style.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('site.css'))
        .pipe(gulp.dest("dist/styles/"))
        .pipe(cssmin())
        .pipe(rename('site.min.css'))
        .pipe(gulp.dest("dist/styles/"));
});

gulp.task('build:views', function () {
    gulp.start("clean:views");
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

gulp.task('build:res', function() {
    //gulp.start("clean:res");
    gulp
        .src('src/resources/**/*')
        .pipe(gulp.dest('dist/res/'));
})

gulp.task("build", ["build:ts", "build:sass", "build:views", "build:res"]);

// watch
gulp.task('watch:sass', function () {
    gulp.watch('src/styles/**/*', ['build:sass']);
});

gulp.task('watch:ts', function () {
    gulp.watch('src/scripts/**/*', ['build:ts']);
});

gulp.task('watch:views', function () {
    gulp.watch('src/views/**/*', ['build:views']);
});

gulp.task('watch:res', function () {
    gulp.watch('src/resources/**/*', ['build:res']);
});

// watch
gulp.task('watch', ['watch:ts', 'watch:sass', 'watch:views', 'watch:res']);

gulp.task('default', ['build', 'watch']);