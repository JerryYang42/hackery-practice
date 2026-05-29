import { Cell } from '../../src/domain/Cell';
import { HiddenState, MineState, NumberState, EmptyState, CellStates, FlaggedState, QuestionedState } from '../../src/domain/CellState';

describe('HiddenState', () => {
    let hiddenState: HiddenState = CellStates.hiddenState;
    let cell: Cell;

    beforeEach(() => {});

    describe('click', () => {
        it('should return MineState if cell is a mine', () => {
            const isMind = true;
            let adjacentMinds = 0;
            cell = new Cell(isMind, adjacentMinds);
            let actual = hiddenState.click(cell)
            expect(actual).toBeInstanceOf(MineState);

            adjacentMinds = 1;
            cell = new Cell(isMind, adjacentMinds);
            actual = hiddenState.click(cell);
            expect(actual).toBeInstanceOf(MineState);
        });

        it('should return NumberState if cell is not a mine and adjacentMines is above zero', () => {
            const isMind = false;
            let adjacentMinds = 1;
            cell = new Cell(isMind, adjacentMinds);
            let actual = hiddenState.click(cell);
            expect(actual).toBeInstanceOf(NumberState);

            adjacentMinds = 8;
            cell = new Cell(isMind, adjacentMinds);
            actual = hiddenState.click(cell);
            expect(actual).toBeInstanceOf(NumberState);
        });

        it('should return EmptyState if cell is not a mine and adjacentMines is zero', () => {
            const isMind = false;
            let adjacentMinds = 0;
            cell = new Cell(isMind, adjacentMinds);
            let actual = hiddenState.click(cell);
            expect(actual).toBeInstanceOf(EmptyState);
        });
    });

    describe('rightClick', () => {
        it('should return FlaggedState', () => {
            let actual = hiddenState.rightClick(cell);
            expect(actual).toBeInstanceOf(FlaggedState);
        });
    });
});

describe('FlaggedState', () => {
    let flaggedState: FlaggedState = CellStates.flaggedState;
    let cell: Cell = new Cell(true, 0);;

    beforeEach(() => {});

    describe('click', () => {
        it('should return itself', () => {
            let actual = flaggedState.click(cell);
            expect(actual).toBeInstanceOf(FlaggedState);
        });
    });

    describe('rightClick', () => {
        it('should return QuestionedState', () => {
            let actual = flaggedState.rightClick(cell);
            expect(actual).toBeInstanceOf(QuestionedState);
        });
    });
});

describe('QuestionedState', () => {
    let questionedState: QuestionedState = CellStates.questionedState;
    let cell: Cell = new Cell(true, 0);;

    beforeEach(() => {});

    describe('click', () => {
        it('should return itself', () => {
            let actual = questionedState.click(cell);
            expect(actual).toBeInstanceOf(QuestionedState);
        });
    });

    describe('rightClick', () => {
        it('should return HiddenState', () => {
            let actual = questionedState.rightClick(cell);
            expect(actual).toBeInstanceOf(HiddenState);
        });
    });
});

describe('EmptyState', () => {
    let emptyState: EmptyState = CellStates.emptyState;
    let cell: Cell = new Cell(true, 0);;

    beforeEach(() => {});

    describe('click', () => {
        it('should return itself', () => {
            let actual = emptyState.click(cell);
            expect(actual).toBeInstanceOf(EmptyState);
        });
    });

    describe('rightClick', () => {
        it('should return itself', () => {
            let actual = emptyState.rightClick(cell);
            expect(actual).toBeInstanceOf(EmptyState);
        });
    });
});

describe('MineState', () => {
    let mineState: MineState = CellStates.mineState;
    let cell: Cell = new Cell(true, 0);;

    beforeEach(() => {});

    describe('click', () => {
        it('should return itself', () => {
            let actual = mineState.click(cell);
            expect(actual).toBeInstanceOf(MineState);
        });
    });

    describe('rightClick', () => {
        it('should return itself', () => {
            let actual = mineState.rightClick(cell);
            expect(actual).toBeInstanceOf(MineState);
        });
    });
});

describe('NumberState', () => {
    let numberState: NumberState = CellStates.numberState;
    let cell: Cell = new Cell(true, 0);;

    beforeEach(() => {});

    describe('click', () => {
        it('should return itself', () => {
            let actual = numberState.click(cell);
            expect(actual).toBeInstanceOf(NumberState);
        });
    });

    describe('rightClick', () => {
        it('should return itself', () => {
            let actual = numberState.rightClick(cell);
            expect(actual).toBeInstanceOf(NumberState);
        });
    });
});
