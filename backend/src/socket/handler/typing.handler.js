const registerTypingHandler = (socket) => {
    socket.on("isTyping", ({ roomId, userId, isTyping }) => {
        if(!roomId || !userId ) {
            console.error("Missing required fields for isTyping");
            return;
        }

        socket.to(roomId).emit("userTyping", { 
            roomId, 
            userId, 
            isTyping 
        });
    })

    socket.on("stopTyping", ({ roomId, userId, isTyping }) => {
        if(!roomId || !userId ) {
            console.error("Missing required fields for stopTyping");
            return;
        }

        socket.to(roomId).emit("userStoppedTyping", { 
            roomId, 
            userId,
            isTyping
        });
    })
}

export default registerTypingHandler;