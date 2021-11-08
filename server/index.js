const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;
const Game = require("./game");
const chalk = require("chalk");

let game = new Game();

game.on("playerAdded", () => {
  console.log("Our game emits events now");
});

io.on("connection", (socket) => {
  if (game.status === "RUNNING") {
    // If game has two players and its state is set to "RUNNING"
    // Reject the 3rd player socket connection
    return socket.emit("serverFull", "Connection rejected! game is full");
  }

  // If game isn't full yet, emit a welcome event to the connecting player socket
  socket.emit("serverWelcome");

  // Listen for a playerJoinGame event, emitted from the connecting socket
  socket.on("playerJoinGame", (name) => {
    // On accepting a player join, create a player object literal
    let player = { name: name, id: socket.id };

    game.addPlayer(player);

    socket.emit("serverAcceptJoin", game.capacity());

    console.log("------------------------");
    console.log("Current game:", game);

    if (game.players.length === 2) {
      game.status = "RUNNING";
      return socket.emit("serverStartGame");
    }
  });

  // Listen for the event of incepting first number
  socket.on("inceptNumber", (num) => {
    let player = game.findPlayer(socket.id);

    let number = parseInt(num);
    game.number = number;

    console.log(
      chalk.yellow("Game log: "),
      player.name,
      "sent first number",
      number
    );

    // winning logic here
    if (number % 3 === 0 && number / 3 === 1) {
      console.log(player.name, "WIN!", number);
      socket.broadcast.emit("youWin", number);
    } else {
      socket.broadcast.emit("number", player, number);
    }
  });

  socket.on("sendMove", (move) => {
    game.processMove(socket.id, move);
    game.logMove(socket.id, move);

    if (game.status === "DRAW") {
      return io.emit("draw");
    }
    if (game.winner) {
      // Update the player who made the move that he won
      socket.emit("youWin");
      // Update the opponent that they lost
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
    socket.emit("playerLeaveGame");
    game.reset();
  });
});

server.listen(port, () => {
  console.log("Listening on port: " + port);
});
