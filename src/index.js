const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

// Refactor later into a game class (using function constructor)
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

  socket.on("sendFirstNumber", (number) => {
    let player = game.players.find((player) => {
      return player.id === socket.id;
    });
    console.log(player.name, "sent first number", number);
    if (number === 73) {
      console.log(player.name, "WIN!", number);
      socket.broadcast.emit("youWin", number);
    } else {
      socket.broadcast.emit("number", player, number);
    }
  });

  socket.on("sendNumber", (number) => {
    let player = game.players.find((player) => {
      return player.id === socket.id;
    });
    number = number + 11;
    console.log(player.name, "sent", number);
    if (number === 73) {
      console.log(player.name, "WIN!", number);
      socket.broadcast.emit("youWin", number);
    } else {
      socket.broadcast.emit("number", player, number);
    }
  });

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
