import { task, series, src, dest, watch } from "gulp";
import rimraf from "rimraf";
import ts from "gulp-typescript";
import sourcemaps from "gulp-sourcemaps";
import nodemon from "gulp-nodemon";

const serverProject = ts.createProject(require("../tsconfig.server.json").compilerOptions);
let application = null;

task("clean:server", function (cb) {
    rimraf("dist/server/**/*", cb);
});

task("build:server", series("clean:server", function build_server() {
    return src("src/server/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(serverProject())
        .pipe(sourcemaps.write())
        .pipe(dest("dist/server/"));
}));

task("run:restart-server", function reload_server(done) {
    application.emit("restart");
    done();
})

function run_dev_server(done) {
    application = nodemon({
        script: "dist/server/main.js",
        ignore: "**/*.*",
        env: process.env,
        done
    })

    .on("crash", function() {
        console.error("Server has crashed!\n")
        application.emit("restart", 3);
    });

    done();
}

function watch_server() {
    return watch("src/server/**/*.ts", series(["build:server", "run:restart-server"]));
}

task("watch:server", series(run_dev_server, watch_server));
