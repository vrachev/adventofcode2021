import * as fs from 'fs';

/**
 * Real display:
 *   aa
 * bb  cc
 *   dd
 * ee  ff
 *   gg
 * 
 * 
 * 0 - abcefg
 * 1 - cf
 * 2 - acdeg
 * 3 - acdfg
 * 4 - bcdf
 * 5 - abdfg
 * 6 - abdefg
 * 7 - acf
 * 8 - abcdefg
 * 9 - abcdfg
 * 
 * 
 * unique words:
 * 1 - 2 letters - cf -> cf
 * 4 - 4 letters - bcdf -> bd
 * 7 - 3 letters - acf -> a
 * after this we know a, b, c, d, f 
 * There's three 5 letter words, acdeg, acdfg, abdfg. In the latter two only 'g' is unkown to us, so we can deduce it. 
 * In the former, 'eg' are unknown. Once we know 'g', we can deduce 'e'.
 * 
 * Now we know 'a', 'g', 'e', and have answer sets for 'b', 'c', 'd', 'f'.
 * 
 * Next, we can figure out 'c' and 'd' by looking for '2'. We know aeg, and we know c and d have different answer sets.
 * We also know that '2' is the only 5 letter word with aeg. So we look for the 5 letter word with aeg, and then
 * we know cd by matching with the value in the answer set. 
 * 
 * Now we know 'a', 'c', 'd', 'g', 'e'. We can figure out 'b' and 'f' easily by looking at the unused answer in 
 * f's answer set. Then b is the unused letter.
 */


type LetterMapping = Map<string, Set<string>>;
/**
 * Approach I'm thinking of is to map every mixed up letter to an array of potential real letters
 */
function decode(input: string) {
    const [signals, output] = input.split('|').map((s) => s.trim().split(' '));

    let lMap: LetterMapping = new Map();
    let determinedMap: Map<string, string> = new Map();
    for (const c of 'abcdefg') {
        lMap.set(c, new Set());
    }

    for (const word of signals) {
        // get '1'
        if (word.length === 2) {
            addToMap(lMap, 'c', word);
            addToMap(lMap, 'f', word);

        }
    }
    for (const word of signals) {
        // get '7'
        if (word.length === 3) {
            const a = [...word].filter((c) => (!lMap.get('c').has(c)))
            determinedMap.set('a', a.join(''));
            addToMap(lMap, 'a', a);
        }
    }
    let bd = [];
    for (const word of signals) {
        // get '4'
        if (word.length === 4) {
            bd = [...word].filter((c) => (!lMap.get('c').has(c)));

        }
    }
    // console.log(bd);
    addToMap(lMap, 'b', bd);
    addToMap(lMap, 'd', bd);
    // 5 length word. There's three 5 letter words, acdeg, acdfg, abdfg. In the latter two only 'g' is unkown to us, so we can deduce it. 
    // In the former, 'eg' are unknown. Once we know 'g', we can deduce 'e'.
    const knownLetters = Array.from(lMap.values()).reduce((cum, curr) => new Set([...cum, ...curr]));
    let g = [];
    let eg = [];
    for (const word of signals) {
        if (word.length === 5) {
            const unkownLetters = [...word].filter((c) => (!knownLetters.has(c)));
            // console.log('unknown', unkownLetters);
            if (unkownLetters.length === 1) {
                g = unkownLetters;
            } else {
                eg = unkownLetters;
            }
        }
    }

    const e = eg.filter((l) => !g.includes(l));
    determinedMap.set('g', g.toString());
    determinedMap.set('e', e.toString());
    addToMap(lMap, 'g', g);
    addToMap(lMap, 'e', e);

    const aeg = new Set(determinedMap.values());
    let cd = [];
    for (const word of signals) {
        if (word.length === 5 && new Set([...word, ...aeg]).size === 5) {
            cd = [...word].filter((c) => (!aeg.has(c)));
            // console.log('cd', cd, 'aeg', aeg);
        }
    }
    const c = cd.filter((c) => lMap.get('c').has(c));
    const d = cd.filter((c) => lMap.get('d').has(c));
    determinedMap.set('c', c.toString());
    determinedMap.set('d', d.toString());
    addToMap(lMap, 'c', c);
    addToMap(lMap, 'd', d);

    const f = Array.from(lMap.get('f')).filter((ch) => !c.includes(ch));
    determinedMap.set('f', f.toString());
    const b = Array.from(lMap.get('b')).filter((ch) => !d.includes(ch));
    determinedMap.set('b', b.toString());
    // console.log('f', f);

    // console.log(determinedMap);
    // console.log(signals);
    // console.log(lMap);

    return calculateNums(output, determinedMap);
}

const sortString = (str) => {
    return [...str].sort((a, b) => a.localeCompare(b)).join("");
  }

function calculateNums(output: string[], determinedMap: Map<string, string>) {

    const a = determinedMap.get('a');
    const b = determinedMap.get('b');
    const c = determinedMap.get('c');
    const d = determinedMap.get('d');
    const e = determinedMap.get('e');
    const f = determinedMap.get('f');
    const g = determinedMap.get('g');
   
    let numberCodes: string[] = [];
    numberCodes.push(sortString(a + b + c + e + f + g));
    numberCodes.push(sortString(c + f));
    numberCodes.push(sortString(a + c + d + e + g));
    numberCodes.push(sortString(a + c + d + f + g));
    numberCodes.push(sortString(b + c + d + f));
    numberCodes.push(sortString(a + b + d + f + g));
    numberCodes.push(sortString(a + b + d + e + f + g));
    numberCodes.push(sortString(a + c + f));
    numberCodes.push(sortString(a + b + c + d + e + f + g));
    numberCodes.push(sortString(a + b + c + d + f + g));

    // console.log(numberCodes);
    let finalNum: number[] = [];
    for (const word of output) {
        // console.log(word, numberCodes.indexOf(sortString(word)));
        finalNum.push(numberCodes.indexOf(sortString(word)));
    }

    // console.log(finalNum.join(''));
    return parseInt(finalNum.join(''));
}

function countUniqueSegments(input: string): number {
    const [_, output] = input.split('|').map((s) => s.trim().split(' '));
    let uniqueSegments = 0;
    const uniqueLengths = [2, 3, 4, 7];
    for (const word of output) {
        if (uniqueLengths.includes(word.length)) {
            uniqueSegments++;
        }
    }

    return uniqueSegments;
}

function addToMap(lMap: LetterMapping, letter: string, word: string | string[]) {
    for (const c of word) {
        lMap.get(letter).add(c);
    }
}

function decodeAll(input: string, uniqueSegments: boolean): number {
    const inputArr = input.split('\n');
    let num = 0;
    for (const arr of inputArr) {
        if (uniqueSegments) {
            num += countUniqueSegments(arr);
        } else {
            num += decode(arr);
        }
    }

    
    decode(inputArr[0]);
    return num;
}



const input = fs.readFileSync('../input/day8.txt', {encoding: 'utf-8'});
const testInput = fs.readFileSync('../input/day8test.txt', {encoding: 'utf-8'});
// console.log(decodeAll(testInput, true));
// console.log(decodeAll(testInput, false));
console.log(decodeAll(input, false));