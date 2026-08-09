import React, { useEffect, useState } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import { useParams } from "react-router-dom";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";
import { getRooms } from "../../../api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constant/queryKeys";

const ChatPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { roomId } = useParams();
  const [activeChat, setActiveChat] = useState(roomId || null);

  const {data: roomsData, isLoading, error} = useQuery({
    queryKey: QUERY_KEYS.rooms,
    queryFn: getRooms,
    enabled: !!user?.id,
  })
    
  useEffect(() => {
    if (roomId) {
      setActiveChat(roomId);

      socket.emit("joinRoom", { roomId: parseInt(roomId), userId: user?.id });

      return () => {
        socket.emit("leaveRoom", { roomId: parseInt(roomId), userId: user?.id });
      }
    }
  }, [roomId]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <ChatSidebar activeChat={activeChat} setActiveChat={setActiveChat} />

      {/* Right Chat Window */}
      <div className="flex flex-col flex-1 min-w-0">
        {activeChat ? (
          <>
            <ChatHeader roomId={activeChat} data={roomsData} isLoading={isLoading} isError={error} />
            <ChatMessages roomId={activeChat} />
            <ChatInput roomId={activeChat} />
          </>
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none"
              style={{ background: "var(--gradient-vibrant)" }}
            >
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-black text-gray-800 dark:text-gray-100 tracking-tight">Your messages</p>
              <p className="text-[12px] text-gray-400 dark:text-gray-400 font-medium mt-1">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
