import React, { useState } from "react";
import MediaModal from "./MediaModal"; // ✅ import this

const MessageBubble = ({ message, user, isGroup }) => {
  const [previewMedia, setPreviewMedia] = useState(null);

  const isMine = message?.sender?._id === user?._id;
  const mediaUrl = message?.media
    ? `http://localhost:3000${message.media}`
    : null;

  const isImage = mediaUrl && /\.(jpeg|jpg|png|gif|webp)$/i.test(mediaUrl);
  const isVideo = mediaUrl && /\.(mp4|webm|ogg)$/i.test(mediaUrl);
  const isOtherFile = mediaUrl && !isImage && !isVideo;

  const handleMediaClick = () => {
    if (isImage) setPreviewMedia({ url: mediaUrl, type: "image" });
    else if (isVideo) setPreviewMedia({ url: mediaUrl, type: "video" });
    else if (isOtherFile) setPreviewMedia({ url: mediaUrl, type: "file" });
  };

  return (
    <>
      {previewMedia && (
        <MediaModal
          mediaUrl={previewMedia.url}
          type={previewMedia.type}
          onClose={() => setPreviewMedia(null)}
        />
      )}

      <div
        className={`w-full my-2 flex ${isMine ? "justify-end" : "justify-start"}`}
      >
        <div className={`flex items-end max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}>
          {!isMine && isGroup && (
            <img
              src={message?.sender?.avatar || "/default-avatar.png"}
              alt={message?.sender?.name}
              className="w-8 h-8 rounded-full object-cover mr-2"
            />
          )}

          <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
            <div
              className={`px-4 py-2 rounded-xl shadow text-sm break-words whitespace-pre-wrap
              ${isMine
                  ? "bg-[#dcf8c6] text-black rounded-br-none"
                  : "bg-white text-black rounded-bl-none dark:bg-gray-700 dark:text-white"
                }`}
            >
              {!isMine && isGroup && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                  {message?.sender?.username}
                </span>
              )}

              

              {(isImage || isVideo || isOtherFile) && (
                <div
                  className="mt-2 cursor-pointer"
                  onClick={handleMediaClick}
                >
                  {isImage && (
                    <img
                      src={mediaUrl}
                      alt="media"
                      className="max-w-[250px] rounded-lg border border-gray-300 dark:border-gray-600"
                      loading="lazy"
                    />
                  )}
                  {isVideo && (
                    <video
                      src={mediaUrl}
                      className="max-w-[250px] rounded-lg border border-gray-300 dark:border-gray-600"
                      muted
                    />
                  )}
                  {isOtherFile && (
                    <div className="text-blue-500 underline">
                      📎 Open File
                    </div>
                  )}
                </div>
              )}
              {message?.text && (
                <div className="flex items-center gap-1 mt-3">{message.text}</div>
              )}
              <div className="text-[10px] text-gray-500 mt-1 text-right">
                {new Date(message?.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {/* 👁️ Seen status ticks */}
                {/* {!isGroup && (
                  <div className="flex justify-end mt-1">
                    {message?.seenBy?.length > 0 ? (
                      // Double Blue Ticks
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#4fc3f7"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        className="ml-1"
                      >
                        <path d="M1.5 13.5L6 18l6.5-6.5-1.5-1.5L6 15l-3-3zM12.5 15.5L18 21l6.5-6.5-1.5-1.5L18 18l-3-3z" />
                      </svg>
                    ) : message?.delivered ? (
                      // Double Gray Ticks
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#9e9e9e"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        className="ml-1"
                      >
                        <path d="M1.5 13.5L6 18l6.5-6.5-1.5-1.5L6 15l-3-3zM12.5 15.5L18 21l6.5-6.5-1.5-1.5L18 18l-3-3z" />
                      </svg>
                    ) : (
                      // Single Gray Tick
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#9e9e9e"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        className="ml-1"
                      >
                        <path d="M1.5 13.5L6 18l6.5-6.5-1.5-1.5L6 15l-3-3z" />
                      </svg>
                    )}
                  </div>
                )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageBubble;
