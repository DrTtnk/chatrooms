export default {
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
} as const;