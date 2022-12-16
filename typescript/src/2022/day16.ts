import getInput from "./util/getInput";

const sampleInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

const input = getInput(16);

const baseValves: Map<string, {flow: number, adjacent: string[]}> = new Map;
const valves: Map<string, { flow: number, adjacent: Map<string, number> }> = new Map;

input.split('\n').forEach(
    row => {
        const regex = row.match(/Valve ([A-Z][A-Z]) has flow rate=(\d+); tunnels? leads? to valves? (.+)/);

        if (!regex) {
            throw Error(`"${row}" does not match`);
        }

        const [_, valve, flow, adjacents] = regex;

        baseValves.set(
            valve,
            {
                flow: Number.parseInt(flow, 10),
                adjacent: adjacents.split(', ')
            }
        );

        const adjacentsMap: Map<string, number> = new Map;

        adjacents.split(', ').forEach(
            val => adjacentsMap.set(val, 1)
        );

        valves.set(
            valve,
            {
                flow: Number.parseInt(flow, 10),
                adjacent: adjacentsMap
            }
        )
    }
)

let added = true;
while (added) {
    added = false;

    for (let [baseKey, baseValve] of valves.entries()) {
        for (let [adjacentValve, adjacentCost] of baseValve.adjacent.entries()) {
            const adjacentMap = valves.get(adjacentValve);

            if (!adjacentMap) {
                continue;
            }

            for (let [toAddValve, toAddCost] of adjacentMap.adjacent.entries()) {
                if (toAddValve == baseKey) {
                    continue;
                }

                const costToPoint = adjacentCost + toAddCost;

                const currentCost = baseValve.adjacent.get(toAddValve) ?? Infinity;

                if (costToPoint < currentCost) {
                    baseValve.adjacent.set(toAddValve, costToPoint);
                    added = true;
                }
            }
        }
    }
}

// Then, remove any nodes where the flow is 0
valves.forEach((valve, key) => {
    if (valve.flow != 0 || key == 'AA') {
        return;
    }

    valves.delete(key);

    valves.forEach((valve) => {
        valve.adjacent.delete(key)
    })
});

function makePath(currPos: string, currFlow: number, minutesLeft: number, openValves: string[]): number {
    if (minutesLeft <= 0) {
        return currFlow;
    }

    if (openValves.length == valves.size) {
        return currFlow;
    }

    const currentValve = valves.get(currPos);

    if (!currentValve) {
        throw new Error(`${currPos} does not exist`);
    }

    const options: number[] = [];

    if (!openValves.includes(currPos)) {
        const newOpenValves: typeof openValves = openValves.slice(0);
        newOpenValves.push(currPos);
        const nextMinutes = minutesLeft - 1;

        return makePath(currPos, currFlow + (currentValve.flow * nextMinutes), nextMinutes, newOpenValves);
    }

    currentValve.adjacent.forEach(
        (distance, key) => {
            if (openValves.includes(key)) {
                // If it's already open, then there's no point going there
                return;
            }

            const nextMinutes = minutesLeft - distance;

            options.push(makePath(key, currFlow, nextMinutes, openValves))
        }
    );

    // console.log(options);

    return Math.max(...options);
}

console.log(`Part 1: ${makePath('AA', 0, 30, ['AA'])}`);

// The fastest thing will be to split the work between me and the elephant
// Then, calculate the highest pressure sum for those packets, and the highest value is best
// We can avoid duplicate work - [AA] / [BB, CC] === [BB, CC] / [AA]
const calculatedPressures: Map<`${string}/${string}`, number> = new Map();

function basePressure(leftPacket: string[]) {
    if (leftPacket.length > valves.size / 2) {
        // At this point, we should have already got it, just stop
        return;
    }
    const rightPacket = [];
    for(let key of valves.keys()) {
        if (key != 'AA' && !leftPacket.includes(key)) {
            rightPacket.push(key);
        }
    }

    rightPacket.sort();

    const key: `${string}/${string}` = leftPacket.length < rightPacket.length
        ? `${leftPacket.join(',')}/${rightPacket.join(',')}`
        : `${rightPacket.join(',')}/${leftPacket.join(',')}`

    if (!calculatedPressures.has(key)) {
        const leftPacketValue = makePath('AA', 0, 26, ['AA', ...leftPacket])
        const rightPacketValue = makePath('AA', 0, 26, ['AA', ...rightPacket])

        calculatedPressures.set(key, leftPacketValue + rightPacketValue);
    }

    if (leftPacket.length < (valves.size / 2)) {
        for (let key of valves.keys()) {
            if (key != 'AA' && !leftPacket.includes(key)) {
                const newPacket = [...leftPacket, key];

                newPacket.sort();
                basePressure(newPacket);
            }
        }
    }
}

// Takes about 7 minutes!
basePressure([]);

console.log(`Part 2: ${Math.max(...calculatedPressures.values())}`)
