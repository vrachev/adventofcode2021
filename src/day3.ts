import * as fs from 'fs';

// part 1
function powerConsumption(inputArr: string[]): number {
    let bitCounts: number[] = Array(inputArr[0].length).fill(0);
    for (let bin of inputArr) {
        for (let idx = 0; idx < bin.length; idx++) {
            if (bin.charAt(idx) === '1') bitCounts[idx]++;
        }
    }


    const gammaArr = bitCounts.map((n) => n > inputArr.length/2 ? 1 : 0);
    const epsilonArr = bitCounts.map((n) => n > inputArr.length/2 ? 0: 1);

    const gamma = parseInt(gammaArr.join(''), 2);
    const epsilon = parseInt(epsilonArr.join(''), 2);
    return gamma * epsilon;
}

// part 2

type Rating = 'gen' | 'scrub';

function calcRating(inputArr: string[]) {
    const oxyGenRating = oxygenRating(inputArr, 0, 'gen');
    const oxyScrubRating = oxygenRating(inputArr, 0, 'scrub');

    return oxyGenRating * oxyScrubRating;
}

function oxygenRating(inputArr: string[], idx = 0, rating: Rating): number {
    if (inputArr.length === 0) {
        throw new EvalError('Failed to compute value');
    }
    if (inputArr.length === 1) {
        return parseInt(inputArr[0], 2);
    }
    
    let bit0Arr: string[] = [];
    let bit1Arr: string[] = [];

    for (let s of inputArr) {
        if (s.charAt(idx) === '0') {
            bit0Arr.push(s);
        } else {
            bit1Arr.push(s);
        }
    }

    idx++;

    if (rating === 'gen') {
        const mostFreqArr = (bit1Arr.length >= bit0Arr.length) ? bit1Arr : bit0Arr;
        return oxygenRating(mostFreqArr, idx, rating);
    } else {
        const mostFreqArr = (bit1Arr.length < bit0Arr.length) ? bit1Arr : bit0Arr;
        return oxygenRating(mostFreqArr, idx, rating);
    }
}

const inputArr = fs.readFileSync('../input/day3.txt', {encoding: 'utf-8'}).split('\n');

console.log(powerConsumption(inputArr));

console.log(calcRating(['00100', '11110','10110','10111','10101','01111','00111','11100','10000','11001','00010','01010']));
console.log(calcRating(inputArr));
