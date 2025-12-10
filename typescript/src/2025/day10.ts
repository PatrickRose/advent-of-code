import getInput from "./util/getInput";
import {accumulator, mappedAccumulator} from "../util/accumulator";
import {init} from "z3-solver";

const testInputs = {
    example: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`
}

const input = getInput(testInputs, 10);

type Indicator = boolean[];
type Joltages = number[];

type Machine = {
    indicator: Indicator,
    switches: number[][],
    joltages: Joltages
}

const machines: Machine[] = input.split('\n').map((row) => {
    const matches = row.match(/^\[([.#]+)] (.+) \{(.+)}$/);

    if (!matches) {
        throw new Error(`${row} is invalid`);
    }

    return {
        indicator: matches[1].split('').map(char => char == '#'),
        switches: matches[2].split(' ').map(val => {
            const numbers = val.substring(1, val.length - 1);
            return numbers.split(',').map(val => Number.parseInt(val, 10))
        }),
        joltages: matches[3].split(',').map(val => Number.parseInt(val, 10))
    }
})

type PressState<T extends (Indicator | Joltages)> = {
    indicator: T,
    numPresses: number
}

function indicatorToString(val: Indicator) {
    return val.map(val => val ? '#' : '.').join('');
}

function indicatorsMatch(first: Indicator, second: Indicator): boolean {
    return indicatorToString(first) == indicatorToString(second);
}

function joltagesToString(val: Joltages) {
    return val.join('');
}

function joltagesMatch(first: Joltages, second: Joltages): boolean {
    return joltagesToString(first) == joltagesToString(second);
}

function calculateMinimumPressesForIndicators(machine: Machine): number {
    const states: PressState<Indicator>[] = [{
        indicator: machine.indicator.map(() => false),
        numPresses: 0
    }];

    const cache: Map<string, number> = new Map;

    while (true) {
        const nextState = states.shift();

        if (!nextState) {
            throw new Error('Ran out of states to check, must be impossible');
        }

        if (indicatorsMatch(nextState.indicator, machine.indicator)) {
            return nextState.numPresses;
        }

        const key = indicatorToString(nextState.indicator);
        const previouslySeen = cache.get(key);

        if (previouslySeen === undefined) {
            cache.set(key, nextState.numPresses);
        } else {
            if (previouslySeen <= nextState.numPresses) {
                // Then we got to this position earlier with fewer button presses - stop
                continue;
            } else {
                cache.set(key, nextState.numPresses);
            }
        }

        for (let switchRule of machine.switches) {
            const newState: PressState<Indicator> = {
                indicator: nextState.indicator.map((val, i) => {
                    return switchRule.includes(i) ? !val : val;
                }),
                numPresses: nextState.numPresses + 1
            };

            states.push(newState)
        }
    }
}

const part1 = mappedAccumulator(machines, (machine, i) => {
    return calculateMinimumPressesForIndicators(machine);
});

console.log(`Part 1: ${part1}`);

async function part2(machines: Machine[]): Promise<number> {
    const {Context} = await init();

    const promises = machines.map(async (machine, machineNum) => {
        const {Solver, Int, And, Optimize} = Context('Main');

        const solver = new Optimize();
        const constants: ReturnType<typeof Int["const"]>[] = [];

        // For (1), (2), (1,2) {2,3}
        // We want the minimum x+y+z such that
        // x + z = 2
        // y + z = 3

        machine.switches.forEach((val, i) => {
            const itemConstant = Int.const(`Switch${i}`);
            constants.push(itemConstant);
            solver.add(itemConstant.ge(0));
        });

        // Add a minimisation rule
        solver.minimize(constants.reduce((prev, curr) => prev.add(curr)));

        machine.joltages.forEach((val, i) => {
            // Get all the switches that add to this joltage
            const switches = constants.filter((val, j) => {
                // Get the switch for this constant
                const relatedSwitch = machine.switches[j];

                return relatedSwitch.includes(i);
            })

            // Then generate a solver rule
            const rule = switches.reduce((prev, curr) => prev.add(curr));

            solver.add(rule.eq(val))
        });

        const response = await solver.check();
        if (response != 'sat') {
            throw new Error('Conditions are unsolvable');
        }

        const model = solver.model();

        return mappedAccumulator(constants, (val) => Number(model.eval(val)));
    })

    return accumulator(await Promise.all(promises));
}

part2(machines).then((part2) => console.log(`Part 2: ${part2}`));
