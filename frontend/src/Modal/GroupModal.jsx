import React from "react";

const GroupModal = () => {
    const initialData = {
        groupName: "",
        profileImage: null,
        description: "",
    }

    const [formData, setFormData] = useState(initialData);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if(file){
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);
        }
    }

    return (
        <div>
            <h2>Group Settings</h2>
            <div>
                <input 
                type="text"
                placeholder="Update Group Name"
                name="groupName"
                value={formData.groupName}
                onChange={handleChange}
                />

                <input
                type="text"
                placeholder="Update Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                />

                <input
                type="file"
                accept="image/*"
                name="profileImage"
                onChange={handleFileChange}
                />
            </div>
            <div>
                <button>Cancel</button>
                <button>Save Changes</button>
            </div>
        </div>
    )
}

export default GroupModal;