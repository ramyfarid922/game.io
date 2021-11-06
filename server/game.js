const chalk = require("chalk");

const status = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  FINISHED: "FINISHED",
};

// I am using ES5 function constructors style in creating the game class
function Game() {
  this.status = "PENDING";
  this.players = [];
  this.number = null;
  this.winner = null;
}

Game.prototype.findPlayer = function (id) {
  return this.players.find((player) => {
    return player.id === id;
  });
};

Game.prototype.reset = function () {};

Game.prototype.addPlayer = function (player) {
  if (this.players.length < 2) {
    this.players.push(player);
  }
  return player;
};

Game.prototype.capacity = function () {
  return this.players.length;
};

Game.prototype.processMove = function (id, move) {
  let increment = parseInt(move);
  this.number = Math.floor((this.number + increment) / 3);
  if (this.number === 1) {
    this.status = "FINISHED";
    this.winner = this.findPlayer(id);
  }
};

Game.prototype.logMove = function (id, move) {
  let player = this.findPlayer(id);
  if (this.winner) {
    console.log(
      chalk.yellow("Game log: "),
      this.winner.name,
      "WON by a move of",
      move
    );
  } else {
    console.log(
      "Game log: ",
      player.name,
      "played",
      move,
      "Number is",
      this.number
    );
  }
};

Game.prototype.reset = function () {
  this.status = "PENDING";
  this.players = [];
  this.number = null;
  this.winner = null;
};

module.exports = Game;
