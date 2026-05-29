import { CellState, CellStates } from './CellState';

export class Cell {
    private _currentState: CellState;
    private _isMine: boolean;
    private _adjacentMines: number;

    constructor(isMine: boolean, adjacentMinds: number) {
        this._isMine = isMine;
        this._adjacentMines = adjacentMinds;
        this._currentState = CellStates.hiddenState;
    }

    click() {
        this._currentState = this._currentState.click(this);
    }

    rightClick() {
        this._currentState = this._currentState.rightClick(this);
    }

    get adjacentMines(): number {
        return this._adjacentMines;
    }

    get isMine(): boolean {
        return this._isMine;
    }

    get currentState(): CellState {
        return this._currentState;
    }

    get isRevealed(): boolean {
        return this._currentState === CellStates.mineState || this._currentState === CellStates.numberState || this._currentState === CellStates.emptyState; 
    }
}
