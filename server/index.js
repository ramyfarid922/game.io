const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;
const Game = require("./game");

let game = new Game();

const connectionHandler = (socket) => {
  if (game.status === "RUNNING") {
    // If game has two players and its state is set to "RUNNING"
    // Reject the 3rd player socket connection
    return socket.emit("serverFull", "Connection rejected! game is full");
  }

  socket.emit("serverWelcome");

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

  socket.on("inceptNumber", (num) => {
    game.incept(socket.id, num);

    if (game.winner) {
      // Update the player who made the move that he won
      socket.emit("youWin");
      // Update the opponent that they lost
      socket.broadcast.emit("youLose");
    } else {
      socket.broadcast.emit("number");
    }
  });

  socket.on("sendMove", (move) => {
    game.move(socket.id, move);
    game.log(socket.id, move);

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
};

io.on("connection", connectionHandler);

server.listen(port, () => {
  console.log("Listening on port: " + port);
});
