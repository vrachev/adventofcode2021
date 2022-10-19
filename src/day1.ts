import * as fs from 'fs';

const inputRaw = fs.readFileSync('../input/day1.txt', {encoding: 'utf8', flag: 'r'});
const inputArr = inputRaw.split('\n').map((n) => parseInt(n));

// part 1
let numIncs = 0;
let prev = inputArr[0];
for (let i = 1; i < inputArr.length; i++) {
    let curr = inputArr[i];
    if (curr > prev) {
        numIncs++;
    }
    prev = curr;
}

console.log(numIncs);

// part 2

let numWindowIncs = 0;
let first = inputArr[0];
for (let i = 3; i < inputArr.length; i++) {
    let curr = inputArr[i];
    if (curr > first) {
        numWindowIncs++;
    }
    
    first = inputArr[i-2];
}

console.log(numWindowIncs);
