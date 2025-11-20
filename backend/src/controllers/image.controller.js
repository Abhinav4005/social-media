import uploadImageToImageKit from "../utils/uploadImage.js";

export const uploadImage = async (req, res) => {
    try {
        const file = req.file;

        if(!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadedFile = await uploadImageToImageKit(file, "social-hub/chat-attachments");
        return res.status(200).json({ 
            message: "File uploaded successfully", 
            url: uploadedFile.url, 
            fileId: uploadedFile.fileId 
        });
    } catch (error) {
        console.error("Error uploading image: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}