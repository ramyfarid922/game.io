const status = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  FINISHED: "FINISHED",
};

function Game() {
  this.status = "PENDING";
  this.players = [];
  this.number = null;
}

Game.prototype.find = function (id) {
  return this.players.find((player) => {
    return player.id === id;
  });
};

Game.prototype.addPlayer = function (player) {
  if (this.players.length < 2) {
    this.players.push(player);
  }
  return player;
};

module.exports = Game;
