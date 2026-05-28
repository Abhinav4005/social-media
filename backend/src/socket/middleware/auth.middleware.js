import jwt from "jsonwebtoken";

const socketAuthMiddleware = (socket, next) => {
    try{
        const token = socket.handshake?.auth?.token;
        console.log("token :", token);

        if(!token){
            return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.userId = decoded.id;

        next();
    } catch{
        next(new Error("Authentication error"));
    }
}

export default socketAuthMiddleware;