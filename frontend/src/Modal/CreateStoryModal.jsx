import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image, Wand2, Type, Sparkles } from "lucide-react";

const CreateStoryModal = ({ isOpen, onClose }) => {
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="relative w-full max-w-lg bg-white rounded-[44px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-gray-100/50 overflow-hidden"
                >
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                    {/* Header */}
                    <div className="px-10 py-9 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)]">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">Create Story</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moment sharing</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 cursor-pointer border border-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-10 pb-10">
                        {/* Upload Area */}
                        <div className="relative group">
                            {!preview ? (
                                <label className="flex flex-col items-center justify-center w-full h-[420px] bg-gray-50/50 border border-gray-100 rounded-[40px] hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-pointer group relative overflow-hidden">
                                    {/* Subtle Pattern/Glow */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0%,transparent_70%)]" />

                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white rounded-[28px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-gray-50">
                                            <Image className="w-9 h-9 text-indigo-500" />
                                        </div>
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Upload Visuals</span>
                                        <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tight opacity-60">Photos or Videos preferred</span>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))} />
                                </label>
                            ) : (
                                <div className="relative h-[420px] rounded-[40px] overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    <div className="absolute top-6 right-6 flex gap-2">
                                        <button
                                            onClick={() => setPreview(null)}
                                            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all cursor-pointer flex items-center justify-center border border-white/20"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Customization Bar */}
                        <div className="flex items-center gap-3 mt-8">
                            <div className="flex-1 bg-gray-50 rounded-2xl p-1.5 flex items-center gap-2 border border-gray-100 focus-within:border-indigo-200 focus-within:bg-white transition-all">
                                <div className="w-10 h-10 flex items-center justify-center text-gray-400">
                                    <Type className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Share the vibe..."
                                    className="bg-transparent outline-none text-sm w-full font-bold placeholder:text-gray-300 text-gray-900 pr-4"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </div>
                            <button className="w-14 h-14 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center group">
                                <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-10 pb-10 flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <motion.button
                            whileHover={preview ? { scale: 1.02, y: -2 } : {}}
                            whileTap={preview ? { scale: 0.98 } : {}}
                            className={`flex-1 py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${preview
                                ? "bg-gray-900 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:bg-black cursor-pointer"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                                }`}
                        >
                            {preview && <Sparkles className="w-4 h-4" />}
                            Create Story
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateStoryModal;
