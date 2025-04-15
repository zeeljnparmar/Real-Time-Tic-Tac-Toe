import io from "socket.io-client";

const ENDPOINT = process.env.NODE_ENV=='production'?'real-time-tic-tac-toe-production.up.railway.app':'http://localhost:5000';

let socket = io(ENDPOINT);



export {socket};