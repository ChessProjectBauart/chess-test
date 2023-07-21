import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

// send a message to the server

// receive a message from the server
socket.on("hello from server", (...args) => {
  console.log(args);
});

socket.on("accept move", (...args) => {
  console.log(args);
});

// let testFUnction = () => {
//     socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// }
// socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });


// testFUnction()
socket.emit("get position", 'e2', (response) => {
  console.log(response)
})
socket.emit('compare', 'e2', 'e4')
socket.emit('reset board')