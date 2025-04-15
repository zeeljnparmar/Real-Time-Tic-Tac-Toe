import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_ENDPOINT||"http://localhost:5000";

let socket = io(ENDPOINT);



export {socket};