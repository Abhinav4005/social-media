import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onDelete, title = "Delete this item?", description = "This action is permanent and cannot be undone." }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div className="bg-white rounded-[28px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)] w-full max-w-sm overflow-hidden">
              {/* Top accent */}
              <div className="h-1 w-full bg-gradient-to-r from-red-400 via-rose-500 to-red-400" />

              <div className="p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center shadow-inner">
                    <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Text */}
                <div className="text-center mb-8">
                  <h2 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{description}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Keep it
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onDelete}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200 hover:shadow-red-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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

export default DeleteModal;
