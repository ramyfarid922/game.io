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
