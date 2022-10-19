import * as fs from 'fs';


/**
 * Lets thing about the data structure:
 * we can keep count of N fish who have Y days left. 
 * 
 * Days decrement by 1, unless day = 0 in which case change to 6 and spawns a new fish with 8. 
 * 
 * We can just use an array(8) I think, and every day change array[i] = array[i+1], with special rules for 0.
 * ^ need Array(9) since 0 is a valid day (i.e. 9 days total, with 0 being one of the days)
 */

type Fish = number;

function genStartingFish(input: string): Fish[] {
    const startingFish = input.split(',').map((n) => parseInt(n));
    let fishCount: Fish[] = Array(9).fill(0);
    for (let fish of startingFish) {
        fishCount[fish]++;
    } 

    return fishCount;
}

function calcFishGrowth(input: string, days: number): number {
    let fishCount = genStartingFish(input);

    for (let _ = 0; _ < days; _++) {
        fishCount = fishCount.map((fish, idx, currCount) => {
            if (idx === 6) {
                return currCount[0] + currCount[7];
            } else if (idx === 8) {
                return currCount[0];
            } else {
                return currCount[idx + 1];
            }
        })
    }

    return fishCount.reduce((prev, count) => prev + count);
}


const input = fs.readFileSync('../input/day6.txt', {encoding: 'utf-8'});
console.log(calcFishGrowth(input, 9000));
