import getInput from "./util/getInput";

const exampleInput = `2199943210
3987894921
9856789892
8767896789
9899965678`;

const realInput = getInput(9);

const input = realInput;

const points = new Map<number, Map<number, number>>()

input.split("\n").forEach(
    (row, y) => {
        row.split('').forEach(
            (char, x) => {
                let xMap = points.get(x);

                if (!xMap) {
                    xMap = new Map<number, number>();
                    points.set(x, xMap);
                }

                xMap.set(y, Number.parseInt(char, 10));
            }
        )
    }
);

function adjacentPoints(x: number, y: number): [[number, number], [number, number], [number, number], [number, number]] {
    return [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
    ]
}

const lowPoints: { value: number, x: number, y: number }[] = [];

points.forEach((xMap, x) => {
    xMap.forEach((value, y) => {
        const lowerThanAll = adjacentPoints(x, y).every(([x, y]) => {
            const adjacentValue = points.get(x)?.get(y);

            if (adjacentValue === undefined) {
                return true;
            }

            return value < adjacentValue;
        });

        if (lowerThanAll) {
            lowPoints.push({value, x, y});
        }
    });
})

const riskLevels = lowPoints.map(({value}) => value).reduce((previousValue, currentValue) => previousValue + currentValue + 1, 0);

console.log(`Part 1: ${riskLevels}`);

const basinSizes = lowPoints.map(({x, y, value}) => {
    const valuesInBasin: { x: number, y: number }[] = [{x, y}];

    const positionsToCheck = adjacentPoints(x, y).map((point) => {
        return {
            point,
            value
        }
    });

    do {
        const nextVal = positionsToCheck.pop();

        if (nextVal == undefined) {
            continue;
        }

        const {point, value} = nextVal;
        const [thisX, thisY] = point;

        // Have we already done this?
        if (valuesInBasin.find(({x, y}) => x == thisX && y == thisY) !== undefined) {
            continue;
        }

        // Now we get the value:
        const thisValue = points.get(thisX)?.get(thisY);

        if (thisValue === undefined || thisValue == 9) {
            continue;
        }

        if (thisValue > value) {
            valuesInBasin.push({x: thisX, y: thisY});
            const thisAdjacentPoints = adjacentPoints(thisX, thisY).map((point) => {
                return {
                    point,
                    value: thisValue
                }
            });
            positionsToCheck.push(...thisAdjacentPoints);
        }
    } while (positionsToCheck.length > 0);

    return valuesInBasin.length;
});

basinSizes.sort((a, b) => b - a);

const part2 = basinSizes.slice(0, 3).reduce((previousValue, currentValue) => previousValue * currentValue);

console.log(`Part 2: ${part2}`);
