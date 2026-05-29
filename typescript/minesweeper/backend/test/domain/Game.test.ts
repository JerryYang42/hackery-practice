import { Coordinate } from "../../src/algo/matrices";
import { Board } from "../../src/domain/Board";
import { Game, GameLevel, GameState, MouseButton } from "../../src/domain/Game";

describe('Game', () => {
    let game: Game;
    let board: Board;

    beforeEach(() => {
        board = new Board(9, 9);
        game = new Game(GameLevel.Beginner);
        game['board'] = board; // Accessing private property for testing purposes
    });

    afterEach(() => {
        game.stop();
    });

    describe('constructor', () => {
        it('should initialize the board based on the game level', () => {
            expect(game['board']).toBe(board); // Accessing private property for testing purposes
            expect(game['level']).toBe(GameLevel.Beginner); // Accessing private property for testing purposes
        });
    });

    describe('start', () => {
        it('should start the game if the state is ready', () => {
            game.start();
            expect(game['state']).toBe(GameState.Playing); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(true); // Accessing private property for testing purposes
        });

        it('should not start the game if the state is not ready', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            game.start();
            expect(game['state']).toBe(GameState.Playing); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });
    });

    describe('stop', () => {
        it('should stop the game if the state is playing or paused', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            game.stop();
            expect(game['state']).toBe(GameState.Stopped); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes

            game['state'] = GameState.Paused; // Accessing private property for testing purposes
            game.stop();
            expect(game['state']).toBe(GameState.Stopped); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });

        it('should not stop the game if the state is not playing or paused', () => {
            game.stop();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });
    });

    // Add tests for the remaining methods (pause, resume, win, lose, move)
    describe('pause', () => {
        it('should pause the game if the state is playing', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            game.pause();
            expect(game['state']).toBe(GameState.Paused); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });

        it('should not pause the game if the state is not playing', () => {
            game.pause();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });
    });

    describe('resume', () => {
        it('should resume the game if the state is paused', () => {
            game['state'] = GameState.Paused; // Accessing private property for testing purposes
            game.resume();
            expect(game['state']).toBe(GameState.Playing); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(true); // Accessing private property for testing purposes
        });

        it('should not resume the game if the state is not paused', () => {
            game.resume();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });
    });

    describe('reset', () => {
        it('should reset the game if the state is stopped', () => {
            game['state'] = GameState.Stopped; // Accessing private property for testing purposes
            const spy = jest.spyOn(game['timer'], 'reset')
            game.reset();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(spy).toHaveBeenCalled(); // Accessing private property for testing purposes
        });
    
        it('should reset the game if the state is won', () => {
            game['state'] = GameState.Won; // Accessing private property for testing purposes
            const spy = jest.spyOn(game['timer'], 'reset')
            
            game.reset();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(spy).toHaveBeenCalled(); // Accessing private property for testing purposes
        });
    
        it('should reset the game if the state is lost', () => {
            game['state'] = GameState.Lost; // Accessing private property for testing purposes
            const spy = jest.spyOn(game['timer'], 'reset')
            game.reset();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(game['timer'].reset).toHaveBeenCalled(); // Accessing private property for testing purposes
            expect(spy).toHaveBeenCalled();
        });
    
        it('should not reset the game if the state is not stopped, won, or lost', () => {
            const spy = jest.spyOn(game['timer'], 'reset')
            game.reset();
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('win', () => {
        it('should win the game if the state is playing', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            game['win']();
            expect(game['state']).toBe(GameState.Won); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });

        it('should not win the game if the state is not playing', () => {
            game['win']();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });
    });

    describe('lose', () => {
        it('should lose the game if the state is playing', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            game['lose']();
            expect(game['state']).toBe(GameState.Lost); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });

        it('should not lose the game if the state is not playing', () => {
            game['lose']();
            expect(game['state']).toBe(GameState.Ready); // Accessing private property for testing purposes
            expect(game['timer'].isRunning).toBe(false); // Accessing private property for testing purposes
        });
    });

    describe('move', () => {
        it('should click on the board if the state is playing and the mouse button is left', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            const spy = jest.spyOn(board, 'onClick');
            game['checkWinOrLose'] = jest.fn();
            game.move(new Coordinate(0, 0), MouseButton.Left);
            expect(spy).toHaveBeenCalled();
            expect(game['checkWinOrLose']).toHaveBeenCalled();
        });

        it('should right click on the board if the state is playing and the mouse button is right', () => {
            game['state'] = GameState.Playing; // Accessing private property for testing purposes
            const spy = jest.spyOn(board, 'onRightClick');
            game['checkWinOrLose'] = jest.fn();
            game.move(new Coordinate(0, 0), MouseButton.Right);
            expect(spy).toHaveBeenCalled();
            expect(game['checkWinOrLose']).not.toHaveBeenCalled();
        });

        it('should not click on the board if the state is not playing', () => {
            const spy = jest.spyOn(board, 'onClick');
            game['checkWinOrLose'] = jest.fn();
            game.move(new Coordinate(0, 0), MouseButton.Left);
            expect(spy).not.toHaveBeenCalled();
            expect(game['checkWinOrLose']).not.toHaveBeenCalled();
        });
    });

    describe('checkWinOrLose', () => {
        it('should lose the game if a mine is revealed', () => {
            const game = new Game(GameLevel.Beginner);
            game['board'] = new Board(9, 9);
            game['mineRevealed'].check = jest.fn(() => true);
            game['lose'] = jest.fn();
    
            game['checkWinOrLose']();
    
            expect(game['lose']).toHaveBeenCalled();
        });
    
        it('should win the game if all non-mine cells are revealed', () => {
            const game = new Game(GameLevel.Beginner);
            game['board'] = new Board(9, 9);
            game['allNoneMineCellsRevealed'].check = jest.fn(() => true);
            game['win'] = jest.fn();
    
            game['checkWinOrLose']();
    
            expect(game['win']).toHaveBeenCalled();
        });
    
        it('should not win or lose the game if no condition is met', () => {
            const game = new Game(GameLevel.Beginner);
            game['board'] = new Board(9, 9);
            game['mineRevealed'].check = jest.fn(() => false);
            game['allNoneMineCellsRevealed'].check = jest.fn(() => false);
            game['win'] = jest.fn();
            game['lose'] = jest.fn();
    
            game['checkWinOrLose']();
    
            expect(game['win']).not.toHaveBeenCalled();
            expect(game['lose']).not.toHaveBeenCalled();
        });
    });
});