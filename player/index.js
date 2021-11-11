const readline = require("readline");
const io = require("socket.io-client");
const chalk = require("chalk");

const events = require("../events.config");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your name: ", function (name) {
  const socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log(chalk.green("Reached game server!"));
  });

  socket.on(events.SERVER_FULL, (message) => {
    console.log(chalk.red(message));
    socket.close();
    return rl.close();
  });

  socket.on(events.SERVER_WELCOME, () => {
    console.log(chalk.green("Connection accepted! welcome"));

    socket.emit(events.PLAYER_JOIN_GAME, name);

    socket.on(events.SERVER_ACCEPT_JOIN, (players) => {
      if (players < 2) {
        console.log(chalk.yellow("Waiting for a player to join..."));
      }
    });

    socket.on(events.SERVER_START_GAME, () => {
      console.log(chalk.yellow("You will start!"));

      // I am not sure yet if this started number is going to be generated from the app
      // or provided by the user, so far, I let the user enter it
      rl.question("Enter number: ", function (number) {
        socket.emit(events.PLAYER_INCEPT_NUMBER, number);
        console.log(chalk.yellow("Waiting for other player move..."));
      });
    });

    socket.on(events.SERVER_SEND_NUMBER, () => {
      console.log(chalk.yellow("Your opponent made a move! Your turn now"));

      rl.question("Select a move from [-1, ,0, 1]: ", function (move) {
        socket.emit(events.PLAYER_SEND_MOVE, move);

        console.log(chalk.yellow("Waiting for other player move..."));
      });
    });

    socket.on(events.SERVER_NOTIFY_WIN, () => {
      console.log("YOU WON!");
      return rl.close();
    });

    socket.on(events.SERVER_NOTIFY_LOSE, () => {
      console.log("HARD LUCK!");
      return rl.close();
    });
  });

  socket.on("connect_error", () => {
    console.log(chalk.red("Couldn't connect to game server! Closing..."));
    return rl.close();
  });

  socket.on("reconnect_error", () => {
    console.log(chalk.red("Couldn't connect to game server! Closing..."));
    return rl.close();
  });
});

rl.on("close", function () {
  console.log("Exiting game!");
  process.exit(0);
});
