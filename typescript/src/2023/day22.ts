import getInput from "./util/getInput";
import parseInt from "../util/parseInt";
import {accumulator} from "../util/accumulator";

const testInputs = {
    example: `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`
}

const input = getInput(testInputs, 22);

type Point3D = {
    x: number,
    y: number,
    z: number,
};

type Cube = {
    start: Point3D,
    end: Point3D,
    supports: number[],
    isSupportedBy: number[],
}

function strToPoint(input: string): Point3D {
    const [x,y,z] = input.split(',').map(val => parseInt(val));

    return {x,y,z}
}

const bricks: Cube[] = input.split('\n')
    .map(
        row => {
        const [startStr, endStr] = row.split('~');

        return {
            start: strToPoint(startStr),
            end: strToPoint(endStr),
            supports: [],
            isSupportedBy: [],
        }
    }
    );

function bricksOverlap(a: Cube, b: Cube): boolean {
    return Math.max(a.start.x, b.start.x) <= Math.min(a.end.x, b.end.x)
    &&  Math.max(a.start.y, b.start.y) <= Math.min(a.end.y, b.end.y)
}

bricks.sort((a, b) => {
    return a.start.z - b.start.z
})

bricks.forEach((brick, index) => {
    const maxes = [
        1,
        ...bricks.slice(0, index).map(checkBrick => bricksOverlap(brick, checkBrick) ? checkBrick.end.z + 1 : 0)
    ];

    const max = Math.max(...maxes);

    brick.end.z -= brick.start.z - max;
    brick.start.z = max;
})
bricks.sort((a, b) => {
    return a.start.z - b.start.z
});

bricks.forEach((lowerBrick, index) => {
    for(let i= index+1; i < bricks.length; i++) {
        const upperBrick = bricks[i];

        if (bricksOverlap(lowerBrick, upperBrick) && upperBrick.start.z == lowerBrick.end.z + 1) {
            lowerBrick.supports.push(i);
            upperBrick.isSupportedBy.push(index)
        }
    }
});

const supportedBricks: number[] = bricks.map(({supports}, index) => {
    const bricksThatFall: Set<number> = new Set([index]);

    const supportsToCheck = [...supports.filter(toCheck => {
        const brickToCheck = bricks[toCheck];

        return brickToCheck.isSupportedBy.length == 1;
    })];

    let toCheck;

    while (toCheck = supportsToCheck.shift()) {
        if (bricksThatFall.has(toCheck)) {
            continue;
        }

        const brickToCheck = bricks[toCheck];

        if (brickToCheck.isSupportedBy.every(val => bricksThatFall.has(val))) {
            bricksThatFall.add(toCheck);

            brickToCheck.supports.forEach((val) => {
                if (!bricksThatFall.has(val)) {
                    supportsToCheck.push(val);
                }
            })

        }
    }

    return bricksThatFall.size - 1;
});

console.log(`Part 1: ${supportedBricks.filter(val => val == 0).length}`);
console.log(`Part 2: ${accumulator(supportedBricks)}`);
