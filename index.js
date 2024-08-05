const express = require("express");

const app = express();

app.use(express.static("static"));

const port = 7000;
const server = app.listen(port, () =>
  console.log(`server start sucssfully on port ${port}`)
);

const io = require("socket.io")(server);

let socketsConnected = new Set();

io.on("connection", (socket) => {
  //   console.log(socket.id);
  socketsConnected.add(socket.id);

  io.emit("total-people", socketsConnected.size);

  socket.on("disconnect", () => {
    // console.log("socket disconnected ", socket.id);
    socketsConnected.delete(socket.id);
    io.emit("total-people", socketsConnected.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("chatMessage", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
});
