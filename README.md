Game.io is a multiplayer cli game that's based on the socket.io protocol.

Game server is implemented as a socket.io server that responds for specific events any client (web/cli) can send.

The game state is stored in a game object instantiated from a custom ES6 game class I wrote. I chose not to incorporate the socket communication functionality inside the game class so as to make it lean and with a single responsibility as much as possible. The other path I didn't take but thought of was to make the game class extend the Event Emitter class let the game object itself manage the communication with clients. But I didn't do that.

The game server API will be operating underhood using http long polling or websockets.

Communication will be all realtime between the different players.

The game object is visible throughout the flow of the game as long as the server is up and running. Server keeps state of the game in this game object.

I have written the game client using nodejs in the form of a cli-program that takes input from the users via the terminal.

To start the game, from within the project directory we first have to install dependencies by doing

`npm install`

Then next, we start the game server to be listening for connections from players by doing

`npm run server`

Now the server is up and listening for attempts of client connections on either port `5000` or a specified port in `.env` file. The maximum number of players accepted in a game is two players. More than two players, the server rejects the socket connection.

Players ask to connect to games by running

`npm run client`

Upon spinning up the game client, the program asks the user to input his/her name so that it can be registered as a player in the game.

When a user connects and no other user exists in the game lobby, the player is prompted `Waiting for the other player to join...`

Whenever the other player joins, server will set the game running and the latest player to join will be prompted to start the game.

A player starts the game by entering the initial number. I assumed the initially incepted number is actually input by the user because I couldn't get a clear idea about the requirement in this regard.

When the player incepts the first number, the terminal hangs after prompting the player `Waiting for other player move...`

At the same time, the other player is prompted to enter a move, `Select a move from [-1, ,0, 1]: `

And so forth, the game proceeds until the game class logic determines a winner after a specific move.

The following screenshot documents a flow of the game based on the examples pointed out in the requirements.

![Alt text](./game.io.png?raw=true "Screenshot")
