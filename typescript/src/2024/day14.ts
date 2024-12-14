import getInput from "./util/getInput";
import {getAdjacentPoints, getPoint, Point, PointMap, pointToPointString, setPoint} from "../util/points";
import * as readline from "node:readline/promises";
import * as fs from "node:fs";

const testInputs = {
    example: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`
}

const input = getInput(testInputs, 14);

type Robot = {
    position: Point,
    velocity: Point
}

const robots: Robot[] = input.split('\n').map((row) => {
    const [position, velocity] = row.split(' ');
    const posMatch = position.match(/p=(-?\d+),(-?\d+)/);
    const velMatch = velocity.match(/v=(-?\d+),(-?\d+)/);

    if (!posMatch) {
        throw new Error(position);
    }

    if (!velMatch) {
        throw new Error(velocity);
    }

    return {
        position: {
            x: Number.parseInt(posMatch[1], 10),
            y: Number.parseInt(posMatch[2], 10),
        },
        velocity: {
            x: Number.parseInt(velMatch[1], 10),
            y: Number.parseInt(velMatch[2], 10),
        }
    }
});

const maxX = input == testInputs.example ? 11 : 101;
const maxY = input == testInputs.example ? 7 : 103;

const finalPositions: Point[] = robots.map(({velocity, position}) => {
    return {
        x: (((position.x + (velocity.x * 100)) % maxX) + maxX) % maxX,
        y: (((position.y + (velocity.y * 100)) % maxY) + maxY) % maxY,
    }
});

finalPositions.sort((a, b) => {
    if (a.y != b.y) {
        return a.y - b.y;
    }

    return a.x - b.x;
})

const areas: Point[][] = [
    [],
    [],
    [],
    [],
];

finalPositions.forEach(({x, y}) => {
    if (x <= Math.floor((maxX - 2) / 2)) {
        if (y <= Math.floor((maxY - 2) / 2)) {
            areas[0].push({x, y});
        } else if (y >= Math.ceil(maxY / 2)) {
            areas[2].push({x, y});
        }
    } else if (x >= Math.ceil(maxX / 2)) {
        if (y <= Math.floor((maxY - 2) / 2)) {
            areas[1].push({x, y});
        } else if (y >= Math.ceil(maxY / 2)) {
            areas[3].push({x, y});
        }
    }
})

const part1 = areas.reduce((prev, curr) => prev * curr.length, 1);

console.log(`Part 1: ${part1}`);

function moveRobots(robots: Robot[]): Robot[] {
    return robots.map(({position, velocity}) => {
        return {
            velocity,
            position: {
                x: (((position.x + velocity.x) % maxX) + maxX) % maxX,
                y: (((position.y + velocity.y) % maxY) + maxY) % maxY
            }
        }
    })
}

function toStr(robots: Robot[]): string {
    const rows: string[] = [];
    const points: PointMap<boolean> = new Map;

    robots.forEach(robot => setPoint(robot.position, true, points))

    for(let y=0; y<=maxY; y++) {
        const row: (' ' | '█')[] = [];
        for(let x=0; x<=maxX; x++) {
            row.push(getPoint({x,y}, points) ? '█' : ' ');
        }
        rows.push(row.join(''));
    }

    return rows.join('\n');
}

async function isAnswer(): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await rl.question('Is this the answer? Non-empty answer for yes');

    rl.close(); // stop listening
    return answer.length != 0;
}

async function findAnswer(robots: Robot[]): Promise<number> {
    let i = 0;
    let found = false;
    let toDisplay = robots;

    do {
        toDisplay = moveRobots(toDisplay);
        console.log(i);
        console.log(toStr(toDisplay));

        found = await isAnswer();
    } while (!found)

    return i;
}

// Good luck, it'll take forever for you to check them all
findAnswer(robots).then(
    i => console.log(`Part 2: ${i}`)
)

