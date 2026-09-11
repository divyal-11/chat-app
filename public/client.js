const socket = io();

const msgIn = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const allMsg = document.getElementById('messages');
const roomSelect = document.getElementById('roomSelect');
const feedback = document.getElementById('feedback');

// Prompt user for their name
const userName = prompt("Enter your Name:") || "Anonymous";
msgIn.focus();

let currentRoom = roomSelect.value;
socket.emit('join-room',{room:currentRoom,userName});

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

//listen for room switching in the dropdown
roomSelect.addEventListener('change',()=>{
    currentRoom = roomSelect.value

    //clear prev room msges and typing text
    allMsg.innerHTML = ''
    feedback.textContent = '';
    
    //tell server we joined the room
    socket.emit('join-room',{room: currentRoom,userName});

    const div = document.createElement('div');
    div.className = "msg msg-system";
    div.textContent = `You joined #${currentRoom}`;
    allMsg.appendChild(div);
    allMsg.scrollTop = allMsg.scrollHeight;
    msgIn.focus();
});    


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