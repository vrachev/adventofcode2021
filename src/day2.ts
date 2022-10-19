import * as fs from 'fs';

// part 1
function calculateCourse(inputArr: string[]): void { 
    let horiz = 0;
    let depth = 0;

    for (let comm of inputArr) {
        const [dir, change] = comm.split(' ');
        let fun: (n: number) => void;
        switch (dir) {
            case 'forward':
                fun = (n) => horiz += n;
                break;
            case 'down':
                fun = (n) => depth += n;
                break;
            case 'up':
                fun = (n) => depth -= n;
                break;
            default:
                throw new TypeError(`Bad input: ${dir}`);
        }

        fun(parseInt(change));
    }

    console.log('horiz ' + horiz, 'depth ' + depth, 'mult ' + horiz * depth);
}

// part 2

function calculateNewCourse(inputArr: string[]): void {
    let horiz = 0;
    let depth = 0;
    let aim = 0;

    for (let comm of inputArr) {
        const [dir, change] = comm.split(' ');
        let fun: (n: number) => void;
        switch (dir) {
            case 'forward':
                fun = (n) => {
                    horiz += n;
                    depth += aim * n;
                }
                break;
            case 'down':
                fun = (n) => aim += n;
                break;
            case 'up':
                fun = (n) => aim -= n;
                break;
            default:
                new TypeError(`Bad input: ${dir}`);
        }

        fun(parseInt(change));
    }

    console.log('aim ' + aim, 'horiz ' + horiz, 'depth ' + depth, 'mult ' + horiz * depth);
}

const realInput = fs.readFileSync('../input/day2.txt', {'encoding': 'utf-8'}).split('\n');
// part 1
calculateCourse(["forward 8", "down 4", "up 3", "forward 9", "down 9"]); // quick test: should be 17, 10 and 170
calculateCourse(realInput);
//part 2
calculateNewCourse(["forward 5", "down 5", "forward 8", "up 3", "down 8", "forward 2"]);
calculateNewCourse(realInput);
