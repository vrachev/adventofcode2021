import * as fs from 'fs';


class Point {
    constructor(
        public x: number,
        public y: number,
    ) {}
}

class PointVector {
    constructor(
        public point1: Point,
        public point2: Point,
    ) {}

    getAllPoints(diagFlag: boolean): Point[] {
        let points = []
        if (this.point1.x === this.point2.x) {
            let x = this.point1.x;
            let startY = Math.min(this.point1.y, this.point2.y);
            let endY = Math.max(this.point1.y, this.point2.y);
            for (let y = startY; y <= endY; y++) {
                points.push(new Point(x, y));
            }
        } else if (this.point1.y === this.point2.y) {
            let y = this.point1.y;
            let startX = Math.min(this.point1.x, this.point2.x);
            let endX = Math.max(this.point1.x, this.point2.x);
            for (let x = startX; x <= endX; x++) {
                points.push(new Point(x, y));
            }
        } else if (diagFlag) {
            let higherDiagPoint: Point;
            let lowerDiagPoint: Point;
            if (this.point1.y > this.point2.y) {
                higherDiagPoint = this.point2;
                lowerDiagPoint = this.point1;
            } else {
                higherDiagPoint= this.point1;
                lowerDiagPoint = this.point2;
            }

            if (lowerDiagPoint.x < higherDiagPoint.x) {
                if (higherDiagPoint.x - lowerDiagPoint.x === lowerDiagPoint.y - higherDiagPoint.y) {
                    for (let idx = 0; idx <= (higherDiagPoint.x - lowerDiagPoint.x); idx++) {
                        points.push(new Point(lowerDiagPoint.x + idx, lowerDiagPoint.y - idx));
                    }
                }
            } else {
                if (lowerDiagPoint.x - higherDiagPoint.x === lowerDiagPoint.y - higherDiagPoint.y) {
                    for (let idx = 0; idx <= (lowerDiagPoint.x - higherDiagPoint.x); idx++) {
                        points.push(new Point(higherDiagPoint.x + idx, higherDiagPoint.y + idx));
                    } 
                }
            }
        }

        return points;
    }
}

class Grid {
    points: number[][];

    constructor(x: number, y: number) {
        if (x <= 0 || y <= 0) {
            throw new TypeError('Must specify bounds > 0 - x: ' + x + ' y: ' + y);
        }
        this.points = Array();
        for (let idx = 0; idx < y; idx++) {
            this.points.push(Array(x).fill(0));
        }
    }

    incPoint(x: number, y: number): void {
        if (x >= this.points[0].length || y >= this.points.length) {
            throw new TypeError('out of range ' + x + ' - ' + this.points[0].length);
        } 
        this.points[x][y]++;
    }

    handlePoints(vector: PointVector, diagFlag = true) {
        for (const point of vector.getAllPoints(diagFlag)) {
            this.incPoint(point.x, point.y);
        }
    }

    handlePointsVectors(vectors: PointVector[], diagFlag) {
        for (const v of vectors) {
            this.handlePoints(v, diagFlag);
        }
    }

    moreThanTwoHits(): number {
        let count = 0;
        for (const col of this.points) {
            for (const pointVal of col) {
                if (pointVal > 1) count++;
            }
        }

        return count;
    }
 }

function generatePointVectors(inputStr: string): [PointVector[], number, number] {
    const inputArr = inputStr.split('\n');
    let pointVectors = []
    let maxX = 0;
    let maxY = 0;
    for (const vectorStr of inputArr) {
        const [point1, point2] = vectorStr.split(' -> ').map((pointStr) => {
            const [xStr, yStr] = pointStr.split(',');
            const x = parseInt(xStr);
            const y = parseInt(yStr);
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            return new Point(parseInt(xStr), parseInt(yStr));
        });
        pointVectors.push(new PointVector(point1, point2));
    }

    return [pointVectors, maxX, maxY];
}

function calculateHits(inputStr: string, diagFlag = false): number {
    const [vectors, maxX, maxY] = generatePointVectors(inputStr);
    const grid = new Grid(maxX + 1, maxY + 1);
    grid.handlePointsVectors(vectors, diagFlag);
    return grid.moreThanTwoHits();
}




const input = fs.readFileSync('../input/day5.txt', {encoding: 'utf-8'});
console.log(calculateHits(input)); // part 1 answer
console.log(calculateHits(input, true)); // part 2 answer
