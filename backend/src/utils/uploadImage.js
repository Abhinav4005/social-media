import imagekit from "../config/imagekit.js";

const uploadImageToImageKit = async (file, folder="social-hub") => {
    console.log("file in uploadKit", file)

    if(!file) return null;

    const base64Data = file.buffer.toString('base64');
    const mime = file.mimetype;

    const result = await imagekit.upload({
        file: `data:${mime};base64,${base64Data}`,
        fileName: file.originalname,
        folder: `/${folder}`,
    });

    return {
        url: result.url,
        fileId: result.fileId,
    }
}

export default uploadImageToImageKit;

export const replaceImageInImageKit = async (oldImageUrl, newFile, folder = "social-hub", profileImageId) => {
    if (!newFile) return oldImageUrl;
    try {
        if (profileImageId) {
            await imagekit.deleteFile(profileImageId);
        }
        const newImageData = await uploadImageToImageKit(newFile, folder);
        return newImageData?.url || oldImageUrl;
    } catch (error) {
        console.error("Error replacing image in ImageKit:", error);
        return oldImageUrl;
    }
};