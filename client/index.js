const readline = require("readline");
const io = require("socket.io-client");
const chalk = require("chalk");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your name: ", function (name) {
  const socket = io("http://localhost:5000");

  socket.on("serverFull", (message) => {
    // Player receives a rejection from the server because game is full
    return console.log(chalk.red(message));
  });

  socket.on("connect", () => {
    // Player receives a connection success from server
    console.log("Connect listener");
  });

  socket.on("serverWelcome", (message) => {
    // Player receives a welcome
    console.log(chalk.green(message));

    // Player wants to join the game
    socket.emit("playerJoinGame", name);

    socket.on("serverStartGame", () => {
      // Player receives a signal to start
      rl.question("You will start! Enter number: ", function (number) {
        console.log(typeof number);
        socket.emit("sendFirstNumber", number);
      });
    });

    socket.on("number", (player, number) => {
      // Player receives a number
      console.log(player.name, "sent", number);
      rl.question("Enter a number: ", function (number) {
        socket.emit("sendNumber", number);
      });
    });

    socket.on("youWin", (number) => {
      // Player notified that she won
      console.log("Congrats, you won!! with lucky number", number);
    });
  });
});

rl.on("close", function () {
  console.log("\nExiting game!");
  process.exit(0);
});
