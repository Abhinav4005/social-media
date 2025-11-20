import React, { useEffect, useState } from "react";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatMessages from "../components/Chat/ChatMessages";
import ChatInput from "../components/Chat/ChatInput";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import { useSelector } from "react-redux";
import { getRooms } from "../api";
import { useQuery } from "@tanstack/react-query";

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { roomId } = useParams();
  const [activeChat, setActiveChat] = useState(roomId || null);

  const {data: roomsData, isLoading, error} = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
    enabled: !!user?.id,
  })
    
  useEffect(() => {
    if (roomId) {
      setActiveChat(roomId);

      socket.emit("joinRoom", { roomId: parseInt(roomId), userId: user?.id });
      console.log("Emitted joinRoom for roomId:", roomId);

      return () => {
        socket.emit("leaveRoom", { roomId: parseInt(roomId), userId: user?.id });
        console.log("Emitted leaveRoom for roomId:", roomId);
      }
    }
  }, [roomId]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <ChatSidebar activeChat={activeChat} setActiveChat={setActiveChat} />

      {/* Right Chat Window */}
      <div className="flex flex-col flex-1">
        {activeChat ? (
          <>
            <ChatHeader roomId={activeChat} data={roomsData} isLoading={isLoading} isError={error} />
            <ChatMessages roomId={activeChat} />
            <ChatInput roomId={activeChat} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;