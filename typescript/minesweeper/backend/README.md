# Backend for Minesweeper Game

This is the backend for a Minesweeper game. The game logic is implemented in TypeScript and it uses Jest for testing.

## Overview

Minesweeper is a single-player puzzle game. The objective of the game is to clear a rectangular board containing hidden "mines" without detonating any of them, with help from clues about the number of neighboring mines in each field.

The backend handles the game logic, such as the creation of the game board, placement of the mines, and the rules for revealing cells.

## Getting Started

To get started with the project, follow these steps:

1. Navigate to the backend directory:

```sh
cd backend
```

2. Install the dependencies:

```
npm install
```

## Running the Project

To run the project, use the following command:

## Running Server

To run this `server.ts` file, you need to first compile it to JavaScript and then run the compiled JavaScript file with Node.js. Here are the steps:

1. install the necessary dependencies:

```bash
npm install express
npm install @types/express --save-dev
npm install typescript ts-node --save-dev
```

2. compile the TypeScript file to JavaScript. 

```bash
npx tsc server.ts
```

this will create a `server.js` file in the same directory.

3. Run the compiled JavaScirpt file with Node.js. 

```bash
node server.js
```

This will start the server on port 3000 (or the port specified in your PORT environment variable).

**Note**: If you want to automatically compile your TypeScript files and restart your server whenever you make changes, you can use a tool like nodemon and ts-node. First, install these tools by running npm install nodemon ts-node --save-dev. Then, you can start your server with 

```bash
npx nodemon --exec ts-node server.ts
```

## Testing locally

1. Create a game with session id `"123"` and level `"Beginner"`

```bash
curl -X POST -H "Content-Type: application/json" -d '{"sessionId":"123", "level":"Beginner"}' http://localhost:3000/game
```

2. Stop the game

```bash
curl -X POST -H "Content-Type: application/json" -d '{"sessionId":"123"}' http://localhost:3000/game/stop
```

3. Pause the game (if the game is playing)

```bash
curl -X POST -H "Content-Type: application/json" -d '{"sessionId":"123"}' http://localhost:3000/game/pause
```

4. Resume the game (if the game is paused)

```bash
curl -X POST -H "Content-Type: application/json" -d '{"sessionId":"123"}' http://localhost:3000/game/resume
```

5. Make move 


## Running Tests

This project uses Jest for testing. To run the tests, use the following command:

The tests are located in the test directory, and the Jest configuration is specified in the jest.config.js file.

## Code Structure

The main game logic is located in the src/domain directory. Here's a brief overview of the key files:

Cell.ts: This file contains the Cell class, which represents a cell on the Minesweeper board.
CellState.ts: This file defines the possible states of a cell.
Exceptions.ts: This file contains custom exception classes for the game.

Enjoy the game!
