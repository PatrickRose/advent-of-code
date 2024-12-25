import getInput from "./util/getInput";

const testInputs = {
    smallExample: `x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`,
    bigExample: `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`
}

const input = getInput(testInputs, 24);

const [inputDef, wireDef] = input.split('\n\n');

type Gate = {
    left: string,
    right: string,
    type: string
}

const wires: Map<string, Gate | number> = new Map;

function getValueOfWire(wire: string, wires: Map<string, Gate | number>): number {
    const val = wires.get(wire);
    if (val === undefined) {
        throw new Error(`Unknown wire ${wire}`);
    }

    if (typeof val === 'number') {
        return val;
    }

    const left = getValueOfWire(val.left, wires)
    const right = getValueOfWire(val.right, wires)
    let answer: number | null = null;

    switch (val.type) {
        case 'AND':
            answer = left & right;
            break;
        case 'OR':
            answer = left | right;
            break;
        case 'XOR':
            answer = left ^ right;
            break;
        default:
            throw new Error(`Unknown type for ${wire}: ${val.type}`)
    }

    wires.set(wire, answer);

    return answer;
}

inputDef.split('\n').forEach(row => {
    const [wire, val] = row.split(': ');
    wires.set(wire, val == '1' ? 1 : 0);
});

wireDef.split('\n').forEach(row => {
    const [gateDef, wire] = row.split(' -> ');
    const [left, type, right] = gateDef.split(' ');

    wires.set(wire, {left, right, type});
});

const allGates = Array.from(wires.keys());
const keysToDo = allGates.filter(val => val.startsWith('z')).sort();
const answerWires = new Map(wires)

const answer = keysToDo.map((wire) => getValueOfWire(wire, answerWires)).reduce((prev, curr) => `${curr}${prev}`, '');

console.log(`Part 1: ${Number.parseInt(answer, 2)}`);
