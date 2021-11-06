const readline = require("readline");
const io = require("socket.io-client");
const chalk = require("chalk");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your name: ", function (name) {
  const socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log(chalk.green("Reached game server!"));
  });

  socket.on("serverWelcome", () => {
    console.log(chalk.green("Connection accepted! welcome"));

    socket.emit("playerJoinGame", name);

    socket.on("serverAcceptJoin", (players) => {
      if (players < 2) {
        console.log(chalk.yellow("Waiting for a player to join..."));
      }
    });

    socket.on("serverStartGame", () => {
      console.log(chalk.yellow("You will start!"));
      rl.question("Enter number: ", function (number) {
        socket.emit("sendFirstNumber", number);
        console.log(chalk.yellow("Waiting for other player move..."));
      });
    });

    socket.on("number", () => {
      console.log(chalk.yellow("Your opponent made a move! Your turn now"));
      rl.question("Enter a move from [-1, ,0, 1]", function (move) {
        socket.emit("sendNumber", move);
        console.log(chalk.yellow("Waiting for other player move..."));
      });
    });

    socket.on("youWin", () => {
      console.log("YOU WON!");
    });

    socket.on("youLose", () => {
      console.log("HARD LUCK!");
    });
  });

  socket.on("connect_error", () => {
    console.log(chalk.red("Couldn't connect to game server! Closing..."));
    return rl.close();
  });

  socket.on("serverFull", (message) => {
    console.log(chalk.red(message));
    socket.close();
    return rl.close();
  });
});

rl.on("close", function () {
  console.log("Exiting game!");
  process.exit(0);
});
