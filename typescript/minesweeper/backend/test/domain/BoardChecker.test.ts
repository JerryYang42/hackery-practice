import { AllNonMineCellsRevealed, MineRevealed } from "../../src/domain/BoardChecker";
import { Board} from "../../src/domain/Board";
import { Cell } from "../../src/domain/Cell";
import { Coordinate } from "../../src/algo/matrices";


describe('AllNonMineCellsRevealedChecker', () => {
    let checker: AllNonMineCellsRevealed = new AllNonMineCellsRevealed();
    let board: Board;
    
    beforeEach(() => {
        // 0 0
        // 1 0
        board = Board.fromMinesCoordinates(2, 2, [new Coordinate(1, 0)]);
    });

    it('should return true if all non-mine cells are revealed', () => {
        const nonMineCells = [
            new Coordinate(0, 0),
            new Coordinate(0, 1),
            new Coordinate(1, 1),
        ]
        board.get(0, 0).click();
        let result: boolean = checker.check(board);
        expect(result).toBe(false);
        nonMineCells.forEach((coordinate) => {
            board.get(coordinate.x, coordinate.y).click();
        });
        result = checker.check(board);
        expect(result).toBe(true);
    });
});


describe('MineRevealedChecker', () => {
    let checker: MineRevealed = new MineRevealed();;
    let board: Board;
    
    beforeEach(() => {
        // Set up the board with mines
        board = Board.fromMinesCoordinates(2, 2, [new Coordinate(1, 0)]);
    });

    it('should return true if any mine cell is revealed', () => {
        board.get(1, 0).click(); // Reveal the mine cell
        const result = checker.check(board);
        expect(result).toBe(true);
    });

    it('should return false if no mine cell is revealed', () => {
        let result = checker.check(board);
        expect(result).toBe(false);
        board.get(0, 0).click();
        board.get(0, 1).click();
        board.get(1, 1).click();
        result = checker.check(board);
        expect(result).toBe(false);
    });
});