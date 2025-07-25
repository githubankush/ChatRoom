const MessageBubble = ({ message, user, isGroup }) => {
  const isMine = message?.sender?._id === user?._id;

  return (
    <div className={`w-full my-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}>
        
        {/* Profile Picture (group + received only) */}
        {!isMine && isGroup && (
          <img
            src={message?.sender?.avatar || "/default-avatar.png"}
            alt={message?.sender?.name}
            className="w-8 h-8 rounded-full object-cover mr-2"
          />
        )}

        <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
          {/* Username (group + received only) */}
          

          {/* Message Bubble */}
          <div
            className={`px-4 py-2 rounded-xl shadow text-sm break-words whitespace-pre-wrap
              ${isMine
                ? "bg-[#dcf8c6] text-black rounded-br-none"
                : "bg-white text-black rounded-bl-none dark:bg-gray-700 dark:text-white"}`}
          >
            {!isMine && isGroup && (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
              {message?.sender?.username}
            </span>
          )}
          {<div className="flex items-center gap-1">{message?.text}</div>}

            {/* Timestamp */}
            <div className="text-[10px] text-gray-500 mt-1 text-right">
              {new Date(message?.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
