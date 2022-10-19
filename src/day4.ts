import * as fs from 'fs';

class Square {
    readonly val: number;
    readonly row: number;
    readonly col: number;
    private _isMarked: boolean;

    constructor(val: number, row: number, col: number) {
        this.val = val;
        this.row = row;
        this.col = col;
        this._isMarked = false;
    }

    get isMarked() {
        return this._isMarked;
    }
    set isMarked(m: boolean) {
        this._isMarked = m;
    }
}


type BingoVectortype = 'row' | 'col' | 'diag';
type BingoVectorKey = number | 'topleft' | 'topright';

class BingoVector {
    type: BingoVectortype;
    data: Map<BingoVectorKey, number>;

    constructor(type: BingoVectortype) {
        this.type = type;
        this.data = new Map<number, number>();
        if (this.type === 'diag') {
            this.data.set('topleft', 0);
            this.data.set('topright', 0);
        } else {
            for (let idx = 0; idx < 5; idx++) {
                this.data.set(idx, 0);
            }
        }
    }

    inc(idx: BingoVectorKey): number {
        const incVal = this.data.get(idx) + 1;
        this.data.set(idx, incVal);
        return incVal;
    }
}

class Board {
    gridMap: Map<number, Square>; // holds all board values
    unmarkedMap: Map<number, Square>; // holds all unmarked values

    rowsData: BingoVector; // holds row completion data
    colData: BingoVector; // holds col completion data
    diagData: BingoVector; // holds diag completion data

    constructor(grid: number[][]) {
        this.gridMap = new Map();
        this.unmarkedMap = new Map();
        this.rowsData = new BingoVector('row');
        this.colData = new BingoVector('col');
        this.diagData = new BingoVector('diag');

        for (let [rowIdx, row] of grid.entries()) {
            for (let [colIdx, val] of row.entries()) {
                const sq = new Square(val, rowIdx, colIdx);
                this.gridMap.set(val, sq);
                this.unmarkedMap.set(val, sq);
            }
        }
    }

    play(val: number): boolean {
        if (this.gridMap.has(val)) {
            const sq = this.gridMap.get(val);
            sq.isMarked = true;
            this.unmarkedMap.delete(val);

            const rowVal = this.rowsData.inc(sq.row);
            const colVal = this.colData.inc(sq.col);
            let topLeftVal = 0;
            let topRightVal = 0;
            if (sq.row === sq.col) {
                topLeftVal = this.diagData.inc('topleft');
            } 
            if ((sq.row + sq.col) === 4) {
                topRightVal = this.diagData.inc('topright');
            }

            // turns out I can't read and we only care about row/col wins and can ignore diagonals
            // return (Math.max(rowVal, colVal, topLeftVal, topRightVal) === 5);
            return (Math.max(rowVal, colVal) === 5);
        }

        return false;
    }
}

class Bingo {
    boards: Board[];

    constructor(boards: Board[]) {
        this.boards = boards;
    }

    play(vals: number[], winCriteria: WinCriteria): number {
        let i = 0;
        for (const val of vals) {

            const [won, res, winningBoards] = this.playMove(val);
            if (won) {
                if (winCriteria === 'first' || this.boards.length === 1) return res;
                if (winCriteria === 'last') {
                    for (let board of winningBoards) {
                        let idx = this.boards.indexOf(board);
                        this.boards.splice(idx, 1);
                    }
                }
            }
        }
    }

    playMove(val): [boolean, number, Board[]|null] {
        let won = false;
        let winningBoards: Board[] = [];
        for (let b of this.boards) {
            const res = b.play(val);
            if (res) {
                won = true;
                winningBoards.push(b);
            }
        }
        if (!won) {
            return [false, -1, null];
        }
        if (won && winningBoards.length === 1) {
            const unmarkedArr = Array.from(winningBoards[0].unmarkedMap.values());
            let unmarkedSum = 0;
            for (const sq of unmarkedArr) {
                unmarkedSum += sq.val;
            }

            return [true, unmarkedSum * val, winningBoards];
        } 
        
        return [true, -1, winningBoards];
    }
}

type WinCriteria = 'first' | 'last';
function playBingo(input: string, winCriteria: WinCriteria): number {
    const inputArr = input.split('\n\n');
    const moves = inputArr[0].split(',').map((n) => parseInt(n));
    const boards = createBoards(inputArr.slice(1));

    const bingo = new Bingo(boards);
    return bingo.play(moves, winCriteria);
}

function createBoards(inputArr: string[]): Board[] {
    let boards: Board[] = [];
    for (let boardString of inputArr) {
        const rowStrings = boardString.split('\n');
        let gridBuilder: number[][] = [];
        for (let rowString of rowStrings) {
            rowString = rowString.trim().replaceAll('  ', ' ');
            const row = rowString.split(' ').map((n) => parseInt(n));
            gridBuilder.push(row);
        }

        boards.push(new Board(gridBuilder));
    }

    return boards;
}


const testInput = fs.readFileSync('../input/day4test.txt', {encoding: 'utf-8'});
const input = fs.readFileSync('../input/day4.txt', {encoding: 'utf-8'});
// console.log(playBingo(testInput));
console.log(playBingo(input, 'first'));
console.log(playBingo(input, 'last'));
