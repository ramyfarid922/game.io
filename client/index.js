const readline = require("readline");
const io = require("socket.io-client");
const chalk = require("chalk");
const { randomInt } = require("crypto");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your name: ", function (name) {
  const socket = io("http://localhost:5000");

  socket.on("serverFull", (message) => {
    console.log(chalk.red(message));
  });

  socket.on("serverWelcome", (message) => {
    console.log(chalk.green(message));

    socket.emit("playerJoinGame", name);

    socket.on("serverStartGame", () => {
      rl.question("Enter number: ", function (number) {
        socket.emit("number", number);
      });
    });
  });
});

rl.on("close", function () {
  console.log("\nExiting game!");
  process.exit(0);
});
