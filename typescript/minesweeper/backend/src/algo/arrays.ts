import { Coordinate } from "./matrices";

export function generateRandNumbers(range: Range, length: number): number[] {
    const numbersInOrder = range.toArray();
    return shuffle(numbersInOrder).slice(0, length);
}

export class Range {
    constructor(public start: number = 0, public end: number) {}

    toArray(): number[] {
        const array = Array.from({length: this.end - this.start}, (_, i) => this.start + i);
        return array
    }
}

function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
