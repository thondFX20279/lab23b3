import * as socket from "socket.io";
let io;

const { Server } = socket;
const socketSever = {
  init: (server) => {
    io = new Server(server, { cors: { origin: "*" } });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Io is not initialized");
    return io;
  },
};
export default socketSever;

// import socket from "socket.io";
// let io;

// const socketServer = {
//   init: (server) => {
//     io = socket(server, { cors: "*" });
//     return io;
//   },
//   getIo: () => {
//     if (!io) {
//       throw new Error("Socket.io not initialized");
//     }
//     return io;
//   },
// };
// export default socketServer;
