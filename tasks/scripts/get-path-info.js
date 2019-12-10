import normalize from "normalize-path";

export function getPathInfo(path, cwd = process.cwd()) { // eslint-disable-line no-undef
    const fileNameWithExt = path.replace(/^.*[\\/]/, ""),
        fileExt = fileNameWithExt.substring(fileNameWithExt.lastIndexOf(".") + 1),
        fileNameWithoutExt = fileNameWithExt.substring(0, fileNameWithExt.length - fileExt.length - 1),
        filePath = normalize(path.substring(0, path.length - fileNameWithExt.length).replace(cwd, ""));

    return {
        fullName: normalize(path),
        fileNameWithExt,
        fileNameWithoutExt,
        fileExt,
        filePath
    };
}
