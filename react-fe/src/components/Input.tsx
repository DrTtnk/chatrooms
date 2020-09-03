import React, { useState, useEffect } from 'react';

type Props = {
    message: string,
    setMessage: (arg: string) => void,
    sendMessage: () => void,
    onStartTyping: () => void,
    onStopTyping: () => void,
}

export default ({ message, setMessage, sendMessage, onStartTyping, onStopTyping }: Props) => {
    const [typing, setIsTyping] = useState({ isTyping: false, timer: setTimeout(() => { }, 0) });

    const startTyping = (key: string) => {
        if (!key.match(/^[\d\w]$/i))
            return;

        clearTimeout(typing.timer);
        if (!typing.isTyping)
            onStartTyping()

        setIsTyping({ ...typing, isTyping: true });
    }

    const stopTyping = (key: string) => {
        if (!key.match(/^[\d\w]$/i))
            return;

        clearTimeout(typing.timer);

        setIsTyping({
            ...typing,
            timer: setTimeout(() => {
                setIsTyping({ ...typing, isTyping: false });
                onStopTyping();
            }, 500)
        });
    }

    return (
        <form className="form">
            <input className="input"
                onKeyDown={e => startTyping(e.key)}
                onKeyUp={e => stopTyping(e.key)}
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyPress={e => {
                    if (e.key !== "Enter")
                        return;
                    e.preventDefault();
                    if (message)
                        sendMessage();
                }} />
        </form>
    );
}