import fs from "fs";
import { resolve, join } from "path";
import sharp from "sharp";

function read_and_merge_data_from(path, dataObj) {
    var files = fs.readdirSync(path);

    for (var i = 0; i < files.length; ++i) {
        const fullPath = join(path, files[i]);

        delete require.cache[require.resolve(fullPath)];
        Object.assign(dataObj, require(fullPath));
    }

    return dataObj;
}

export async function read_and_merge_data() {
    var pathes = [
        "./src/views/data/site/", 
        "./src/views/data/sections/"
    ];

    var data = {};

    for (var i = 0; i < pathes.length; ++i) {
        data = read_and_merge_data_from(resolve(pathes[i]), data);
    }

    // realizations gallery data section transformations:
    for (const realization of data.realizationsData) {
        const meta = await sharp("src/" + realization.img).metadata();

        realization.img = realization.img.replace("/resources", "/res");
        realization.img = realization.img.replace(".png", ".jpg");
        realization.img = realization.img.replace(".jpeg", ".jpg");

        realization.thumb = realization.img.replace(".jpg", ".thumb.jpg");
        
        realization.width = meta.width;
        realization.height = meta.height;
    }

    return data;
}
