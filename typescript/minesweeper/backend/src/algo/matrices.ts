export class Coordinate {
    constructor(public x: number, public y: number) {}

    static from(position: number, width: number): Coordinate {
        const x = position % width
        const y = Math.floor(position / width)
        return new Coordinate(x, y)
    }

    neighbors(width: number, height: number): Coordinate[] {
        const neighbors: Coordinate[] = []
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = this.x + dx
                const ny = this.y + dy
                if (nx >= 0 && ny >= 0 && ny < height && nx < width) {
                    neighbors.push(new Coordinate(nx, ny))
                }
            }
        }
        return neighbors
    }

    equals(other: Coordinate): boolean {
        return this.x === other.x && this.y === other.y;
    }
}

export class Matrix<T> {
    private matrix: T[][];

    constructor(public width: number, public height: number, initial: T) {
        this.matrix = Array(height).fill(null).map(() => Array(width).fill(initial))
    }

    get(x: number, y: number): T {
        return this.matrix[y][x]
    }

    set(x: number, y: number, value: T): void {
        this.matrix[y][x] = value
    }

    coordinates(): Coordinate[] {
        const coordinates: Coordinate[] = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                coordinates.push(new Coordinate(x, y));
            }
        }
        return coordinates;
    }

    cells(): T[] {
        const cells: T[] = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                cells.push(this.get(x, y));
            }
        }
        return cells;
    }
}

export class MinesMatrix extends Matrix<boolean> {

    constructor(public width: number, public height: number, minesPositions: Coordinate[]) {
        super(width, height, false)
        minesPositions.forEach(({x, y}) => {
            this.set(x, y, true);
        });
    }

    isMine(x: number, y: number): boolean {
        return this.get(x, y);
    }
}

export class AdjacentMinesMatrix extends Matrix<number> {

    constructor(minesMatrix: MinesMatrix) {
        const {width, height} = minesMatrix;
        super(width, height, 0);
        this.coordinates().forEach((coordinate) => {
            coordinate.neighbors(width, height).forEach((neighbor) => {
                if (minesMatrix.isMine(neighbor.x, neighbor.y)) {
                    this.increment(coordinate.x, coordinate.y);
                }
            });
        });
    }

    private increment(x: number, y: number): void {
        this.set(x, y, this.get(x, y) + 1);
    }

    count(x: number, y: number): number {
        return this.get(x, y)
    }
}

/**
 * Connect Area is a group of empty cells that are connected to each other
 * and bounded by number cells.
 * Connected means the neighboar empty cell is on up, down, left, or right 
 * of the current empty cell.
 * To note, the area excludes the origin itself.
 */
export class ConnectedAreaFinder {
    private mineMatrix: MinesMatrix;
    private adjacentMinesMatrix: AdjacentMinesMatrix;
    width: number;
    height: number;

    constructor(mineMatrix: MinesMatrix, adjacentMinesMatrix: AdjacentMinesMatrix) {
        this.mineMatrix = mineMatrix;
        this.adjacentMinesMatrix = adjacentMinesMatrix;
        if (mineMatrix.width !== adjacentMinesMatrix.width || mineMatrix.height !== adjacentMinesMatrix.height) {
            throw new Error('MineMatrix and AdjacentMinesMatrix must have the same width and height');
        }
        this.width = mineMatrix.width;
        this.height = mineMatrix.height;
    }

    connectedArea(origin: Coordinate): Coordinate[] {
        if (!this.isEmptyCell(origin)) { return [] }

        const visited = new Matrix<Boolean>(this.width, this.height, false);
        const isVisited = (coordinate: Coordinate) => visited.get(coordinate.x, coordinate.y);
        const setVisited = (coordinate: Coordinate) => visited.set(coordinate.x, coordinate.y, true);
        
        // init
        setVisited(origin)
        const getValidNeighbors = (coordinate: Coordinate) => {
            const neighbors =  coordinate.neighbors(this.width, this.height)
            const neighborsExcludingOrigin = neighbors.filter((neighbor) => { return !neighbor.equals(origin); })
            const neighborsExcludingMines = neighborsExcludingOrigin.filter((neighbor) => { return !this.isMine(neighbor); })
            const neighborsExcludingVisited = neighborsExcludingMines.filter((neighbor) => { return !isVisited(neighbor); })
            return neighborsExcludingVisited
        };
        const connectedCells = Array();
        const queue = Array(...getValidNeighbors(origin));

        while (queue.length > 0) {
            const coordinate = queue.pop();
            if (!coordinate) { break; }  // This should never happen

            if (!isVisited(coordinate)) { 
                setVisited(coordinate);
                if (this.isEmptyCell(coordinate) ) {
                    connectedCells.push(coordinate);
                    const validNeighbors = getValidNeighbors(coordinate);
                    this.uniquePush(queue, validNeighbors);
                } else if (this.isNumberCell(coordinate)) {
                    connectedCells.push(coordinate);
                } else if (this.isMine(coordinate)) {
                // do nothing
                }
            }
        }
        return connectedCells;
    }

    private isMine(coordinate: Coordinate): boolean {
        const {x, y} = coordinate;
        return this.mineMatrix.isMine(x, y);
    }
    private isEmptyCell(coordinate: Coordinate): boolean {
        const {x, y} = coordinate;
        return !this.mineMatrix.isMine(x, y) && this.adjacentMinesMatrix.count(x, y) === 0;
    }
    private isNumberCell(coordinate: Coordinate): boolean {
        const {x, y} = coordinate;
        return !this.mineMatrix.isMine(x, y) && this.adjacentMinesMatrix.count(x, y) > 0;
    }

    private uniquePush(array: Coordinate[], valueOrArray: Coordinate | Coordinate[]): void {
        function includesCoordinate(array: Coordinate[], target: Coordinate): boolean {
            return array.some(item => item.equals(target));
        }
        // Check if the input is an array
        if (Array.isArray(valueOrArray)) {
            // If it's an array, iterate over each element
            valueOrArray.forEach(value => {
                if (!includesCoordinate(array, value)) {
                    array.push(value);
                }
            });
        } else {
            // If it's a single value, check for uniqueness and push if not present
            if (!includesCoordinate(array, valueOrArray)) {
                array.push(valueOrArray);
            }
        }
    };
}
