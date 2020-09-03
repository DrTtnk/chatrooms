// @ts-check

/** @typedef {{ text: string; username: string; time: string }} Message */

/** @typedef {{ id:string, username: string, room: string }} User */

const socket = io("http://localhost:3000");

/** @param {Message} message */
const outputMessage = message => {
    console.log(`Received: ${message.text}, from user ${message.username}`);
    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;

    document.querySelector(".chat-messages").appendChild(div);
}

/** @param {string} room */
const outputRoomName = room => document.getElementById("room-name").innerText = room;

/** @param {User[]} users */
const outputUsers = users => document.getElementById("users")
    .innerHTML = users.map(user => `<li>${user.username}</li>`).join("")

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
socket.emit("join", { username, room });

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const msg = e.target.elements.msg;

    socket.emit("chatMessage", msg.value)

    msg.value = "";
});

let isTyping = false;
let typingTimer;
chatForm.addEventListener("keypress", e => {
    if (!event.key.match(/^[\d\w]$/i))
        return;

    clearTimeout(typingTimer);
    if (isTyping)
        return;
    isTyping = true;
    socket.emit("user-start-typing", "start " + username)
});

chatForm.addEventListener("keyup", e => {
    if (!event.key.match(/^[\d\w]$/i))
        return;

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        isTyping = false;
        socket.emit("user-stop-typing", "stop  " + username);
    }, 500)
});

const chatMessages = document.querySelector(".chat-messages");

socket.on("message", /** @param {Message} message */ message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

const writingFlag = document.getElementById("writing-flag");

socket.on("user-start-typing-broadcast",
    /** @param {string} message */
    message => writingFlag.innerText = `${message} is typing...`);

socket.on("user-stop-typing-broadcast",
    /** @param {string} message */
    message => writingFlag.innerText = "...");

socket.on("roomUsers", /** @param {{room: string, users: User[]}} users */ ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});