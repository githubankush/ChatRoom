import React from "react";

const MediaModal = ({ mediaUrl, type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl font-bold"
      >
        ✕
      </button>

      <div className="max-w-[95%] max-h-[95%] overflow-auto">
        {type === "image" && (
          <img
            src={mediaUrl}
            alt="Full View"
            className="max-w-full max-h-screen object-contain rounded"
          />
        )}
        {type === "video" && (
          <video
            src={mediaUrl}
            controls
            autoPlay
            className="max-w-full max-h-screen rounded"
          />
        )}
        {type === "file" && (
          <div className="text-center">
            <p className="text-white mb-4">Preview not supported</p>
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-4 py-2 rounded shadow"
            >
              Open or Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;
