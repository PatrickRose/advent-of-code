import getInput from "./util/getInput";

const input = getInput(10)

const adapters: Array<number> = input.split("\n").map(
    s => Number(s)
).sort(
    (a, b): number => a - b
);

const diffFromPrevious = adapters.map(
    (val, ind, allVals): [number, number, number] => {
        const prev = ind === 0 ? 0 : allVals[ind - 1];

        return [val, prev, val - prev];
    }
);

const diffOfOne = diffFromPrevious.filter(val => val[2] == 1);
const diffOfThree = diffFromPrevious.filter(val => val[2] == 3);

console.log(`Part 1: ${diffOfOne.length * (diffOfThree.length + 1)}`);

// We can work backwards
// If x leads to a chain that takes us to the end, then
// any y that leads to x will give us another chain
// So if 4 has 3 routes, 5 has 2 and 6 has 1
// 3 would have 3 + 2 + 1 routes
// Once we've mapped that, we can then just count the sum of 1/2/3

const routes: { [key: number]: number } = {}

const max = Math.max(...adapters);

adapters.reverse().forEach(
    (value) => {
        if (value == max) {
            routes[value] = 1;
            return;
        }

        let routeCount = 0;

        for (let x = value + 1; x <= value + 3; x++) {
            const count = routes[x];

            if (count !== undefined) {
                routeCount += count;
            }
        }

        routes[value] = routeCount;
    }
);

const partTwo = [1, 2, 3].reduce(
    (previous, thisVal): number => {
        const toAdd = routes[thisVal];

        if (toAdd === undefined) {
            return previous;
        }

        return previous + toAdd;
    },
    0
)

console.log(`Part 2: ${partTwo}`);
