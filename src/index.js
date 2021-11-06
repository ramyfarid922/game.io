const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

const { generateMessage } = require("./utils/messages");

const game = {
  status: "PENDING",
  players: [],
  winner: null,
};

io.on("connection", (socket) => {
  console.log("New websocket connection from", socket.id);

  socket.emit("serverWelcome", generateMessage("Connection accepted!"));

  socket.on("playerJoinGame", (info, callback) => {
    const player = { name: info.name, id: socket.id };
    game.players.push(player);
    console.log("Game status:", game);
    callback("Player joined");
  });

  socket.on("disconnect", (message) => {
    const removed = game.players.find((player) => {
      return player.id === socket.id;
    });
    game.players.splice(game.players.indexOf(removed), 1);
    console.log("Game status:", game);
  });
});

server.listen(port, () => {
  console.log("Listening on port: " + port);
  console.log("Game status:", game);
});
