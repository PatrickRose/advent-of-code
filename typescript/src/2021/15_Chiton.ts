import getInput from "./util/getInput";

import {BinaryHeapStrategy} from "js-priority-queue";

const exampleInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

const realInput = getInput(15);

const input = realInput;

const risks = new Map<number, Map<number, number>>();
const largerRisks = new Map<number, Map<number, number>>();

input.split("\n").forEach(
    (row, y) => {
        const riskMap = new Map<number, number>();
        const largerRiskMap = new Map<number, number>();
        risks.set(y, riskMap);
        largerRisks.set(y, largerRiskMap);
        row.split('').forEach(
            (char, x) => {
                const value = Number.parseInt(char, 10);
                riskMap.set(x, value);

                for (let multiply = 0; multiply < 5; multiply++) {
                    let newValue = value + multiply;

                    while (newValue > 9) {
                        newValue -= 9;
                    }

                    largerRiskMap.set(x + multiply * row.length, newValue);
                }
            }
        )

        for (let yMultiply = 1; yMultiply < 5; yMultiply++) {
            const largerRiskMap = new Map<number, number>();
            largerRisks.set(y + yMultiply * row.length, largerRiskMap);
            row.split('').forEach(
                (char, x) => {
                    const value = Number.parseInt(char, 10) + yMultiply;

                    for (let multiply = 0; multiply < 5; multiply++) {
                        let newValue = value + multiply;

                        while (newValue > 9) {
                            newValue -= 9;
                        }
                        largerRiskMap.set(x + multiply * row.length, newValue);
                    }
                }
            )
        }
    }
);

function getInnerMap(map: Map<number, Map<number, number>>, key: number): Map<number, number> {
    let innerMap = map.get(key);

    if (innerMap === undefined) {
        innerMap = new Map<number, number>()
        map.set(key, innerMap);
    }

    return innerMap;
}


function aStar(risks: Map<number, Map<number, number>>): number {
    const path = new Map<number, Map<number, number>>();
    const heuristicScore = new Map<number, Map<number, number>>();

    const [maxY, maxX] = [risks.size - 1, risks.size - 1];

    // Use a*
    function heuristic(x: number, y: number) {
        // Best answer would be 1 for each coord move, so...
        return maxX - x + maxY - y;
    }

    const openSet = new BinaryHeapStrategy<[number, number]>({
        comparator: ([aX, aY], [bX, bY]) => (heuristicScore.get(aY)?.get(aX) ?? Infinity) - (heuristicScore.get(bY)?.get(bX) ?? Infinity)
    });
    openSet.queue([0, 0]);

    getInnerMap(path, 0).set(0, 0);
    getInnerMap(heuristicScore, 0).set(0, heuristic(0, 0));

    while (true) {
        const next = openSet.dequeue();

        if (next == undefined) {
            console.log(risks)
            throw Error('No answer, but ran out of places to check');
        }

        const [x, y] = next;

        const currentCost = path.get(y)?.get(x);

        if (currentCost === undefined) {
            throw Error(`Should never have an undefined cost - tried to access ${x},${y} (${currentCost})`)
        }

        if (x == maxX && y == maxY) {
            return currentCost;
        }

        [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].forEach(
            ([x, y]) => {
                if (x < 0 || x > maxX || y < 0 || y > maxY) {
                    return;
                }

                const number = risks.get(y)?.get(x) || Infinity;
                const tentativeScore = currentCost + number;

                const currentCostAtPoint = getInnerMap(path, y).get(x) || Infinity;

                if (tentativeScore < currentCostAtPoint) {
                    getInnerMap(path, y).set(x, tentativeScore);
                    getInnerMap(heuristicScore, y).set(x, tentativeScore + heuristic(x, y));
                    openSet.queue([x, y]);
                }
            }
        );
    }
}

console.log(`Part 1: ${aStar(risks)}`);
console.log(`Part 2: ${aStar(largerRisks)}`);
