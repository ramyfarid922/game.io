This is an attempt to create a game using socket.io library.

The game server API will be operating underhood using http long polling or websockets

communication will be all realtime between the different players

we have a global game object that I will later refactor it into a game class (function constructor)

the game object is visible throughout the flow of the game as long as the server is up and running

Server keeps state of the game

players ask to connect to games

When a player connects and the she's the only player in the game lobby, she will have to wait until another player joins

Whenever another player joins, server will set the game running and the latest player to join will start the game

Let's continue the flow. This will be very iterative. I will refine everything in iterations (even this readme file)
