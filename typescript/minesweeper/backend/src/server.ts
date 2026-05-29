import express from 'express';
import { GameService } from './services/GameService';
import { Coordinate } from './algo/matrices';
import { GameLevel, MouseButton } from './domain/Game';

const app = express();
app.use(express.json());

const gameService = new GameService();

app.post('/game', (req, res) => {
    const { sessionId, level } = req.body;
    switch (level) {
        case 'Beginner': 
            gameService.createGame(sessionId, GameLevel.Beginner); break;
        case 'Intermediate':
            gameService.createGame(sessionId, GameLevel.Intermediate); break;
        case 'Expert':
            gameService.createGame(sessionId, GameLevel.Expert); break;
        default:
            throw new Error('Invalid game level');
    }
    res.status(201).send('Game started');
});

app.post('/game/stop', (req, res) => {
    const { sessionId } = req.body;
    gameService.stopGame(sessionId);
    res.send('Game stopped');
});

app.post('/game/pause', (req, res) => {
    const { sessionId } = req.body;
    gameService.pauseGame(sessionId);
    res.send('Game paused');
});

app.post('/game/resume', (req, res) => {
    const { sessionId } = req.body;
    gameService.resumeGame(sessionId);
    res.send('Game resumed');
});

app.post('/game/move', (req, res) => {
    const { sessionId, x, y, mouseButton } = req.body;
    const coordinate = new Coordinate(x, y);
    switch (mouseButton) {
        case "Left": gameService.makeMove(sessionId, coordinate, MouseButton.Left); break;
        case "Right": gameService.makeMove(sessionId, coordinate, MouseButton.Right); break;
    }
    
    res.send('Move made');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
