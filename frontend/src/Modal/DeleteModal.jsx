import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-96 max-w-full">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Confirm Delete
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 cursor-pointer text-white hover:bg-red-700 transition"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
