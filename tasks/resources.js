import gulp from "gulp";
import rimraf from "rimraf";
import svgmin from "gulp-svgmin";
import { transformImages } from "./scripts/transform-images";
import { makeGalleryThumbnails } from "./scripts/make-gallery-thumbnails";

gulp.task("clean:resources", function(cb) {
    rimraf("dist/res/**/*", cb);
});

gulp.task("build:resources", async function() {
    // copy font files
    const fontType = (ext) => `src/resources/fonts/**/*.${ext}`;
    
    await gulp
        .src([
            fontType("eot"),
            fontType("ttf"),
            fontType("woff"),
            fontType("woff2")
        ])
        .pipe(gulp.dest("dist/res/fonts"));

    // minify and write all svg images
    await gulp
        .src("src/resources/**/*.svg")
        .pipe(svgmin())
        .pipe(gulp.dest("dist/res/"));

    await gulp
        .src([
            "src/resources/img/**/*.jpg",
            "src/resources/img/**/*.png",
            "!src/resources/img/sections/realizations/*.png",
            "!src/resources/img/sections/realizations/*.jpg",
        ])
        .pipe(gulp.dest("dist/res/img"));

    // make thumbnails and compress source images
    await gulp
        .src("src/resources/img/sections/realizations/*.png")
        .pipe(transformImages(makeGalleryThumbnails(20)))
        .pipe(gulp.dest("dist/res/img/sections/realizations"));

    await gulp
        .src([
            "node_modules/photoswipe/dist/default-skin/*.png",
            "node_modules/photoswipe/dist/default-skin/*.svg",
            "node_modules/photoswipe/dist/default-skin/*.gif",
        ])
        .pipe(gulp.dest("dist/res/img/photoswipe"));

});


gulp.task("watch:resources", function () {
    gulp.watch("src/resources/**/*", gulp.series(["build:resources", "run:reload-browser"]));
});
