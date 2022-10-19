import * as fs from 'fs';

/**
 * Part 1: Calculate number of flashes in N steps.
 * Part 2: Calculate number of steps until all octopuses flash.
 */

class Bulb {
    constructor(public val: number, public flashed: boolean) {}
}

type EndCondition = 'Steps' | 'AllFlashed';
class OctopusGrid {
    grid: Bulb[][];
    stepCounter: number;
    allFlashed: boolean;

    constructor(input: string) {
        this.grid = input.split('\n').map(line => line.split('').map(ch => new Bulb(parseInt(ch), false)));
        this.stepCounter = 0;
        this.allFlashed = false;
    }

    iterateGrid(fun: (row: number, col: number) => void) {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                fun(row, col);
            }
        }
    }

    incBulbs(row: number, col: number) {
        const rows = [row, row + 1, row - 1];
        const cols = [col, col + 1, col - 1];
        for (const i of rows) {
            for (const j of cols) {
                if ((0 <= i) && (i < this.grid.length)) {
                    if ((0 <= j) && (j < this.grid[0].length)) {
                        if (row != i || col !== j) this.grid[i][j].val++;
                    }
                }
            }
        }
    
        this.grid[row][col].flashed = true;
    }
    
    processFlashes(): number {
        let litBulbs = 0;
        let allFlashed = true;
        this.iterateGrid((row, col) => {
            const bulb = this.grid[row][col];
            bulb.flashed = false;
            if (bulb.val > 9) {
                bulb.val = 0;
                litBulbs++;
            } else {
                allFlashed = false;
            }
        });

        this.stepCounter++;
        this.allFlashed = allFlashed;
    
        return litBulbs;
    }
    processGrid(): void {
        // increment all, and handle first wave of flashes.
        this.iterateGrid((row, col) => {
            const bulb = this.grid[row][col];
            if (bulb.val < 10) {
                bulb.val++;
            } else {
                this.incBulbs(row, col);
            }        
        });
    
        // Handle remaining waves of flashes.
        // Stop when all flashing bulbs have been processed.
        let flashed = true;
        while (flashed) {
            flashed = false;
            this.iterateGrid((row, col) => {
                const bulb = this.grid[row][col];
                if (!bulb.flashed && bulb.val > 9) {
                    this.incBulbs(row, col);
                    flashed = true;
                }
            });
        }
    }
    runSteps(cont: () => boolean): number {
        let total = 0;
        while (cont()) {
            this.processGrid();
            total += this.processFlashes();
        }

        return total;
    }

    run(endCondition: EndCondition, steps?: number): number {
        switch (endCondition) {
            case 'Steps':
                if (!steps) throw new TypeError("Need to provide number of steps to run " + steps);
                return this.runSteps(() => this.stepCounter < steps);
            case 'AllFlashed':
                this.runSteps(() => !this.allFlashed);
                return this.stepCounter;
        }
    }
}

function calcFlashes(input: string, endCondition: EndCondition, steps?: number): number {
    const grid = new OctopusGrid(input);
    return grid.run(endCondition, steps);
}



const input = fs.readFileSync('../input/day11.txt', {encoding: 'utf-8'});
const inputTest = fs.readFileSync('../input/day11test.txt', {encoding: 'utf-8'});

console.log(`Calculated ${calcFlashes(inputTest, 'Steps', 100)} flashes for ${100} Steps`);
console.log(`Calculated ${calcFlashes(inputTest, 'AllFlashed')} steps for all to flash`);

console.log(`Calculated ${calcFlashes(input, 'Steps', 100)} flashes for ${100} Steps`);
console.log(`Calculated ${calcFlashes(input, 'AllFlashed')} steps for all to flash`);
