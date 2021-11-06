const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;
const Game = require("./game");

let game = new Game();

console.log("Game initiated:", game);

io.on("connection", (socket) => {
  if (game.status === "RUNNING") {
    // If game has two players and its state is set to "RUNNING"
    // Reject the 3rd player socket connection
    return socket.emit("serverFull", "Connection rejected! game is full");
  }

  console.log("------------------------");

  // If game isn't full yet, emit a welcome event to the connecting player socket
  socket.emit("serverWelcome");

  // Listen for a playerJoinGame event, emitted from the connecting socket
  socket.on("playerJoinGame", (name) => {
    // On accepting a player join, create a player object literal
    let player = { name: name, id: socket.id };

    // Refactor this 1
    game.players.push(player);

    socket.emit("serverAcceptJoin", game.players.length);

    console.log("Current game:", game);

    if (game.players.length === 2) {
      game.status = "RUNNING";
      return socket.emit("serverStartGame");
    }
  });

  socket.on("sendFirstNumber", (num) => {
    let player = game.find(socket.id);

    let number = parseInt(num);
    game.number = number;

    console.log(player.name, "sent first number", number);

    // winning logic here
    if (number % 3 === 0 && number / 3 === 1) {
      console.log(player.name, "WIN!", number);
      socket.broadcast.emit("youWin", number);
    } else {
      socket.broadcast.emit("number", player, number);
    }
  });

  socket.on("sendNumber", (move) => {
    let player = game.players.find((player) => {
      return player.id === socket.id;
    });

    let increment = parseInt(move);
    let number = Math.floor((game.number + increment) / 3);
    game.number = number;

    console.log(player.name, "played", move, "Number is", number);

    // winning logic here
    if (game.number === 1) {
      console.log(player.name, "WINS!", number);

      socket.emit("youWin");

      socket.broadcast.emit("youLose");
    } else {
      socket.broadcast.emit("number");
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
