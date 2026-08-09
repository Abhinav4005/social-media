import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import { BRAND_THEME } from "../../../constant/constant";

const CoverModal = ({
  isOpen,
  onClose,
  coverPreview,
  handleCoverChange,
  handleRemoveCover,
  handleUpload,
  userProfile
}) => {
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
              <div className="flex items-center justify-between px-8 pt-8 pb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${BRAND_THEME.avatarGradient} flex items-center justify-center shadow-lg ${BRAND_THEME.shadowPrimary}`}>
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                      {userProfile?.coverImage ? "Update Cover" : "Upload Cover"}
                    </h2>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Profile photo</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-8 pb-8 space-y-5">
                {/* Upload zone */}
                <label className={`flex flex-col items-center justify-center w-full cursor-pointer rounded-[24px] border-2 border-dashed transition-all group ${coverPreview ? "border-transparent p-0" : `border-gray-200 hover:${BRAND_THEME.focusBorder} hover:${BRAND_THEME.bgLight} py-10`}`}>
                  {coverPreview ? (
                    <div className="relative w-full h-44 rounded-[24px] overflow-hidden">
                      <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white text-xs font-bold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        Preview
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-700">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  {coverPreview && (
                    <button
                      onClick={handleRemoveCover}
                      className="py-3.5 px-5 rounded-2xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                  <motion.button
                    whileHover={coverPreview ? { scale: 1.02 } : {}}
                    whileTap={coverPreview ? { scale: 0.97 } : {}}
                    onClick={handleUpload}
                    disabled={!coverPreview}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-bold text-white ${BRAND_THEME.avatarGradient} shadow-lg ${BRAND_THEME.shadowPrimary} disabled:opacity-40 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
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

export default CoverModal;
