import { Board } from "./Board";

abstract class BoardChecker {
    abstract check(board: Board): boolean;
}

export class MineRevealed extends BoardChecker {
    check(board: Board): boolean {
        return board.minesCoordinates.some(coordinate => board.get(coordinate.x, coordinate.y).isRevealed);
    }
}

export class AllNonMineCellsRevealed extends BoardChecker {
    check(board: Board): boolean {
        return board.cells().every((cell) => cell.isRevealed || (cell.isMine && !cell.isRevealed));
    }
}

// TODO: add logic for checking if all mines are flagged