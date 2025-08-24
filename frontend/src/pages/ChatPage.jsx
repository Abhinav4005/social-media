import React from "react";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";

const ChatPage = () => {
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <ChatSidebar />

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;