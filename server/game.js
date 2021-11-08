const chalk = require("chalk");
const { EventEmitter } = require("events");

class Game {
  constructor() {
    this.status = "PENDING";
    this.players = [];
    this.number = null;
    this.winner = null;
  }

  reset() {
    this.status = "PENDING";
    this.players = [];
    this.number = null;
    this.winner = null;
  }

  findPlayer(id) {
    return this.players.find((player) => {
      return player.id === id;
    });
  }

  addPlayer(player) {
    if (this.players.length < 2) {
      this.players.push(player);
    }
    return player;
  }

  processIncept = function () {};

  processMove = function (id, move) {
    let increment = parseInt(move);
    this.number = Math.floor((this.number + increment) / 3);
    if (this.number === 1) {
      this.status = "FINISHED";
      this.winner = this.findPlayer(id);
    }
  };

  logMove = function (id, move) {
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
        chalk.yellow("Game log: "),
        player.name,
        "played",
        move,
        "Number is",
        this.number
      );
    }
  };

  capacity() {
    return this.players.length;
  }
}

module.exports = Game;
