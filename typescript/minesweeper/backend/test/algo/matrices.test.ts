import { AdjacentMinesMatrix, ConnectedAreaFinder, Coordinate, MinesMatrix } from '../../src/algo/matrices';

describe('Coordinate', () => {
    describe('constructor', () => {
        it('should correctly assign x and y', () => {
            const coordinate = new Coordinate(1, 2);
            expect(coordinate.x).toBe(1);
            expect(coordinate.y).toBe(2);
        });
    });

    describe('from', () => {
        it('should correctly calculate x and y from position and width', () => {
            let coordinate = Coordinate.from(10, 3);
            // 0  1  2
            // 3  4  5
            // 6  7  8
            // 9 10 11  -> 10 is the 4th row and 1st column
            expect(coordinate.x).toBe(1);
            expect(coordinate.y).toBe(3);

            coordinate = Coordinate.from(10, 4);
            // 0  1  2  3
            // 4  5  6  7
            // 8  9 10 11  -> 10 is the 4th row and 1st column
            expect(coordinate.x).toBe(2);
            expect(coordinate.y).toBe(2);
        });
    });

    describe('neighbors', () => {
        it('should correctly calculate neighbors within bounds', () => {
            const coordinate = new Coordinate(1, 1);
            const neighbors = coordinate.neighbors(3, 3);
            expect(neighbors).toHaveLength(8);
            expect(neighbors).toContainEqual(new Coordinate(0, 0));
            expect(neighbors).toContainEqual(new Coordinate(1, 0));
            expect(neighbors).toContainEqual(new Coordinate(2, 0));
            expect(neighbors).toContainEqual(new Coordinate(0, 1));
            expect(neighbors).toContainEqual(new Coordinate(2, 1));
            expect(neighbors).toContainEqual(new Coordinate(0, 2));
            expect(neighbors).toContainEqual(new Coordinate(1, 2));
            expect(neighbors).toContainEqual(new Coordinate(2, 2));
        });

        it('should not include neighbors out of bounds', () => {
            const coordinate = new Coordinate(0, 0);
            const neighbors = coordinate.neighbors(3, 3);
            expect(neighbors).toHaveLength(3);
            expect(neighbors).toContainEqual(new Coordinate(1, 0));
            expect(neighbors).toContainEqual(new Coordinate(0, 1));
            expect(neighbors).toContainEqual(new Coordinate(1, 1));
        });
    });

    describe('equals', () => {
        it('should correctly compare coordinates', () => {
            const coordinate1 = new Coordinate(1, 2);
            const coordinate2 = new Coordinate(1, 2);
            const coordinate3 = new Coordinate(2, 3);
            expect(coordinate1.equals(coordinate2)).toBe(true);
            expect(coordinate1.equals(coordinate3)).toBe(false);
        });
    });
});

describe('MinesMatrix', () => {
    describe('constructor', () => {
        it('should correctly initialize matrix with mines', () => {
            const minesPositions = [new Coordinate(1, 2), new Coordinate(2, 3)];
            const minesMatrix = new MinesMatrix(3, 4, minesPositions);
            expect(minesMatrix.isMine(1, 2)).toBe(true);
            expect(minesMatrix.isMine(2, 3)).toBe(true);
            expect(minesMatrix.isMine(0, 0)).toBe(false);
        });
    });

    describe('coordinates', () => {
        it('should correctly return all cells', () => {
            const minesMatrix = new MinesMatrix(4, 3, []);
            const coordinates = minesMatrix.coordinates();
            expect(coordinates).toHaveLength(12);

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    expect(coordinates).toContainEqual(new Coordinate(i, j));
                }
            }
        });
    });

    describe('isMine', () => {
        it('should correctly identify cells with mines', () => {
            const minesPositions = [new Coordinate(0, 1), new Coordinate(1, 2)];
            const minesMatrix = new MinesMatrix(3, 3, minesPositions);
            expect(minesMatrix.isMine(0, 1)).toBe(true);
            expect(minesMatrix.isMine(1, 2)).toBe(true);
            expect(minesMatrix.isMine(0, 0)).toBe(false);
        });
    });
});

describe('AdjacentMinesMatrix', () => {
    let minesMatrix: MinesMatrix;
    let adjacentMinesMatrix: AdjacentMinesMatrix;

    beforeEach(() => {
        // 0 0 0 
        // 0 x x
        // 0 0 x
        const minesPositions = [new Coordinate(1, 1), new Coordinate(1, 2), new Coordinate(2, 2)];
        minesMatrix = new MinesMatrix(3, 3, minesPositions);
        adjacentMinesMatrix = new AdjacentMinesMatrix(minesMatrix);
    });

    describe('constructor', () => {
        it('should correctly initialize matrix with adjacent mines count', () => {
            expect(adjacentMinesMatrix.count(0, 0)).toBe(1);
            expect(adjacentMinesMatrix.count(1, 0)).toBe(1);
            expect(adjacentMinesMatrix.count(2, 0)).toBe(1);
            expect(adjacentMinesMatrix.count(0, 1)).toBe(2);
            expect(adjacentMinesMatrix.count(1, 1)).toBe(2);
            expect(adjacentMinesMatrix.count(2, 1)).toBe(3);
            expect(adjacentMinesMatrix.count(0, 2)).toBe(2);
            expect(adjacentMinesMatrix.count(1, 2)).toBe(2);
            expect(adjacentMinesMatrix.count(2, 2)).toBe(2);
        });
    });

    describe('increment', () => {
        it('should correctly increment the count of adjacent mines', () => {
            adjacentMinesMatrix['increment'](0, 0);
            expect(adjacentMinesMatrix.count(0, 0)).toBe(2);
        });
    });

    describe('count', () => {
        it('should correctly return the count of adjacent mines', () => {
            expect(adjacentMinesMatrix.count(0, 0)).toBe(1);
        });
    });
});


describe('ConnectedAreaFinder', () => {
    let minesMatrix: MinesMatrix;
    let adjacentMinesMatrix: AdjacentMinesMatrix;
    let connectedAreaFinder: ConnectedAreaFinder;

    beforeEach(() => {
        const minesCoordinates = [new Coordinate(1, 1), new Coordinate(2, 2)];
        minesMatrix = new MinesMatrix(3, 3, minesCoordinates);
        adjacentMinesMatrix = new AdjacentMinesMatrix(minesMatrix);
        connectedAreaFinder = new ConnectedAreaFinder(minesMatrix, adjacentMinesMatrix);
    });

    describe('constructor', () => {
        it('should throw error if matrices have different dimensions', () => {
            const differentMinesMatrix = new MinesMatrix(4, 4, []);
            expect(() => new ConnectedAreaFinder(differentMinesMatrix, adjacentMinesMatrix)).toThrow(Error);
        });
    });

    describe('connectedArea', () => {

        it('should return empty array if origin is a mine cell', () => {
            const origin = new Coordinate(1, 1);
            const minesCoordinates = [origin];
            minesMatrix = new MinesMatrix(3, 3, minesCoordinates);
            adjacentMinesMatrix = new AdjacentMinesMatrix(minesMatrix);
            connectedAreaFinder = new ConnectedAreaFinder(minesMatrix, adjacentMinesMatrix);
            const result = connectedAreaFinder.connectedArea(origin);
            expect(result).toHaveLength(0);
        });

        it('should return empty array if origin is a number cell', () => {
            const minesCoordinates = [new Coordinate(0, 1)];
            minesMatrix = new MinesMatrix(3, 3, minesCoordinates);
            adjacentMinesMatrix = new AdjacentMinesMatrix(minesMatrix);
            connectedAreaFinder = new ConnectedAreaFinder(minesMatrix, adjacentMinesMatrix);
            const result = connectedAreaFinder.connectedArea(new Coordinate(1, 1));
            expect(result).toHaveLength(0);
        });

        it('should return expected empty area if origin is an empty cell', () => {
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
            minesMatrix = new MinesMatrix(5, 6, minesCoordinates);

            // 2 x 3 2 x 1
            // 3 x x 2 1 1
            // 3 x 4 1 0 0
            // 3 x 4 1 1 0
            // 2 x 3 x 1 0
            adjacentMinesMatrix = new AdjacentMinesMatrix(minesMatrix);
            connectedAreaFinder = new ConnectedAreaFinder(minesMatrix, adjacentMinesMatrix);
            const origin = new Coordinate(2, 4);
            // o =>  origin, y => connected area, x => mines, number => number cells to be excluded from the connected area
            // 2 x 3 2 x 1
            // 3 x x y y y
            // 3 x 4 y o y
            // 3 x 4 y y y
            // 2 x 3 x 1 y
            // expecteded to include are the coordinates marked with y (indexing start from 0)
            const expectedToInclude = [
                new Coordinate(1, 3), new Coordinate(1, 4), new Coordinate(1, 5),
                new Coordinate(2, 3), new Coordinate(2, 5),
                new Coordinate(3, 3), new Coordinate(3, 4), new Coordinate(3, 5),
                new Coordinate(4, 5),
            ]
            const numberCellsToExclude = [
                new Coordinate(0, 0), new Coordinate(0, 2), new Coordinate(0, 3), new Coordinate(0, 5),
                new Coordinate(1, 0), 
                new Coordinate(2, 0), new Coordinate(2, 2),
                new Coordinate(3, 0), new Coordinate(3, 2), 
                new Coordinate(4, 0), new Coordinate(4, 2),
            ]
            const expectedToExclude = [origin, ...minesCoordinates, ...numberCellsToExclude];
            const connectedArea = connectedAreaFinder.connectedArea(origin);
            expectedToInclude.forEach((e) => {
                expect(connectedArea).toContainEqual(e)
            });
            expectedToExclude.forEach((e) => {
                expect(connectedArea).not.toContainEqual(e)
            })
        });
    });
});
