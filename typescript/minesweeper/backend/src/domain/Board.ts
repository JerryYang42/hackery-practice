import { generateRandNumbers, Range } from '../algo/arrays';
import { AdjacentMinesMatrix, ConnectedAreaFinder, Coordinate, Matrix, MinesMatrix } from '../algo/matrices';
import { Cell } from './Cell';
import { CellStates, EmptyState } from './CellState';

export class Board extends Matrix<Cell> {
    private _minesMatrix: MinesMatrix = new MinesMatrix(0, 0, []);
    private _adjacentMinesMatrix: AdjacentMinesMatrix = new AdjacentMinesMatrix(this._minesMatrix);
    private _mines: number = 0;

    constructor(public width: number, public height: number) {
        super(width, height, new Cell(false, 0)); // Call the constructor of the parent class Matrix
        this.initialize([])
    }

    static fromMinesCoordinates(width: number, height: number, minesCoordinates: Coordinate[]): Board {
        const board = new Board(width, height);
        board.initialize(minesCoordinates);
        minesCoordinates;
        return board;
    }

    static fromMinesPositions(width: number, height: number, minesPositions: number[]): Board {
        const minesCoordinates = minesPositions.map(position => Coordinate.from(position, width))
        return this.fromMinesCoordinates(width, height, minesCoordinates);
    }

    static fromMines(width: number, height: number, mines: number): Board {
        const randNumbers = generateRandNumbers(new Range(0, width * height), mines);
        return this.fromMinesPositions(width, height, randNumbers);
    }

    private initialize(minesPositions: Coordinate[]): void {
        this._mines = minesPositions.length;
        this._minesMatrix = new MinesMatrix(this.width, this.height, minesPositions);
        this._adjacentMinesMatrix = new AdjacentMinesMatrix(this._minesMatrix);
        
        this.coordinates().forEach(({x, y}) => {
            this.set(x, y, new Cell(this._minesMatrix.isMine(x, y), this._adjacentMinesMatrix.count(x, y)));
        });
    }

    onClick(coordinate: Coordinate): void {
        const {x, y} = coordinate;
        const cell = this.get(x, y);
        cell.click();
        if (cell.currentState === CellStates.emptyState) {
            this.cascadeOnEmptyCell(coordinate);
        }
    }

    onRightClick(coordinate: Coordinate): void {
        const {x, y} = coordinate;
        const cell = this.get(x, y);
        cell.rightClick();
    }

    private cascadeOnEmptyCell(origin: Coordinate): void {
        const connectedAreaFinder = new ConnectedAreaFinder(this._minesMatrix, this._adjacentMinesMatrix);
        const connectedArea = connectedAreaFinder.connectedArea(origin);
        connectedArea.forEach(( {x, y} ) => {
            this.get(x, y).click();
        });
    }

    get mines(): number {      
        return this._mines;
    }

    get minesCoordinates(): Coordinate[] {
        const minesCoordinates: Coordinate[] = [];
        this.coordinates().forEach(({x, y}) => {
            if (this.get(x, y).isMine) {
                minesCoordinates.push(new Coordinate(x, y));
            }
        });
        return minesCoordinates;
    }
}

export class Boards {
    static beginner(): Board {
        return Board.fromMines(9, 9, 10);
    }

    static intermediate(): Board {
        return Board.fromMines(16, 16, 40);
    }

    static expert(): Board {
        return Board.fromMines(30, 16, 99);
    }
}
