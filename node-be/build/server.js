import path from "path";
import http from "http";
import express from "express";
import socketIO from "socket.io";
import moment from "moment";
import { users } from "./users.js";
const PORT = 5000 || process.env.PORT;
const EVENT = {
    message: {
        server: "chat-message",
        client: "message"
    },
    startTyping: {
        server: "start-typing",
        client: "start-typing-broadcast"
    },
    stopTyping: {
        server: "stop-typing",
        client: "stop-typing-broadcast"
    },
    roomUsers: {
        server: "rooms-users"
    },
    join: {
        client: "join"
    },
    disconnect: {
        client: "disconnect"
    },
    connection: {
        client: "connection"
    },
};
const app = express()
    .use(express.static(path.join(path.resolve(), "build", "frontEnd")));
const server = http.createServer(app)
    .listen(PORT, () => console.log(`Server ready, port ${PORT}`));
const io = socketIO(server);
io.on(EVENT.connection.client, socket => {
    socket.on(EVENT.join.client, ({ username, room }, callback) => {
        const newUser = users.join({ id: socket.id, username, room });
        socket
            .join(room)
            .emit(EVENT.message.server, newMessage("ChatBot", `Welcome ${username}`));
        socket
            .broadcast.to(room)
            .emit(EVENT.message.server, newMessage("ChatBot", `${username} joined`));
        io.to(room).emit(EVENT.roomUsers.server, users.getRoom(room));
        console.log(`New connection with ${username} [${newUser.id}] in ${room}`);
        callback();
    });
    const replyToRoom = (event, compose) => socket.on(event.client, (message, callback) => {
        console.log(message);
        const user = users.get(socket.id);
        io.to(user.room).emit(event.server, compose(user, message));
        callback();
    });
    replyToRoom(EVENT.message, (user, message) => newMessage(user.username, message));
    replyToRoom(EVENT.stopTyping, (user, _) => user.username);
    replyToRoom(EVENT.startTyping, (user, _) => user.username);
    socket.on(EVENT.disconnect.client, () => {
        const user = users.remove(socket.id);
        io.to(user.room).emit(EVENT.message.server, newMessage("ChatBot", `${user.username} has left`));
        io.to(user.room).emit(EVENT.roomUsers.server, users.getRoom(user.room));
    });
});
export const newMessage = (username, text) => ({
    username,
    text,
    time: moment().format("h:mm a")
});
//# sourceMappingURL=server.js.map