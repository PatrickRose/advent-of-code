import getInput from "./util/getInput";
import {Point, PointString, pointToPointString} from "../util/points";

const testInputs = {}

const input = getInput(testInputs, 3);

function runInput(input: string, numSantas: number = 1): number {
    const positions: Point[] = [];
    while (positions.length < numSantas) {
        positions.push({x:0, y:0});
    }

    const visitedHouses: Set<PointString> = new Set;
    visitedHouses.add(pointToPointString(positions[0]));
    input.split('').forEach((val, index) => {
        const currPos = positions[index % positions.length];

        switch (val) {
            case '^':
                currPos.y--;
                break;
            case '>':
                currPos.x++;
                break;
            case 'v':
                currPos.y++;
                break;
            case '<':
                currPos.x--;
                break;
        }

        visitedHouses.add(pointToPointString(currPos));
    })

    return visitedHouses.size;
}

console.log(`Part 1: ${runInput(input)}`);
console.log(`Part 2: ${runInput(input, 2)}`);
