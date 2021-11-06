const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

let game = {
  turn: 0,
  status: "PENDING",
  players: [],
  number: null,
  winner: null,
};

io.on("connection", (socket) => {
  if (game.status === "RUNNING") {
    return socket.emit("serverFull", "Connection rejected! game is full");
  }

  console.log("------------------------");
  console.log("New websocket connection from", socket.id);
  socket.emit("serverWelcome", "Connection accepted!");

  socket.on("playerJoinGame", (name) => {
    let player = { name: name, id: socket.id };
    game.players.push(player);
    console.log("Current game:", game);

    if (game.players.length === 2) {
      game.status = "RUNNING";
      socket.emit("serverStartGame");
    }
  });

  socket.on("number", () => {});

  socket.on("disconnect", () => {
    const removed = game.players.find((player) => {
      return player.id === socket.id;
    });
    game.players.splice(game.players.indexOf(removed), 1);
    game = {
      turn: 0,
      status: "PENDING",
      players: [],
      number: null,
      winner: null,
    };
    console.log("Game reset!", game);
    console.log("------------------------");
    socket.emit("playerLeaveGame");
  });
});

server.listen(port, () => {
  console.log("Listening on port: " + port);
});
