import fs from "fs";
import { resolve, join } from "path";

function read_and_merge_data_from(path, dataObj){
    var files = fs.readdirSync(path);

    for (var i = 0; i < files.length; ++i) {
        const fullPath = join(path, files[i]);

        delete require.cache[require.resolve(fullPath)];
        Object.assign(dataObj, require(fullPath));
    }

    return dataObj;
}

export function read_and_merge_data(){
    var pathes = [
        "./src/views/data/site/", 
        "./src/views/data/sections/"
    ];

    var data = {};

    for (var i = 0; i < pathes.length; ++i) {
        data = read_and_merge_data_from(resolve(pathes[i]), data);
    }

    return data;
}
