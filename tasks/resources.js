import { task, series, src, dest, watch } from "gulp";
import rimraf from "rimraf";
import svgmin from "gulp-svgmin";
import { transformImages } from "./scripts/transform-images";
import { makeGalleryThumbnails } from "./scripts/make-gallery-thumbnails";

task("clean:resources", function(cb) {
    rimraf("dist/res/**/*", cb);
});

task("build:resources", async function() {
    // copy font files
    const fontType = (ext) => `src/resources/fonts/**/*.${ext}`;
    
    await src([
            fontType("eot"),
            fontType("ttf"),
            fontType("woff"),
            fontType("woff2")
        ])
        .pipe(dest("dist/res/fonts"));

    // minify and write all svg images
    await src("src/resources/**/*.svg")
        .pipe(svgmin())
        .pipe(dest("dist/res/"));

    await src([
            "src/resources/img/**/*.jpg",
            "src/resources/img/**/*.png",
            "!src/resources/img/sections/realizations/*.png",
            "!src/resources/img/sections/realizations/*.jpg",
        ])
        .pipe(dest("dist/res/img"));

    // make thumbnails and compress source images
    await src("src/resources/img/sections/realizations/*.png")
        .pipe(transformImages(makeGalleryThumbnails(20)))
        .pipe(dest("dist/res/img/sections/realizations"));

    await src([
            "node_modules/photoswipe/dist/default-skin/*.png",
            "node_modules/photoswipe/dist/default-skin/*.svg",
            "node_modules/photoswipe/dist/default-skin/*.gif",
        ])
        .pipe(dest("dist/res/img/photoswipe"));

});


task("watch:resources", function (done) {
    watch("src/resources/**/*", series(["build:resources", "run:reload-browser"]));
    done();
});
