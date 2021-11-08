const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;
const Game = require("./game");

const events = {
  SERVER_WELCOME: "serverWelcome",
  SERVER_ACCEPT_JOIN: "serverAcceptJoin",
  SERVER_START_GAME: "serverStartGame",
  SERVER_WELCOME: "serverWelcome",
  PLAYER_LEAVE_GAME: "playerLeaveGame",
  PLAYER_JOIN_GAME: "playerJoinGame",
};

let game = new Game();

// Utility functions
const checkWin = (socket, win) => {
  if (win) {
    // Update the player who made the move that he won
    socket.emit("youWin");
    // Update the opponent that they lost
    socket.broadcast.emit("youLose");
  } else {
    socket.broadcast.emit("number");
  }
};
const checkFull = (socket, status) => {
  if (status === "RUNNING") {
    // If game has two players and its state is set to "RUNNING"
    // Reject the 3rd player socket connection
    return socket.emit("serverFull", "Connection rejected! game is full");
  }
};

// Event Handler function
const connectionHandler = (socket) => {
  checkFull(socket, game.status);

  socket.emit(events.SERVER_WELCOME);

  socket.on(events.PLAYER_JOIN_GAME, (name) => {
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
    checkWin(socket, game.winner);
  });

  socket.on("sendMove", (move) => {
    game.move(socket.id, move);
    game.log(socket.id, move);
    checkWin(socket, game.winner);
  });

  socket.on("disconnect", () => {
    game.removePlayer(socket.id);
    socket.emit("playerLeaveGame");
  });
};

// Event Handler registration
io.on("connection", connectionHandler);

server.listen(port, () => {
  console.log("Listening on port: " + port);
});
