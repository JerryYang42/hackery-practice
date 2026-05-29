import { Game, GameLevel, MouseButton } from '../domain/Game';
import { Coordinate } from '../algo/matrices';

export class GameService {
    private games: Map<string, Game> = new Map();
    private gameHistories: Map<string, Game[]> = new Map();

    createGame(sessionId: string, level: GameLevel): void {
        const game = new Game(level);
        this.games.set(sessionId, game);
        game.start();
    }

    stopGame(sessionId: string): void {
        const game = this.games.get(sessionId);
        if (game) {
            game.stop();
            this.games.delete(sessionId);
            const history = this.gameHistories.get(sessionId) || [];
            history.push(game);
            this.gameHistories.set(sessionId, history);
        }
    }

    pauseGame(sessionId: string): void {
        const game = this.games.get(sessionId);
        if (game) {
            game.pause();
        }
    }

    resumeGame(sessionId: string): void {
        const game = this.games.get(sessionId);
        if (game) {
            game.resume();
        }
    }

    makeMove(sessionId: string, coordinate: Coordinate, mouseButton: MouseButton): void {
        const game = this.games.get(sessionId);
        if (game) {
            game.move(coordinate, mouseButton);
            if (game.isLost()) {
                this.stopGame(sessionId);
                console.log("Game lost.");
            } else if (game.isWon()) {
                this.stopGame(sessionId);
                console.log("Game won.");
            }
        }
    }

    getGame(sessionId: string): Game | undefined {
        return this.games.get(sessionId);
    }

    getGameHistory(sessionId: string): Game[] | undefined {
        return this.gameHistories.get(sessionId);
    }
}
