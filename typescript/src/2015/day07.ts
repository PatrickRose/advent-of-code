import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i`
}

const input = getInput(testInputs, 7);

type Command = {
    command: 'NOT',
    wire: string
} | {
    command: 'AND' | 'OR' | 'LSHIFT' | 'RSHIFT',
    wire1: string | number,
    wire2: string | number
}

function getValue(b: number|null): number {
    const signalDefs: Map<string, Command> = new Map();
    const signalValues: Map<string, number> = new Map();

    input.split('\n')
        .forEach(row => {
            const [def, wire] = row.split(' -> ');

            if (b !== null && wire == 'b') {
                signalValues.set(wire, b);
                return;
            }

            if (def.match(/^\d+$/)) {
                signalValues.set(wire, parseInt(def));
                return;
            }

            const values = def.split(' ');

            if (values.length == 2) {
                if (values[0] != 'NOT') {
                    throw new Error(`Invalid row ${row}`);
                }

                signalDefs.set(wire, {command: "NOT", wire: values[1]});
                return;
            }

            if (values.length == 1) {
                signalDefs.set(
                    wire,
                    {
                        command: 'AND',
                        wire1: values[0],
                        wire2: values[0],
                    }
                );
                return;
            }

            const [wire1, command, wire2] = values;

            let wire1Val = wire1.match(/^\d+$/)
                ? parseInt(wire1)
                : wire1;
            let wire2Val = wire2.match(/^\d+$/)
                ? parseInt(wire2)
                : wire2;

            if (command == 'AND' || command == 'OR' || command == 'LSHIFT' || command == 'RSHIFT') {
                signalDefs.set(wire, {command, wire1: wire1Val, wire2: wire2Val});
            }
        });

    while (signalDefs.size) {
        signalDefs.forEach((val, key) => {
            if (val.command == 'NOT') {
                const wire = val.wire;
                const signalVal = signalValues.get(wire);

                if (signalVal !== undefined) {
                    signalValues.set(key, 65535 - signalVal);
                    signalDefs.delete(key)
                }

                return;
            }

            const val1 = typeof val.wire1 == 'number' ? val.wire1 : signalValues.get(val.wire1);
            const val2 = typeof val.wire2 == 'number' ? val.wire2 : signalValues.get(val.wire2);

            if (val1 === undefined || val2 === undefined) {
                return;
            }

            switch (val.command) {
                case 'AND':
                    signalValues.set(key, val1 & val2);
                    break;
                case 'OR':
                    signalValues.set(key, val1 | val2);
                    break;
                case 'LSHIFT':
                    signalValues.set(key, val1 << val2);
                    break;
                case 'RSHIFT':
                    signalValues.set(key, val1 >>> val2);
                    break;
            }

            signalDefs.delete(key);
        })
    }

    const aVal = signalValues.get('a');

    if (aVal === undefined) {
        throw new Error('signal a did not have a value')
    }

    return aVal;
}

const part1 = getValue(null);
console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${getValue(part1)}`)
