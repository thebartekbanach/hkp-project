import gulp from "gulp";
import rimraf from "rimraf";
import ts from "gulp-typescript";
import sourcemaps from "gulp-sourcemaps";
import nodemon from "gulp-nodemon";

const serverProject = ts.createProject(require("../tsconfig.server.json").compilerOptions);
let application = null;

gulp.task("clean:server", function (cb) {
    rimraf("dist/server/**/*", cb);
});

gulp.task("build:server", gulp.series("clean:server", function build_server() {
    return gulp.src("src/server/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(serverProject())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/server/"));
}));

gulp.task("run:restart-server", function reload_server(done) {
    application.emit("restart");
    done();
})

function run_dev_server(done) {
    application = nodemon({
        script: "dist/server/main.js",
        ignore: "**/*.*",
        done
    })

    .on("crash", function() {
        console.error("Server has crashed!\n")
        application.emit("restart", 3);
    });

    done();
}

function watch_server() {
    return gulp.watch("src/server/**/*.ts", gulp.series(["build:server", "run:restart-server"]));
}

gulp.task("watch:server", gulp.series(run_dev_server, watch_server));
