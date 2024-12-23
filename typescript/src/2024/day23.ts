import getInput from "./util/getInput";
import {getValueFromCache} from "../util/cache";

const testInputs = {
    example: `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`,
    allIn: `ka-co
ta-co
de-co
ta-ka
de-ta
ka-de`
}

const input = getInput(testInputs, 23);

const connections: Map<string, string[]> = new Map;

function addComputerToConnection(a: string, b: string): void {
    let array = connections.get(a);
    if (array === undefined) {
        array = [];
        connections.set(a, array);
    }

    array.push(b);
}

input.split('\n').forEach((row) => {
    const [a, b] = row.split('-');
    addComputerToConnection(a, b);
    addComputerToConnection(b, a);
});

const threeSets: Set<string> = new Set;

for (const [a, b] of connections) {
    for (const connect of b) {
        const bConnection = connections.get(connect) ?? [];
        for (const val of bConnection) {
            const sorted = [a, connect, val].sort();
            const noDuplicates = sorted.every((val, index) => {
                return !sorted.some((inner, i) => {
                    if (i == index) {
                        return false;
                    }

                    return inner == val;
                })
            })

            if (noDuplicates) {
                threeSets.add(sorted.join(','));
            }
        }
    }
}

const allConnected = Array.from(threeSets).filter(val => {
    return val.split(',').every((val, index, all) => {
        return all.every((inner, i) => {
            if (index == i) {
                return true;
            }

            return connections.get(inner)?.includes(val);
        })
    })
});

const part1 = allConnected.filter(val => {
    return val.split(',').some(val => val.startsWith('t'));
})

console.log(`Part 1: ${part1.length}`);

const maxSets: Set<string>[] = [];

function bronKerbosch(r: Set<string>, p: Set<string>, x: Set<string>): void {
    if (p.size == 0 && x.size == 0) {
        maxSets.push(r);
        return;
    }

    for(const vertex of p) {
        const neighbours = new Set(connections.get(vertex) ?? [])
        bronKerbosch(r.union(new Set([vertex])), p.intersection(neighbours), x.intersection(neighbours));
        p.delete(vertex);
        x.add(vertex);
    }
}

bronKerbosch(new Set, new Set([...connections.keys()]), new Set);
maxSets.sort((a,b) => b.size-a.size);

const part2 = Array.from(maxSets[0]).sort().join(',');
console.log(`Part 2: ${part2}`);
