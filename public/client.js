const socket = io();

const msgIn = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const allMsg = document.getElementById('messages');

// Prompt user for their name
const userName = prompt("Enter your Name:") || "Anonymous";
msgIn.focus();

socket.emit('user-joined',userName);

socket.on('user-count',(count)=>{
    document.getElementById('user-count').textContent = `🟢 ${count} Online`;
})

socket.on('system-message',(message)=>{
    const div = document.createElement('div');
    div.className = "msg msg-system";
    div.textContent = message;
    allMsg.appendChild(div);
    allMsg.scrollTop = allMsg.scrollHeight;
})

// Listen for broadcast messages from server
socket.on('message', (data) => {
    const isMe = data.userName === userName;

    const div = document.createElement('div');
    div.className = `msg ${isMe ? 'msg-outgoing' : 'msg-incoming'}`;

    div.innerHTML = `
        <div class="msg-info">
            <strong>${isMe ? 'You' : data.userName}</strong> • ${data.time}
        </div>
        <div>${data.message}</div>
    `;

    allMsg.appendChild(div);

    // Auto-scroll to the latest message
    allMsg.scrollTop = allMsg.scrollHeight;
});

// Function to send message
function sendMessage() {
    const message = msgIn.value.trim();
    if (!message) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    socket.emit('user-message', {
        userName: userName,
        message: message,
        time: time
    });

    socket.emit('stop-typing');

    msgIn.value = '';
    msgIn.focus();
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

msgIn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const feedback = document.getElementById('feedback');
let typingTimeout;

msgIn.addEventListener('input',()=>{
    socket.emit('typing');

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(()=>{
        socket.emit('stop-typing');
    },1500)
})

socket.on('user-typing',(name)=>{
    feedback.textContent = `${name} is typing...`;
})

socket.on('user-stop-typing',()=>{
    feedback.textContent = '';
})