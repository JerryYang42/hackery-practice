import { Coordinate } from "../../src/algo/matrices";
import { GameLevel, Game, MouseButton, GameState } from "../../src/domain/Game";
import { GameService } from "../../src/services/GameService";

describe('GameService', () => {
    let gameService: GameService;
    let sessionId: string;
    let level: GameLevel;

    beforeEach(() => {
        gameService = new GameService();
        sessionId = 'session123';
        level = GameLevel.Beginner;
    });

    afterEach(() => {
        gameService.stopGame(sessionId);
    });

    describe('createGame', () => {
        it('should create a new game and add it to the games map', () => {
            gameService.createGame(sessionId, level);
            const game = gameService.getGame(sessionId);
            expect(game).toBeInstanceOf(Game);
        });
    });

    describe('stopGame', () => {
        it('should stop the game and move it to the game histories map', () => {
            gameService.createGame(sessionId, level);
            gameService.stopGame(sessionId);
            const game = gameService.getGame(sessionId);
            const history = gameService.getGameHistory(sessionId);
            expect(game).toBeUndefined();
            expect(history).toHaveLength(1);
            expect(history![0]).toBeInstanceOf(Game);
        });

        it('should do nothing if the game does not exist', () => {
            gameService.stopGame(sessionId);
            const history = gameService.getGameHistory(sessionId);
            expect(history).toBeUndefined();
        });
    });

    describe('pauseGame', () => {
        it('should pause the game', () => {
            gameService.createGame(sessionId, level);
            gameService.pauseGame(sessionId);
            const game = gameService.getGame(sessionId);
            if (game) {
                expect(game['state']).toBe(GameState.Paused);
            }
        });

        it('should do nothing if the game does not exist', () => {
            gameService.pauseGame(sessionId);
            const game = gameService.getGame(sessionId);
            expect(game).toBeUndefined();
        });
    });

    describe('resumeGame', () => {
        it('should resume the game', () => {
            gameService.createGame(sessionId, level);
            gameService.pauseGame(sessionId);
            gameService.resumeGame(sessionId);
            const game = gameService.getGame(sessionId);
            if (game) {
                expect(game['state']).toBe(GameState.Playing);
            }
        });

        it('should do nothing if the game does not exist', () => {
            gameService.resumeGame(sessionId);
            const game = gameService.getGame(sessionId);
            expect(game).toBeUndefined();
        });
    });

    describe('makeMove', () => {
        it('should make a move in the game', () => {
            gameService.createGame(sessionId, level);
            const coordinate = new Coordinate(0, 0);
            const mouseButton: MouseButton = MouseButton.Left;
            gameService.makeMove(sessionId, coordinate, mouseButton);
            const game = gameService.getGame(sessionId);
            // TODO: Add your assertions here
        });

        it('should do nothing if the game does not exist', () => {
            const coordinate = new Coordinate(0, 0);
            const mouseButton: MouseButton = MouseButton.Left;
            gameService.makeMove(sessionId, coordinate, mouseButton);
            const game = gameService.getGame(sessionId);
            expect(game).toBeUndefined();
        });
    });
});