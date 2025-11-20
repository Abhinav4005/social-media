const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1" || 'https://1255d4169b8e.ngrok-free.app/api/v1';
// const API_BASE_URL = ;

const uploadImageToKit = async (attachments) => {
    const uploaded =[];

    for(const attachment of attachments) {
        const formData = new FormData();
        formData.append("file", attachment.rawFile);

        const res = await fetch(`${API_BASE_URL}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("Upload response data:", data);
        console.log("status:", res.status);
        if(res.status === 200){
            uploaded.push({ url: data.url, fileId: data.fileId, type: attachment.type });
        } else {
            console.error("Upload failed: ", data.message);
            throw new Error(data.message);
        }
    }
    return uploaded;
}

export default uploadImageToKit;