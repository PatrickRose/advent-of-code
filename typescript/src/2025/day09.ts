import getInput from "./util/getInput";
import {getPoint, Point, PointMap, setPoint} from "../util/points";

const testInputs = {
    example: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`
}

const input = getInput(testInputs, 9);

const redTiles: Point[] = input.split('\n').map(row => {
    const [x, y] = row.split(',').map(val => Number.parseInt(val, 10));

    return {x, y}
});

const pairs: [Point, Point][] = [];

for (let i = 0; i < redTiles.length; i++) {
    for (let j = i + 1; j < redTiles.length; j++) {
        const first = redTiles[i];
        const second = redTiles[j];

        pairs.push([first, second]);
    }
}

function calculateSize(first: Point, second: Point): number {
    const xDiff = Math.max(first.x, second.x) - Math.min(first.x, second.x) + 1;
    const yDiff = Math.max(first.y, second.y) - Math.min(first.y, second.y) + 1;

    return xDiff * yDiff;
}

pairs.sort((a, b) => {
    return calculateSize(...b) - calculateSize(...a);
})

const max = calculateSize(...pairs[0]);

console.log(`Part 1: ${max}`);

const tiles: PointMap<true> = new Map;
const edges: [Point, Point][] = redTiles.map((first, i) => {
    const second = redTiles[(i + 1) % redTiles.length];

    return [first, second];
});

edges.forEach(([first, second]) => {
    for (let y = Math.min(first.y, second.y); y <= Math.max(first.y, second.y); y++) {
        for (let x = Math.min(first.x, second.x); x <= Math.max(first.x, second.x); x++) {
            setPoint({x, y}, true, tiles);
        }
    }
})

function isInsideShape(point: Point): boolean {
    if (getPoint(point, tiles)) {
        return true;
    }

    let x = point.x;
    const y = point.y;
    let horizontalEdges = 0;


    while (x > 0) {
        if (getPoint({x, y}, tiles)) {
            horizontalEdges++;
            while (getPoint({x, y}, tiles)) {
                x--;
            }
        } else {
            x--;
        }
    }

    return horizontalEdges % 2 == 1;
}

function rectangleIsInShape(first: Point, second: Point): boolean {
    // Fast check
    const minX = Math.min(first.x, second.x);
    const maxX = Math.max(first.x, second.x);
    const minY = Math.min(first.y, second.y);
    const maxY = Math.max(first.y, second.y);

    for (let x of [minX, maxX]) {
        for (let y of [minY, maxY]) {
            if (!isInsideShape({x, y})) {
                return false;
            }
        }
    }

    // Check if there's an intersection of the edges
    // If so, then it's false
    if (edges.some(([edge1, edge2]) => {
        const edgeMinX = Math.min(edge1.x, edge2.x);
        const edgeMaxX = Math.max(edge1.x, edge2.x);
        const edgeMinY = Math.min(edge1.y, edge2.y);
        const edgeMaxY = Math.max(edge1.y, edge2.y);

        return edgeMinX < maxX
            && minX < edgeMaxX
            && edgeMinY < maxY
            && minY < edgeMaxY;
    })) {
        return false
    }

    return true;
}

let part2: number | null = null;

for (const [first, second] of pairs) {
    if (rectangleIsInShape(first, second)) {
        part2 = calculateSize(first, second);
        break;
    }
}

if (part2 === null) {
    throw new Error('No pairs were inside the shape');
}

console.log(`Part 2: ${part2}`);
