# Real-Time Chat Application

> ⚠️ **Note:** This project is built solely for **WebSockets practice and learning**. It demonstrates the fundamental concepts of bidirectional, event-based communication using Node.js, Express, and Socket.IO.

---

## 📌 Project Overview

Traditional HTTP requests follow a **Request-Response** cycle where the client must ask the server for data. In contrast, **WebSockets** establish a persistent, full-duplex connection between the client and server. This allows real-time data transfer without constant polling.

In this project:
- A user enters a message in the browser.
- The browser emits a WebSocket event (`user-message`) to the server.
- The server receives it and broadcasts (`io.emit('message')`) the message to all connected clients simultaneously.
- Every client receives the message in real time and renders it on the screen.

---

## 🚀 Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Backend framework for serving static files and handling HTTP routing.
- **Socket.IO**: Real-time bidirectional event-based communication library.
- **HTML5 & Vanilla JavaScript**: Minimal frontend to send and display messages.
- **Nodemon**: Development utility that automatically restarts the server upon code changes.

---

## 📂 Project Structure

```text
chat-app/
├── public/
│   └── index.html      # Frontend interface with Socket.IO client
├── .gitignore          # Files ignored by Git (node_modules, etc.)
├── index.js            # Express server and Socket.IO configuration
├── package.json        # Project metadata and dependencies
└── README.md           # Documentation and practice notes
```

---

## ⚙️ How It Works (Step-by-Step)

### 1. Server Side (`index.js`)
- **HTTP & Socket.IO Setup**: An Express app is created and wrapped in Node's built-in `http.createServer(app)`. Socket.IO attaches directly to this server instance.
- **Static Assets**: Serves files located in `/public`.
- **Connection Handling**:
  ```javascript
  io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('user-message', (message) => {
          io.emit('message', message); // Broadcast to all connected clients
      });
  });
  ```

### 2. Client Side (`public/index.html`)
- Loads the client-side Socket.IO script (`/socket.io/socket.io.js`).
- Emits messages when the user clicks the "Send" button:
  ```javascript
  socket.emit('user-message', message);
  ```
- Listens for incoming broadcast messages and displays them:
  ```javascript
  socket.on('message', (message) => {
      const p = document.createElement('p');
      p.textContent = message;
      allMsg.appendChild(p);
  });
  ```

---

## 🛠️ Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Clone the repository
```bash
git clone https://github.com/divyal-11/chat-app.git
cd chat-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
Visit:
```
http://localhost:8000
```
Open multiple browser tabs at `http://localhost:8000` to test real-time chatting between different windows!
