import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`
}

const input = getInput(testInputs, 9);

const locations: Set<string> = new Set();
const paths: Map<string, Map<string, number>> = new Map();

function setMapValue(location1: string, location2: string, distance: number) {
    let inner = paths.get(location1);
    if (!inner) {
        inner = new Map();
        paths.set(location1, inner);
    }

    inner.set(location2, distance);
}

input.split('\n').forEach(row => {
    const match = row.match(/(.+) to (.+) = (\d+)/);

    if (!match) {
        throw new Error(`${row} does not match regex`);
    }

    const location1 = match[1];
    const location2 = match[2];
    const distance = parseInt(match[3]);

    locations.add(location1);
    locations.add(location2);

    setMapValue(location1, location2, distance);
    setMapValue(location2, location1, distance);
});

function getPath(minMax: "min" | "max", currentLocation: string | null, visited: readonly string[] = [], currentLength: number = 0): number {
    const possiblePathValues: number[] = [];
    if (currentLocation === null) {
        locations.forEach(location => {
            possiblePathValues.push(getPath(minMax, location, [], 0))
        })
    } else {
        const possiblePaths = paths.get(currentLocation);

        if (possiblePaths === undefined) {
            throw new Error(`Unknown location ${currentLocation}`);
        }
        const newVisited = [...visited, currentLocation]

        possiblePaths.forEach((pathLength, location) => {
            if (visited.includes(location)) {
                return;
            }

            possiblePathValues.push(getPath(minMax, location, newVisited, currentLength + pathLength))
        })
    }

    return possiblePathValues.length == 0
        ? currentLength
        : (
            minMax == "min"
                ? Math.min(...possiblePathValues)
                : Math.max(...possiblePathValues)
        );
}

console.log(`Part 1: ${getPath("min", null, [], 0)}`);
console.log(`Part 2: ${getPath("max", null, [], 0)}`);
