import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useChatContext } from "../context/chatContext";
import useChat from "../hooks/useChat";
import useSocket from "../hooks/useSocket";

const MessageInput = ({ fetchMessages }) => {
  const { socket } = useSocket();
  const { sendMessage } = useChat();
  const { selectedChat } = useChatContext();

  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const chatId = selectedChat?._id;

  if (!chatId) {
    return (
      <div className="p-4 text-center text-gray-400">
        No chat selected
      </div>
    );
  }

  const handleSend = async () => {
    if (!text.trim() && !media) {
      toast.error("Cannot send empty message");
      return;
    }

    try {
      setIsSending(true);

      await sendMessage(chatId, text.trim(), media);

      setText("");
      setMedia(null);
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col gap-2 sticky bottom-0">
      {media && (
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
          <div className="flex items-center gap-3">
            {media.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(media)}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <video
                src={URL.createObjectURL(media)}
                controls
                className="w-20 h-20 rounded"
              />
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {media.name}
            </span>
          </div>
          <button
            onClick={() => setMedia(null)}
            className="text-red-600 font-semibold hover:underline"
          >
            ✕ Remove
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
        />

        <label className="cursor-pointer text-gray-600 dark:text-gray-300">
          <BsFillImageFill size={20} />
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*,application/*,audio/*,text/*,application/pdf,application/msword"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </label>

        <button
          onClick={handleSend}
          disabled={isSending}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50"
        >
          <IoSend size={22} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
