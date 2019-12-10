import through from "through2";
import Vinyl from "vinyl";

import sharp from "sharp";

import { getPathInfo } from "./get-path-info";

function getFileInfo(file) {

    return {
        ...getPathInfo(file.history[0], file.cwd),
        ...file
    };
}

export const transformImages = (fileTransformer) => through.obj(function(file, _, next) {
    const finfo = getFileInfo(file);

    if(file.isNull() || !(/\.(jpg|jpeg|png)$/.test(finfo.fullName))) {
        return next(null, file);
    }

    // result: null || { addDefault: boolean, files: [{ path: string, contents: buffer }]
    fileTransformer(sharp(finfo.fullName), finfo).then(result => {
        if (result === null) {
            return next(null, file);
        }

        for (const resultFile of result.files) {
            this.push(new Vinyl(resultFile));
        }
        
        if (result.addDefault) {
            return next(null, file);
        }

        return next();
    });
});
