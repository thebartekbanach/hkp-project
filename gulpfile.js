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
    buffer = require("vinyl-buffer"),
    liveServer = require("live-server"),
    localtunnel = require("localtunnel"),
    openBrowser = require("open"),
    chalk = require("chalk");

function read_and_merge_data_from(path, dataObj){
    var files = fs.readdirSync(path);

    for(var i = 0; i < files.length; ++i){
        delete require.cache[require.resolve(path + files[i])];
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
gulp.task("build:ts", gulp.series("clean:ts", function build_ts() {
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
}));

gulp.task("build:sass", gulp.series("clean:sass", function build_sass() {
    return gulp
        .src("./src/styles/style.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(rename("site.css"))
        .pipe(gulp.dest("dist/styles/"))
        .pipe(cssmin())
        .pipe(rename("site.min.css"))
        .pipe(gulp.dest("dist/styles/"));
}));

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

gulp.task("watch", gulp.parallel(["watch:ts", "watch:sass", "watch:views", "watch:res"]));

gulp.task("run:live-server", function () {
    const params = {
        port: 8080,
        host: "127.0.0.1",
        root: "./dist",
        file: "./views/index.html",
        wait: 1000,
        logLevel: 0,
    };

    liveServer.start(params);

    console.log(chalk.greenBright("Live server available under: ") + chalk.bgGreen(chalk.black(" http://localhost:8080 ")))
});

function createLocaltunnelConnection(port, approachNumber = 0) {
    if (approachNumber > 10) {
        console.error(chalk.red("Maximum number of localtunnel tunnel creation approaches exceeded!"));
        process.exit();
    }

    localtunnel({ port }).then(function (tunnel) {
        tunnel.url = tunnel.url.replace("https", "http");

        console.log(approachNumber == 0
            ? (chalk.greenBright("Shared under: ") + chalk.bgGreen(chalk.black(" " + tunnel.url + " ")))
            : (chalk.yellowBright("Reshared under: ") + chalk.bgYellowBright(chalk.black(" " + tunnel.url + " "))));

        openBrowser(tunnel.url);

        tunnel.on("close", function () {
            console.error(chalk.red("Localtunnel connection " + (approachNumber + 1) + " lost"));
            createLocaltunnelConnection(port, approachNumber + 1)
        });
    });
}

gulp.task("run:sharing", function () {
    createLocaltunnelConnection(8080);
});

gulp.task("run:browser-local", function () {
    openBrowser("http://localhost:8080");
});

gulp.task("share", 
    gulp.series([
        "build",
        gulp.parallel([
            "watch",
            "run:live-server",
            "run:sharing"
        ])
    ])
);

gulp.task("default",
    gulp.series([
        "build",
        gulp.parallel([
            "watch",
            "run:live-server",
            "run:browser-local"
        ])
    ])
);