import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Camera, Type, AlignLeft, Save } from "lucide-react";

const GroupModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
    const [formData, setFormData] = useState({
        groupName: initialData.groupName || "",
        description: initialData.description || "",
        profileImage: null,
    });
    const [imagePreview, setImagePreview] = useState(initialData.profileImage || null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData((prev) => ({ ...prev, profileImage: file }));
        }
    };

    const handleSave = () => {
        if (onSave) onSave(formData);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 px-4"
                        initial={{ scale: 0.93, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.93, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    >
                        <div className="bg-white rounded-[32px] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.2)] w-full max-w-md overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-7 pt-7 pb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">Group Settings</h2>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Customize your group</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="px-7 pb-7 space-y-5">
                                {/* Group avatar */}
                                <div className="flex justify-center">
                                    <label className="relative cursor-pointer group">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border-2 border-dashed border-emerald-200 group-hover:border-emerald-400 transition-colors">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Group" className="w-full h-full object-cover" />
                                            ) : (
                                                <Users className="w-8 h-8 text-emerald-400" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-emerald-700 transition-colors">
                                            <Camera className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>

                                {/* Group name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Type className="w-3 h-3" />
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        name="groupName"
                                        placeholder="Enter group name..."
                                        value={formData.groupName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-300 focus:bg-white transition-all"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <AlignLeft className="w-3 h-3" />
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        placeholder="What's this group about?"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-300 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleSave}
                                        className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default GroupModal;
