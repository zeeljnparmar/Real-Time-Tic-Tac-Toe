import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";

let socket = io(ENDPOINT);



export {socket};