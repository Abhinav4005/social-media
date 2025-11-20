import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { socket } from "../../../socket";
import { EllipsisVertical } from "lucide-react";
import { formatLastSeen } from "../../utils/formatTime";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ roomId, data, isLoading, isError }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { onlineUsers, lastSeen } = useSelector((state) => state.presence);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    console.log("onlineUsers in ChatHeader:", onlineUsers);

    useEffect(() => {
        if (user?.id) {
            socket.emit("userOnline", user.id);
        }

        return () => {
            if (user?.id) {
                socket.emit("userOffline", user.id);
            }
        };
    }, [user?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsEditOpen(false);
            }
        };

        if (isEditOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [isEditOpen])

    let isOtherUserOnline = false;
    let room = null;
    let otherMember = null;

    if (data && roomId) {
        const currentRoom = data.find((r) => r.id === parseInt(roomId));

        if (currentRoom) {
            if (currentRoom.type === "DM") {
                otherMember = currentRoom.members?.find(
                    (m) => m.user.id !== user?.id
                );
                if (otherMember) {
                    room = {
                        name: otherMember.user.name,
                        profileImage: otherMember.user.profileImage,
                        id: otherMember.user.id,
                        type: currentRoom.type
                    };
                }
                isOtherUserOnline = otherMember && onlineUsers.includes(otherMember.user.id)
            } else {
                room = { name: currentRoom.name, profileImage: currentRoom.profileImage, type: currentRoom.type };
            }
        }
    }

    // console.log("data in chat header:", otherMember);

    const handleVideoCall = (targetUserId) => {
        navigate(`/video-call/${roomId}`, { state: { targetUserId } });
    }

    if (!room) return null;

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading rooms</p>;

    return (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold capitalize">
                    {room?.profileImage ? (
                        <img
                            src={room?.profileImage}
                            alt={room?.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        room.name?.charAt(0)
                    )}
                </div>
                <div>
                    <h3 className="font-semibold capitalize">{room.name}</h3>
                    {room.id && (
                        <p className="text-xs">
                            {isOtherUserOnline ? (
                                <span className="text-green-500">Online</span>
                            ) : (
                                <span className="text-gray-400">
                                    Last seen: {formatLastSeen(lastSeen?.[room?.id])}
                                </span>
                            )}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    {/* <Phone className="cursor-pointer text-gray-600 hover:text-blue-500" /> */}
                    <Video
                        className="cursor-pointer text-gray-600 hover:text-blue-500"
                        onClick={() => handleVideoCall(otherMember?.userId)}
                    />
                </div>
                <div className="relative" ref={dropdownRef}>
                    <EllipsisVertical onClick={() => setIsEditOpen(!isEditOpen)} className="cursor-pointer" />
                    {isEditOpen && (
                        <div className="w-48 absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            {room.type === "GROUP" &&
                                <>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                        Edit Group Info
                                    </button>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">
                                        Leave Group
                                    </button>
                                </>
                            }
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">
                                {room.type === "DM" ? "Delete Chat" : "Delete Group"}
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">
                                {room.type === "DM" ? "Archive Chat" : "Archive Group"}
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                More Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;