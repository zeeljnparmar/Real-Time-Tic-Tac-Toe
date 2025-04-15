# Real-Time Chat App with Socket.IO

## Here is the Live Hosted URL
### https://real-time-tic-tac-toe-neon.vercel.app/

This is a simple real-time chat application built using Node.js and Socket.IO. The app enables real-time communication between users in a chat room, allowing messages to be exchanged instantly between all connected clients.

## Tech Stack

- **Frontend:**
  - **React.js** - A JavaScript library for building user interfaces.
  - **Socket.IO Client** - For real-time, bidirectional communication with the backend.

- **Backend:**
  - **Node.js** - JavaScript runtime for building server-side applications.
  - **Express.js** - Web framework for Node.js, used to set up the server.
  - **Socket.IO** - Enables real-time communication by allowing WebSockets and other protocols for message transmission.

- **Database (Optional for persistence):**
  - **MongoDB** - NoSQL database (not required for basic chat functionality but could be used for storing chat history, users, etc.)

## Features

- **User Names**:
  - Users provide their name when they enter the room.

- **User Disconnect**:
  - Notifications when a user leaves the room.
  
- **Responsive Design**:
  - A simple responsive layout to accommodate mobile and desktop users.

- **Game Mode (Optional)**:
  - A Tic-Tac-Toe game to play in real-time with another user.

# Setup Instructions

## Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. You can check if it’s installed by running `node -v` in your terminal.
  
  If Node.js is not installed, you can download and install it from [nodejs.org](https://nodejs.org/).

- **npm**: Node Package Manager, which comes with Node.js. You can verify if it’s installed by running `npm -v` in your terminal.

## 1. Clone the repository

```bash
git clone https://github.com/your-username/real-time-chat-app.git
cd real-time-chat-app
```
## 2  Install Dependencies
```bash 
 npm install
```
## 3 Set Up the Backend (Server)
 ### Open the server.js file (or the appropriate file where your server code is located) and ensure that your server is set up to listen on a specific port. For example, you can change the port number if needed:

 ```bash
    const PORT = process.env.PORT || 5000;
```
## 3. Set Up the Frontend (React)
### After installing dependencies, navigate to the client directory (if the frontend is separated):

```bash
    cd client
    npm start
```
### This will start the React development server on http://localhost:3000.

## 4. Run the Server
### Once the backend is set up, start the Node.js server:

```bash
    node server.js
```
### This will start the server on the defined port (e.g., http://localhost:5000).

## 5. Connect to the Application
### Open your browser and visit http://localhost:3000 for the frontend.
### Enter a username and a room ID to join the chat room.

### The application should now be running, and you should be able to see real-time communication between users.

# Optional Features
## MongoDB Integration
### You can set up MongoDB to persist chat history and user data.
### Modify the backend to store messages in MongoDB.

## Tic-Tac-Toe Game
### Play a real-time Tic-Tac-Toe game within the chat room.