import { Board, Boards } from '../domain/Board';
import { Coordinate } from '../algo/matrices';
import { Timer } from './Timer';
import { AllNonMineCellsRevealed, MineRevealed } from './BoardChecker';

/**
 * Ready --start--> Playing
 * Playing --stop--> Stopped
 * Stopped --reset--> Ready
 * Playing --pause--> Paused
 * Paused --resume--> Playing
 * Paused --stop--> Stopped
 * Playing --win--> Won
 * Playing --lose--> Lost
 * Won --reset--> Ready
 * Lost --reset--> Ready
 */
export enum GameState {
    Ready,
    Playing,
    Paused,
    Stopped,
    Won,
    Lost
}
export enum GameLevel {
    Beginner,
    Intermediate,
    Expert
}
export enum MouseButton {
    Left,
    Right
}
export class Game {
    private board: Board;
    private state: GameState = GameState.Ready;
    private timer: Timer = new Timer();

    private mineRevealed = new MineRevealed();
    private allNoneMineCellsRevealed = new AllNonMineCellsRevealed();

    constructor(public level: GameLevel) {
        switch (this.level) {
            case GameLevel.Beginner:
                this.board = Boards.beginner(); break;
            case GameLevel.Intermediate:
                this.board = Boards.intermediate(); break;
            case GameLevel.Expert:
                this.board = Boards.expert(); break;
        }
    }

    start(): void {
        if (this.state === GameState.Ready) {
            this.state = GameState.Playing;
            // this.timer.reset();
            this.timer.start();
            console.log("Game started.");
        }
    }

    stop(): void {
        if (this.state === GameState.Playing || this.state === GameState.Paused) {
            this.state = GameState.Stopped;
            this.timer.stop();
            console.log("Game stopped.");
        }
    }

    reset(): void {
        if (this.state === GameState.Stopped || 
            this.state === GameState.Won || 
            this.state === GameState.Lost) {
            this.state = GameState.Ready;
            this.timer.reset();
            console.log("Game restarted.");
        }
    }

    pause(): void {
        if (this.state === GameState.Playing) {
            this.state = GameState.Paused;
            this.timer.stop();
            console.log("Game paused.");
        }
    }

    resume(): void {
        if (this.state === GameState.Paused) {
            this.state = GameState.Playing;
            this.timer.start();
            console.log("Game resumed.");
        }
    }

    move(coordinate: Coordinate, mouseButton: MouseButton): void {
        if (this.state === GameState.Playing) {
            if (mouseButton === MouseButton.Left) {
                this.board.onClick(coordinate);
                this.checkWinOrLose();
            } else if (mouseButton === MouseButton.Right) {
                this.board.onRightClick(coordinate);
            }
        }
    }

    private checkWinOrLose(): void {
        if (this.mineRevealed.check(this.board)) {
            this.lose();
        } else if (this.allNoneMineCellsRevealed.check(this.board)) {
            this.win();
        }
    }

    private win(): void {
        if (this.state === GameState.Playing) {
            this.state = GameState.Won;
            this.timer.stop();
            console.log("Game won!");
        }
    }

    private lose(): void {
        if (this.state === GameState.Playing) {
            this.state = GameState.Lost;
            this.timer.stop();
            console.log("Game lost!");
        }
    }

    isWon(): boolean {
        return this.state === GameState.Won;
    }
    
    isLost(): boolean {
        return this.state === GameState.Lost;
    }
}
