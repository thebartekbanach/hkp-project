import { task, series, parallel } from "gulp";

task("clean", parallel(["clean:views", "clean:styles", "clean:scripts", "clean:resources", "clean:server"]));
task("build", parallel(["build:views", "build:styles", "build:scripts", "build:resources", "build:server"]));
task("watch", parallel(["watch:views", "watch:styles", "watch:scripts", "watch:resources", "watch:server"]));

task("share", 
    series([
        "build",
        parallel([
            "watch",
            "run:sync-server",
            "run:sharing"
        ])
    ])
);

task("default",
    series([
        "build",
        parallel([
            "watch",
            "run:sync-server",
            "run:open-browser"
        ])
    ])
);
