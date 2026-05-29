import { Coordinate } from '../../src/algo/matrices';
import { Board } from '../../src/domain/Board';
import { Cell } from '../../src/domain/Cell';
import  { CellStates } from '../../src/domain/CellState';

describe('Board', () => {
    describe('constructor', () => {
        it('should correctly initialize a board with given width, height and mines', () => {
            const board = Board.fromMinesPositions(3, 3, [1]);
            expect(board.width).toBe(3);
            expect(board.height).toBe(3);
            expect(board.mines).toBe(1);
            expect(board.cells()).toHaveLength(9);
            expect(board.cells()).toContainEqual(new Cell(true, 0));
            expect(board.cells()).toContainEqual(new Cell(false, 1));
        });
    });

    describe('onClick', () => {
        it('should change the state of the clicked cell', () => {
            const board = Board.fromMinesPositions(3, 3, [0]);
            // 1 0 0
            // 0 0 0
            // 0 0 0
            const origin = new Coordinate(1, 1);
            board.onClick(origin);
            expect(board.get(origin.x, origin.y).currentState).not.toBe(CellStates.emptyState);
        });

        // FIXME
        it('should click all cells in the connected area if the clicked cell is empty', () => {
            // Given board initialized with the following mines:
            // 0 1 0 0 1 0
            // 0 1 1 0 0 0
            // 0 1 0 0 0 0
            // 0 1 0 0 0 0
            // 0 1 0 1 0 0
            const minesCoordinates = [
                new Coordinate(0, 1), new Coordinate(0, 4),
                new Coordinate(1, 1), new Coordinate(1, 2),
                new Coordinate(2, 1),
                new Coordinate(3, 1),
                new Coordinate(4, 1), new Coordinate(4, 3),
            ];
            const board = Board.fromMinesCoordinates(5, 6, minesCoordinates);
            const origin = new Coordinate(2, 4);

            // When
            board.onClick(origin);

            // Then
            // 2 x 3 2 x 1
            // 3 x x 2 1 1
            // 3 x 4 1 0 0
            // 3 x 4 1 1 0
            // 2 x 3 x 1 0
            // o =>  origin, y => connected area, x => mines, number => number cells to be excluded from the connected area
            // 2 x 3 2 x 1
            // 3 x x y y y
            // 3 x 4 y o y
            // 3 x 4 y y y
            // 2 x 3 x 1 y
            // expecteded to include are the coordinates marked with y (indexing start from 0)
            const emptyCellsInConnectedArea = [
                new Coordinate(2, 5),
                new Coordinate(3, 5),
                new Coordinate(4, 5),
            ];
            const numberCellsInConnectedArea = [
                new Coordinate(1, 3), new Coordinate(1, 4), new Coordinate(1, 5),
                new Coordinate(2, 3),
                new Coordinate(3, 3), new Coordinate(3, 4),
                new Coordinate(4, 4),
            ];
            const numberCellsHidden = [
                new Coordinate(0, 0), new Coordinate(0, 2), new Coordinate(0, 3), new Coordinate(0, 5),
                new Coordinate(1, 0), 
                new Coordinate(2, 0), new Coordinate(2, 2),
                new Coordinate(3, 0), new Coordinate(3, 2), 
                new Coordinate(4, 0), new Coordinate(4, 2),
            ]
            const expectedHidden = [ ...minesCoordinates, ...numberCellsHidden];
            const expectedEmpty = [origin, ...emptyCellsInConnectedArea];
            const expectedNumber = numberCellsInConnectedArea;
            expectedHidden.forEach(({x, y}) => {
                expect(board.get(x, y).currentState).toBe(CellStates.hiddenState);
            });
            expectedEmpty.forEach(({x, y}) => {
                expect(board.get(x, y).currentState).toBe(CellStates.emptyState);
            });
            expectedNumber.forEach(({x, y}) => {
                expect(board.get(x, y).currentState).toBe(CellStates.numberState);
            });
        });
    });

    describe('minesCoordinates', () => {
        it('should return an array of coordinates for all the mines on the board', () => {
            const board = new Board(3, 3);
            board.set(0, 0, new Cell(true, 0));
            board.set(1, 1, new Cell(true, 1));
            board.set(2, 2, new Cell(true, 2));

            const minesCoordinates = board.minesCoordinates;

            expect(minesCoordinates).toHaveLength(3);
            expect(minesCoordinates).toContainEqual(new Coordinate(0, 0));
            expect(minesCoordinates).toContainEqual(new Coordinate(1, 1));
            expect(minesCoordinates).toContainEqual(new Coordinate(2, 2));
        });

        it('should return an empty array if there are no mines on the board', () => {
            const board = new Board(3, 3);

            const minesCoordinates = board.minesCoordinates;

            expect(minesCoordinates).toHaveLength(0);
        });
    });
    
});