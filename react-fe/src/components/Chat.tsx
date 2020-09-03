import React, { useState, useEffect } from 'react';
import qs from "querystring"
import io from "socket.io-client"
import EVENT from "./EVENTS"
import InfoBar from './InfoBar';
import Input from './Input';
// @ts-ignore
import ScrollToBottom from "react-scroll-to-bottom"

let socket: SocketIOClient.Socket;

const ENDPOINT = "localhost:5000"

type IncomingMessage = { username: string, text: string };

const Message = ({ message, name }: { message: IncomingMessage, name: string }) => {
    return message.username === name
        ? (
            <div className="messageContainer justifyEnd">
                <div className="messageBox">
                    <p className="messageText">{name} - {message.text}</p>
                </div>
            </div>
        ) : (
            <div className="messageContainer justifyStart">
                <div className="messageBox">
                    <p className="messageText">{message.username} - {message.text}</p>
                </div>
            </div>
        )
}

const Messages = ({ messages, currentUser }: { messages: IncomingMessage[], currentUser: string }) => (
    <ScrollToBottom>
        {messages.map((m, id) => <div key={id}><Message message={m} name={currentUser} /></div>)}
    </ScrollToBottom>
)

const TypingBubble = ({ currentUser, typingUser }: { currentUser: string, typingUser: string|null }) => (
    typingUser && currentUser !== typingUser ? <div>{typingUser} is typing...</div> : null
)

export default ({ location }: { location: Location }) => {
    const [room, setRoom]         = useState("");
    const [currentUser, setName]  = useState("");
    const [message, setMessage]   = useState("");
    const [typingUser, setTypingUser] = useState<string|null>(null);
    const [messages, setMessages] = useState<IncomingMessage[]>([]);


    useEffect(() => {
        const { room, name } = qs.parse(location.search.slice(1)) as { room: string, name: string };

        socket = io(ENDPOINT)

        setName(name);
        setRoom(room);
        socket.emit(EVENT.join.client, { username: name, room }, () => { });

        return () => { socket.emit(EVENT.disconnect.client); };

    }, [location.search])

    useEffect(() => { socket.on(EVENT.message.server, 
                     (incoming: IncomingMessage) => setMessages([...messages, incoming])) }, [messages]);

    useEffect(() => { socket.on(EVENT.message.server, 
                     (incoming: IncomingMessage) => setMessages([...messages, incoming])) }, [messages]);

    useEffect(() => { socket.on(EVENT.startTyping.server,
                     (message: string) => setTypingUser(message)) });

    useEffect(() => { socket.on(EVENT.stopTyping.server, 
                      () => setTypingUser(null)) });

    const sendMessage = () => { socket.emit(EVENT.message.client, message, () => setMessage("")); }
    const sendStartTyping = () => { socket.emit(EVENT.startTyping.client, currentUser, () => {}); }
    const sendStopTyping  = () => { socket.emit(EVENT.stopTyping.client, currentUser, () => {}); }

    return (
        <div className="outerComponent">
            <div className="container">
                <InfoBar room={room}></InfoBar>
                <Messages messages={messages} currentUser={currentUser}></Messages>
                <TypingBubble currentUser={currentUser} 
                              typingUser={typingUser}></TypingBubble>
                <Input message={message}
                       setMessage={setMessage}
                       sendMessage={sendMessage}
                       onStartTyping={sendStartTyping}
                       onStopTyping={sendStopTyping}></Input>
            </div>
        </div>
    );
}