import * as fs from 'fs';
// Part 1


const CORRUPTED_CHAR_COST = new Map([[')', 3], [']', 57], ['}', 1197], ['>', 25137]]);
const INCOMPLETE_CHAR_COST = new Map([['(', 1], ['[', 2], ['{', 3], ['<', 4]]);
const CHAR_MAP = new Map([['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']]);
type StartChar = '(' | '[' | '{' | '<';
type EndChar = ')' | ']' | '}' | '>';

function processLine(line: string): [number, number] {
    let stack = [];
    // check for corrupted lines
    for (const ch of line) {
        if (['(', '[', '{', '<'].includes(ch)) {
            stack.push(ch);
        } else {
            if (CHAR_MAP.get(stack.pop()) !== ch) {
                return [CORRUPTED_CHAR_COST.get(ch), 0];
            }
        }
    }

    let completionSum = 0;
    // only incomplete lines left
    while (stack.length > 0) {
        const toComplete = stack.pop();
        completionSum *= 5;
        completionSum += INCOMPLETE_CHAR_COST.get(toComplete);
    }

    return [0, completionSum];
}

function checkAllLines(input: string, corrupted: boolean): number {
    const inputArr = input.split('\n');
    let corruptedSum = 0;
    let incompleteSums: number[] = [];
    for (const line of inputArr) {
        const processedLine = processLine(line);
        corruptedSum += processedLine[0];
        if (processedLine[1] > 0) {
            incompleteSums.push(processedLine[1]);
        }
    }

    if (corrupted) {
        return corruptedSum;
    }

    incompleteSums.sort((a, b) => a - b);
    console.log((incompleteSums.length - 1) / 2);
    return incompleteSums[(incompleteSums.length - 1) / 2];
}




const input = fs.readFileSync('../input/day10.txt', {encoding: 'utf-8'});
const inputTest = fs.readFileSync('../input/day10test.txt', {encoding: 'utf-8'});
console.log('Sum of corrupted characters', checkAllLines(inputTest, true));
console.log('Sum of corrupted characters', checkAllLines(input, true));
console.log('Answer for incomplete line', checkAllLines(inputTest, false));
console.log('Answer for incomplete line', checkAllLines(input, false));
