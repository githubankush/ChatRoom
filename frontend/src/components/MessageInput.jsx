// components/MessageInput.jsx
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { BsFillImageFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useChatContext } from "../context/chatContext";
import useChat from "../hooks/useChat";


const MessageInput = ({ fetchMessages }) => {
  const { sendMessage } = useChat();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { selectedChat } = useChatContext();
  const chatId = selectedChat?._id;

  if (!chatId) {
    return <div className="p-4 text-center text-gray-400">No chat selected</div>;
  }

  const handleSend = async () => {
    if (!text.trim()) {
      toast.error("Cannot send empty message");
      return;
    }

    try {
      setIsSending(true);
     

      await sendMessage(chatId, text);
      setText("");
      await fetchMessages(chatId);
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    // <div className="flex items-center gap-2 p-4 border-t">
    //   <input
    //     type="text"
    //     placeholder="Type a message"
    //     className="flex-1 px-4 py-2 rounded border"
    //     value={text}
    //     onChange={(e) => setText(e.target.value)}
    //   />
    //   <label className="cursor-pointer">
    //     <BsFillImageFill size={22} />
    //     <input
    //       type="file"
    //       className="hidden"
    //       accept="image/*,video/*"
    //       onChange={(e) => setMedia(e.target.files[0])}
    //     />
    //   </label>
    //   <button
    //     onClick={handleSend}
    //     className="p-2 bg-blue-600 rounded-full text-white disabled:opacity-50"
    //     disabled={isSending}
    //   >
    //     <IoSend size={22} />
    //   </button>
    // </div>
    <div className="w-full p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center gap-2 sticky bottom-0">
  <input
    type="text"
    placeholder="Type a message"
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
  />
  <label className="cursor-pointer text-gray-600 dark:text-gray-300">
    <BsFillImageFill size={20} />
    <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files[0])} />
  </label>
  <button
    onClick={handleSend}
    disabled={isSending}
    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50"
  >
    <IoSend size={22} />
  </button>
</div>

  );
};

export default MessageInput;
