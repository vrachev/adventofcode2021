import * as fs from 'fs';

function median(sorted: number[]): number {
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function mean(sorted: number[]): number {
    const total = sorted.reduce((total, curr) => total + curr);
    console.log(total / sorted.length);
    return Math.floor(total / sorted.length);
}

function shortestSum(input: string, expn: boolean): number {
    const inputArr = input.split(',').map((n) => parseInt(n));
    const sorted = inputArr.sort((a, b) => a < b ? -1: 1);

    let bestPos: number;
    let total = 0;
    if (!expn) {
        bestPos = median(sorted);
        for (let n of sorted) {
            total +=  Math.abs(bestPos - n);
        }
    } else {
        bestPos = mean(sorted);
        for (let n of sorted) {
            let coordChange = Math.abs(bestPos - n);
            let fuelCost = coordChange * (coordChange + 1)/2;
            total += fuelCost;
        }
    }
    

    return total;
}

const input = fs.readFileSync('../input/day7.txt', {encoding: 'utf-8'});
console.log(shortestSum(input, false));
console.log(shortestSum(input, true));
