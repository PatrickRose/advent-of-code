import getInput from "./util/getInput";

const testInputs = {
    example: `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`
}

const input = getInput(testInputs, 25);

const map: Map<string, string[]> = new Map();

const keys: string[] = [];

function addLink(from: string, to: string) {
    let list = map.get(from);

    if (!list) {
        list = [];
        map.set(from, list);
    }

    list.push(to);
}

input.split('\n').forEach(
    row => {
        const [key, values] = row.split(': ');

        values.split(' ').forEach(val => {
            addLink(key, val);
            addLink(val, key);
        });
        keys.push(key);
    }
)


type CutWires = [[string, string], [string, string], [string, string]];

function isACutWire(cutWires: CutWires, from: string, to: string): boolean {
    return cutWires.some(([a, b]) => {
        return (a == from && b == to)
            || (b == from && a == to)
    })
}

function sizeOfGroups(cutWires: CutWires): number[] {
    const toReturn: number[] = [];

    const inAGroup: Set<string> = new Set();

    const keysToDo = [...keys];

    let keyToDo;

    while (keyToDo = keysToDo.shift()) {
        if (inAGroup.has(keyToDo)) {
            continue;
        }

        const innerSet: Set<string> = new Set([keyToDo]);
        inAGroup.add(keyToDo);
        const keysToCheck = [keyToDo];
        let keyToCheck;

        while (keyToCheck = keysToCheck.shift()) {
            const nextPlaces = map.get(keyToCheck) ?? [];

            for (let place of nextPlaces) {
                if (isACutWire(cutWires, keyToCheck, place)) {
                    continue;
                }
                if (innerSet.has(place)) {
                    continue;
                }
                innerSet.add(place);
                inAGroup.add(place);
                keysToCheck.push(place);
            }
        }

        toReturn.push(innerSet.size);
    }

    return toReturn;
}

// input specific
if (input == testInputs.example) {
    throw new Error('Input specific')
}
const nodes = ['dqf', 'sds', 'xft']

for(let firstNode of map.get(nodes[0]) ?? []) {
    for(let secondNode of map.get(nodes[1]) ?? []) {
        for(let thirdNode of map.get(nodes[2]) ?? []) {
            const groups = sizeOfGroups([
                [firstNode, nodes[0]],
                [secondNode, nodes[1]],
                [thirdNode, nodes[2]],
            ])

            if (groups.length == 2) {
                console.log(`Part 1: ${groups[0] * groups[1]}`);
            }
        }
    }
}
