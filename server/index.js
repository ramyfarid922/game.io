const express = require("express");
const http = require("http");
const { parse } = require("path");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

// Emitted events by server
const emits = {
  SERVER_WELCOME: "serverWelcome",
  SERVER_ACCEPT_JOIN: "serverAcceptJoin",
  SERVER_START_GAME: "serverStartGame",
  SERVER_WELCOME: "serverWelcome",
  PLAYER_LEAVE_GAME: "playerLeaveGame",
};

// events anticipated by server
const incoming = {
  PLAYER_JOIN_GAME: "playerJoinGame",
};

// Refactor later into a game class (using function constructor)
let game = {
  turn: 0,
  status: "PENDING",
  players: [],
  number: null,
  winner: null,
};

console.log("Game initiated:", game);

io.on("connection", (socket) => {
  if (game.status === "RUNNING") {
    return socket.emit("serverFull", "Connection rejected! game is full");
  }

  console.log("------------------------");

  socket.emit("serverWelcome");

  socket.on("playerJoinGame", (name) => {
    let player = { name: name, id: socket.id };

    game.players.push(player);

    socket.emit("serverAcceptJoin", game.players.length);

    console.log("Current game:", game);

    if (game.players.length === 2) {
      game.status = "RUNNING";
      return socket.emit("serverStartGame");
    }
  });

  socket.on("sendFirstNumber", (num) => {
    let player = game.players.find((player) => {
      return player.id === socket.id;
    });

    let number = parseInt(num);

    console.log(player.name, "sent first number", number);

    // winning logic here
    if (number % 3 === 0 && number / 3 === 1) {
      console.log(player.name, "WIN!", number);
      socket.broadcast.emit("youWin", number);
    } else {
      socket.broadcast.emit("number", player, number);
    }
  });

  socket.on("sendNumber", (num) => {
    let player = game.players.find((player) => {
      return player.id === socket.id;
    });

    let number = parseInt(num);

    console.log(player.name, "sent", number);

    // winning logic here
    if (number % 3 === 0 && number / 3 === 1) {
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
    console.log("------------------------");
    console.log("Game reset!", game);
    socket.emit("playerLeaveGame");
  });
});

server.listen(port, () => {
  console.log("Listening on port: " + port);
});
