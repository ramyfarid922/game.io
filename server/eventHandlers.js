const inceptHandler = (num) => {};
const moveHandler = (move) => {};
const disconnectHandler = () => {
  const removed = game.players.find((player) => {
    return player.id === socket.id;
  });
  game.players.splice(game.players.indexOf(removed), 1);
  socket.emit("playerLeaveGame");
  game.reset();
};
const playerJoinGameHandler = (name) => {};

module.exports = {};
