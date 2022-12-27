import getInput from "./util/getInput";
import {getAdjacentPoints, Point, PointString, pointToPointString} from "../util/points";

const sampleInput = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

const input = getInput(24);

type Direction = '^' | 'v' | '>' | '<';

type Blizzard = {
    direction: Direction,
    currentPosition: Point
}
const DIRECTIONS: { [key in Direction]: Point } = {
    '^': {
        x: 0,
        y: -1
    },
    'v': {
        x: 0,
        y: 1
    },
    '<': {
        x: -1,
        y: 0
    },
    '>': {
        x: 1,
        y: 0
    },
}

const maxX = input.split('\n')[0].length - 2;
const maxY = input.split('\n').length - 2;

function moveBlizzard({direction, currentPosition}: Blizzard): Blizzard {
    const toAdd = DIRECTIONS[direction];

    const newPosition = {
        x: currentPosition.x + toAdd.x,
        y: currentPosition.y + toAdd.y
    }

    if (newPosition.x >= maxX) {
        return {
            direction,
            currentPosition: {
                ...newPosition,
                x: 0
            }
        }
    }

    if (newPosition.x < 0) {
        return {
            direction,
            currentPosition: {
                ...newPosition,
                x: maxX - 1
            }
        }
    }

    if (newPosition.y >= maxY) {
        return {
            direction,
            currentPosition: {
                ...newPosition,
                y: 0
            }
        }
    }

    if (newPosition.y < 0) {
        return {
            direction,
            currentPosition: {
                ...newPosition,
                y: maxY - 1
            }
        }
    }

    return {
        direction,
        currentPosition: newPosition
    }
}

function findValidSpots(blizzards: Blizzard[]): Set<PointString> {
    const blizzardPositions: Set<PointString> = new Set();

    blizzards.forEach(blizzards => blizzardPositions.add(pointToPointString(blizzards.currentPosition)));

    const toReturn: Set<PointString> = new Set([pointToPointString({x:0,y: -1}), pointToPointString({x: maxX - 1, y: maxY})]);

    for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
            if (!blizzardPositions.has(pointToPointString({x, y}))) {
                toReturn.add(`${x},${y}`)
            }
        }
    }

    return toReturn;
}

const states: Map<number, { blizzards: Blizzard[], validStates: Set<PointString> }> = new Map();

// First we need to get the initial state
const blizzards: Blizzard[] = [];

input.split('\n').slice(1, -1).forEach(
    (row, y) => {
        row.split('').slice(1, -1).forEach(
            (char, x) => {
                if ((['^', '>', 'v', '<']).includes(char)) {
                    blizzards.push({
                        direction: char as Direction,
                        currentPosition: {x, y}
                    })
                }
            }
        )
    }
);

const validStates = findValidSpots(blizzards);

states.set(0, {blizzards, validStates});

function calculateNextStep(blizzards: Blizzard[]): { blizzards: Blizzard[], validStates: Set<PointString> } {
    const newBlizzards = blizzards.map(blizzard => moveBlizzard(blizzard));

    return {
        blizzards: newBlizzards,
        validStates: findValidSpots(newBlizzards)
    }
}

type Position = Point & { steps: number };
type PositionString = `${PointString},${number}`;

function positionToPositionString(position: Position): PositionString {
    return `${pointToPointString(position)},${position.steps}`
}

function findShortestPath(root: Position, target: Point): number {
    const queue: (Position & {parent?: Position})[] = [root];

    const explored: Set<PositionString> = new Set;
    explored.add(positionToPositionString(root));

    while (queue.length > 0) {
        const toCheck = queue.pop();

        if (!toCheck) {
            throw new Error('Type check');
        }

        const {x,y,steps} = toCheck;

        if (x == target.x && y == target.y) {
            return steps;
        }

        let state = states.get(steps + 1);

        if (state == undefined) {
            const oldState = states.get(steps);
            if (!oldState) {
                throw new Error('Type check');
            }

            state = calculateNextStep(oldState.blizzards);

            states.set(steps + 1, state)
        }

        const validStates = state.validStates;

        const adjacentPoints = getAdjacentPoints(x, y, false);

        adjacentPoints.push({x,y});

        adjacentPoints
            .forEach(
            (point) => {
                if (!validStates.has(pointToPointString(point))) {
                    return;
                }

                let position = {...point, steps: steps+1};
                const positionString = positionToPositionString(position);

                if (!explored.has(positionString)) {
                    explored.add(positionString);
                    queue.unshift({...position, parent: toCheck})
                }
            }
        )
    }

    throw new Error('Unable to find shortest path');
}

const part1 = findShortestPath({x: 0, y: -1, steps: 0}, {x: maxX - 1, y: maxY});
const toStart = findShortestPath({x: maxX - 1, y: maxY, steps: part1}, {x: 0, y: -1});
const part2 = findShortestPath({x: 0, y: -1, steps: toStart}, {x: maxX - 1, y: maxY});

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
