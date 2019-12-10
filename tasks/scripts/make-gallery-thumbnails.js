
export const makeGalleryThumbnails = (thumbnailQuality) => async (image, info) => {
    const original = {
        path: `${info.fileNameWithoutExt}.jpg`,
        contents: await image.jpeg().toBuffer()
    };

    const meta = await image.metadata();
    const size = Math.min(meta.width, meta.height);
    const contents = await image
        .jpeg({ quality: thumbnailQuality, progressive: true })
        .resize(size, size)
        .toBuffer();
    
    const thumbnail = {
        path: `${info.fileNameWithoutExt}.thumb.jpg`,
        contents
    };

    return {
        addDefault: false,
        files: [original, thumbnail]
    };
};
