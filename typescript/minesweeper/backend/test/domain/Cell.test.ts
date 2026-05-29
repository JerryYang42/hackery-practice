import { Cell } from '../../src/domain/Cell';

describe('Cell', () => {
    const isMine = true;
    const adjacentMines = 0;
    let cell: Cell;

    beforeEach(() => {
        cell = new Cell(isMine, adjacentMines);
    });

    describe('click', () => {
        it('should change the current state of the cell', () => {
            const initialState = cell['currentState'];
            cell.click();
            const finalState = cell['currentState'];
            expect(finalState).not.toBe(initialState);
        });
    });

    describe('rightClick', () => {
        it('should change the current state of the cell', () => {
            const initialState = cell['currentState'];
            cell.rightClick();
            const finalState = cell['currentState'];
            expect(finalState).not.toBe(initialState);
        });
    });

    describe('isMine', () => {
        it('should return the correct mine status', () => {
            expect(cell.isMine).toBe(isMine);
            const notMineCell = new Cell(false, 0);
            expect(notMineCell.isMine).toBe(false);
        });
    });

    describe('adjacentMines', () => {
        it('should return the correct number of adjacent mines', () => {
            expect(cell.adjacentMines).toBe(0);
            const anotherCell = new Cell(false, 3);
            expect(anotherCell.adjacentMines).toBe(3);
        });
    });

    describe('isRevealed', () => {
        it('should return true if the cell is in a revealed state', () => {
            const mineCell = new Cell(true, 0);
            mineCell.click();
            expect(mineCell.isRevealed).toBe(true);
    
            const numberCell = new Cell(false, 3);
            numberCell.click();
            expect(numberCell.isRevealed).toBe(true);
    
            const emptyCell = new Cell(false, 0);
            emptyCell.click();
            expect(emptyCell.isRevealed).toBe(true);
        });
    
        it('should return false if the cell is not in a revealed state', () => {
            const hiddenCell = new Cell(true, 0);
            expect(hiddenCell.isRevealed).toBe(false);
    
            const flaggedCell = new Cell(false, 0);
            flaggedCell.rightClick();
            expect(flaggedCell.isRevealed).toBe(false);
        });
    });
});