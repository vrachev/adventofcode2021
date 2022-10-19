import * as fs from 'fs';


// Part 1
function findLowPoints(input: string) {
    const grid: number[][] = input.split('\n').map(s => s.split('').map(n => parseInt(n)));

    let lowPoints: number[] = [];
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const curr = grid[row][col];
            if (row === 0) {
                if (col === 0) {
                    if (curr < grid[row + 1][col] && curr < grid[row][col + 1]) {
                        lowPoints.push(curr);
                    }
                } else if (col === grid[0].length - 1) {
                    if (curr < grid[row + 1][col] && curr < grid[row][col - 1]) {
                        lowPoints.push(curr);
                    }
                } else {
                    if (curr < grid[row + 1][col] && 
                        curr < grid[row][col - 1] &&
                        curr < grid[row][col + 1]) {
                            lowPoints.push(curr);
                    }
                }
            } else if (col === 0) {
                if (row === grid.length - 1) {
                    if (curr < grid[row - 1][col] && curr < grid[row][col + 1]) {
                        lowPoints.push(curr);
                    }
                } else {
                    if (curr < grid[row + 1][col] && 
                        curr < grid[row - 1][col] &&
                        curr < grid[row][col + 1]) {
                            lowPoints.push(curr);
                    }
                }
            } else if (row === grid.length - 1) {
                if (col === grid[0].length - 1) {
                    if (curr < grid[row - 1][col] && curr < grid[row][col - 1]) {
                        lowPoints.push(curr);
                    }
                } else {
                    if (curr < grid[row - 1][col] && 
                        curr < grid[row][col - 1] &&
                        curr < grid[row][col + 1]) {
                            lowPoints.push(curr);
                    }
                }
            } else if (col === grid[0].length - 1) {
                if (curr < grid[row - 1][col] && 
                    curr < grid[row + 1][col] &&
                    curr < grid[row][col - 1]) {
                        lowPoints.push(curr);
                }
            } else {
                if (curr < grid[row - 1][col] && 
                    curr < grid[row + 1][col] &&
                    curr < grid[row][col - 1] &&
                    curr < grid[row][col + 1]) {
                        lowPoints.push(curr);
                }
            }
        }
    }

    return lowPoints;
}

// Part 2
class Square {
    readonly row: number;
    readonly col: number;
    readonly val: number;
    visited: boolean;
    

    constructor(row: number, col: number, val: number, visited = false) {
        this.row = row;
        this.col = col;
        this.val = val;
        this.visited = visited;
    }
}

class Grid {
    squares: Square[][];

    constructor(input: string) {
        this.squares = input.split('\n').map((row, rowIdx) => row.split('').map((num, colIdx) => {
            const val = parseInt(num);
            if (val === 9) {
                return new Square(rowIdx, colIdx, val, true);
            }
            return new Square(rowIdx, colIdx, val);
        }));
    }

    searchBasins(): number[] {
        let unVisited = this.squares.flat().filter(sq => !sq.visited);
        let basins: number[] = [];
        while (unVisited.length > 0) {
            const curr = unVisited.pop();
            const visited = this.bfs(curr);
            unVisited.filter(sq => visited.includes(sq));
            basins.push(visited.length);
        }
        
        return basins;
    }

    bfs(square: Square): Square[] {
        const getAdjSquares = (row: number, col: number): Square[] => {
            const getSquare = (row, col) => {
                if (row < 0 || col < 0 || row >= this.squares.length || col >= this.squares[0].length) {
                    return;
                } else {
                    const square = this.squares[row][col];
                    if (!square.visited) {
                        square.visited = true;
                        return square;
                    }
                    return;
                }
            }

            const down = getSquare(row + 1, col);
            const up = getSquare(row - 1, col);
            const left = getSquare(row, col - 1);
            const right = getSquare(row, col + 1);

            return [down, up, left, right].filter((sq) => sq); // filter out nonexistent squares
        } 

        let visitedSquares: Square[] = [];
        let unVisitedCurrBasin: Square[] = [square];
        while (unVisitedCurrBasin.length > 0) {
            const curr = unVisitedCurrBasin.shift();
            const neighbors = getAdjSquares(curr.row, curr.col);
            visitedSquares.push(...neighbors);
            unVisitedCurrBasin.push(...neighbors);
        }

        return visitedSquares;
    }

    topThreeBasins(): number {
        const basins = this.searchBasins();
        return basins.sort((a, b) => b - a).slice(0, 3).reduce((sum, curr) => sum * curr, 1);
    }
}

function lowPointSum(input: string): number {
    return findLowPoints(input).reduce((sum, n) => sum + n + 1, 0);
}

function calcBasins(input: string): number {
    const grid = new Grid(input);
    return grid.topThreeBasins();
}


const input = fs.readFileSync('../input/day9.txt', {encoding: 'utf-8'});
const inputTest = fs.readFileSync('../input/day9test.txt', {encoding: 'utf-8'});
console.log(lowPointSum(inputTest));
console.log(lowPointSum(input));
console.log(calcBasins(inputTest));
console.log(calcBasins(input));
