const ChatHeader = () => {
    return (
        <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                P
            </div>
            <div>
                <h3 className="font-semibold">Paras</h3>
                <p className="text-xs text-green-500">Online</p>
            </div>
        </div>
    );
};

export default ChatHeader;  