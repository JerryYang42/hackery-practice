import { Cell } from "./Cell";
import { OperationNotSupportedException } from "./Exceptions";

/**
 * Possible States of a Minesweeper Cell
 * - Hidden: The initial state of the cell where it is not revealed yet.
 * - Revealed: The cell has been revealed by the player.
 * - Flagged: The player has marked the cell as containing a mine.
 * - Questioned: An optional state if you want to allow players to mark cells with a question mark when they are unsure.
 *
 * State Transitions
 * - Hidden to Revealed: Triggered by the player clicking on the cell.
 * - Hidden to Flagged: Triggered by the player right-clicking to place a flag on the cell.
 * - Flagged to Questioned: Triggered by the player right-clicking again on a flagged cell (if implementing).
 * - Questioned to Hidden: Triggered by another right-click cycling back to hidden (if implementing).
 * - Revealed remains Revealed: Once revealed, the state does not change.
 */
export interface CellState {
    click(cell: Cell): CellState;
    rightClick(cell: Cell): CellState;
}

export class HiddenState implements CellState {
    private static instance: HiddenState = new HiddenState();
    private constructor() {}
    static getInstance(): HiddenState { return HiddenState.instance; }

    click(cell: Cell): CellState {
        console.log("Clicked on hidden cell!");
        if (cell.isMine) {
            console.log("It's a mine! Game Over!");
            return MineState.getInstance();
        } else if (cell.adjacentMines > 0) {
            console.log("Revealing number of adjacent mines: " + cell.adjacentMines);
            return NumberState.getInstance();
        } else {
            console.log("Revealing empty cell.");
            return EmptyState.getInstance();
        }
    }

    rightClick(cell: Cell): CellState { 
        console.log("Cell flagged!");
        return CellStates.flaggedState;
    }
}

export class FlaggedState implements CellState {
    private static instance: FlaggedState = new FlaggedState();
    private constructor() {}
    static getInstance(): FlaggedState { return FlaggedState.instance; }

    click(cell: Cell): CellState {
        console.log("Cannot reveal a flagged cell.");
        return this;
    }

    rightClick(cell: Cell): CellState {
        console.log("Cell marked as questioned.");
        return CellStates.questionedState;
    }
}

export class QuestionedState implements CellState {
    private static instance: QuestionedState = new QuestionedState();
    private constructor() {}
    static getInstance(): QuestionedState { return QuestionedState.instance; }
    click(cell: Cell): CellState {
        console.log("Cannot reveal a questioned cell.");
        return this;
    }

    rightClick(cell: Cell): CellState {
        console.log("Cell unmarked.");
        return CellStates.hiddenState;
    }
}

export abstract class RevealedState implements CellState {
    click(cell: Cell): CellState {
        console.error("Cannot click on a revealed cell.");
        throw new OperationNotSupportedException("Cannot right-click on a revealed cell.");
    }

    rightClick(cell: Cell): CellState {
        console.error("Cannot click on a revealed cell.");
        throw new OperationNotSupportedException("Cannot right-click on a revealed cell.");
    }
}

export class EmptyState extends RevealedState {
    private static instance: EmptyState = new EmptyState();
    private constructor() { super(); }
    static getInstance(): EmptyState { return EmptyState.instance; }

    click(cell: Cell): CellState {
        console.log("No response when click on a revealed empty cell.");
        return this;
    }

    rightClick(cell: Cell): CellState {
        console.log("No response when right-click on a revealed empty cell.");
        return this;;
    }
}

export class MineState extends RevealedState {
    private static instance: MineState = new MineState();
    private constructor() { super(); }
    static getInstance(): MineState { return MineState.instance; }

    click(cell: Cell): CellState {
        console.log("No response when click on a revealed mine cell.");
        return this;
    }

    rightClick(cell: Cell): CellState {
        console.log("No response when right-click on a revealed mine cell.");
        return this;;
    }
}

export class NumberState extends RevealedState {
    private static instance: NumberState = new NumberState();
    private constructor() { super(); }
    static getInstance(): NumberState { return NumberState.instance; }

    click(cell: Cell): CellState {
        console.log("No response when click on a revealed number cell.");
        return this;
    }

    rightClick(cell: Cell): CellState {
        console.log("No response when right-click on a revealed number cell.");
        return this;;
    }
}

// Factory class to access singleton instances
export class CellStates {
    static get hiddenState(): CellState { return HiddenState.getInstance(); }
    static get flaggedState(): CellState { return FlaggedState.getInstance(); }
    static get questionedState(): CellState { return QuestionedState.getInstance(); }
    static get emptyState(): CellState { return EmptyState.getInstance(); }
    static get mineState(): CellState { return MineState.getInstance(); }
    static get numberState(): CellState { return NumberState.getInstance(); }
}
