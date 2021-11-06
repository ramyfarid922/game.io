const readline = require("readline");
const io = require("socket.io-client");
const chalk = require("chalk");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const player = {};

console.log(chalk.green("Welcome to game-of-three!"));

rl.question("Enter your name: ", function (name) {
  player.name = name;

  const socket = io("http://localhost:5000");

  socket.on("serverWelcome", (message) => {
    console.log(
      chalk.green(
        message.text,
        new Date(message.createdAt).toLocaleTimeString()
      )
    );

    socket.emit("playerJoinGame", player, (game) => {
      console.log(game);
    });
  });
});

rl.on("close", function () {
  console.log("\nExiting game!");
  process.exit(0);
});
