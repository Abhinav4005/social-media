import React from "react";

const CoverModal = ({
  isOpen,
  onClose,
  coverPreview,
  handleCoverChange,
  handleRemoveCover,
  handleUpload,
  userProfile
}) => {
  if (!isOpen) return null;
  console.log("coverPreview in Modal:", !coverPreview);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {userProfile?.coverImage ? "Update Cover Photo" : "Upload Cover Photo"}
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
        />

        {/* Preview */}
        {coverPreview && (
          <div className="mt-4">
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="w-full h-40 object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
          {coverPreview && (
            <button
              onClick={handleRemoveCover}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-lg"
            >
              Remove
            </button>
          )}
          <button
            onClick={handleUpload}
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white rounded-lg"
            disabled={!coverPreview}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverModal;