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

module.exports = Game;
