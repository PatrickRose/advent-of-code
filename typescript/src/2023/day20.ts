import getInput from "./util/getInput";
import {lcm} from "../util/number";

const testInputs = {
    example: `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
    secondExample: `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`
}

const input = getInput(testInputs, 20);

type FlipFlopModule = {
    type: 'flipFlop',
    status: 'on' | 'off',
    destinations: string[]
}

type ConjuctionModule = {
    type: 'conjunction',
    status: Record<string, boolean>,
    destinations: string[]
}

type BroadcasterModule = {
    type: 'broadcaster',
    destinations: string[]
}

const modules: Map<string, FlipFlopModule|ConjuctionModule> = new Map();
let broadcaster: null|BroadcasterModule = null;

input.split('\n').forEach(row => {
    const [module, destinationsStr] = row.split(' -> ');
    const destinations = destinationsStr.split(', ');

    if (module == 'broadcaster') {
        broadcaster = {
            type: "broadcaster",
            destinations
        }

        return;
    }

    const type = module[0];
    const key = module.slice(1);

    if (type == '&') {
        modules.set(key, {
            status: {},
            type: "conjunction",
            destinations
        });
    } else {
        modules.set(key, {
            status: 'off',
            type: "flipFlop",
            destinations
        });
    }
});

modules.forEach((val, key) => {
    val.destinations.forEach(destination => {
        const module = modules.get(destination);
        if (module?.type == 'conjunction') {
            module.status[key] = false;
        }
    })
})

type Pulse = {
    target: BroadcasterModule|string,
    type: 'low' | 'high',
    from: string
};

let hitTarget = false;
let targetToHit: string|null = null;

function processPulse({target, type, from}: Pulse): Pulse[] {
    if (typeof target !== 'string') {
        return target.destinations.map((target) => {
            return {
                target: target,
                type,
                from: 'broadcaster'
            }
        });
    }

    const actualTarget = modules.get(target);

    if (!actualTarget) {
        return [];
    }

    switch(actualTarget.type) {
        case "flipFlop":
            if (type =='high') {
                return []
            }

            actualTarget.status = actualTarget.status == 'on' ? 'off' : 'on';
            return actualTarget.destinations.map((destination) => {
                return {
                    target: destination,
                    type: actualTarget.status == 'on' ? 'high' : 'low',
                    from: target
                }
            });
        case "conjunction":
            actualTarget.status[from] = type == 'high';

            const toSend: Pulse["type"] = Object.values(actualTarget.status).every(val => val) ? 'low': 'high';

            return actualTarget.destinations.map((destination) => {
                return {
                    target: destination,
                    type: toSend,
                    from: target
                }
            });
    }
}

function pressButton(): [number, number] {
    if (!broadcaster) {
        throw new Error('Did not find broadcaster')
    } else {
        broadcaster.destinations.forEach(destination => {
            const module = modules.get(destination);
            if (module?.type == 'conjunction' && module.status['broadcaster'] === undefined) {
                module.status['broadcaster'] = false;
            }
        })
    }

    let low = 0;
    let high = 0;

    const pulses: Pulse[] = [
        {
            target: broadcaster,
            type: 'low',
            from: 'BUTTON'
        }
    ];

    while (true) {
        const pulse = pulses.shift();

        if (!pulse) {
            break;
        }

        if (pulse.type == 'low') {
            low++;
        } else {
            high++;
        }

        const result = processPulse(pulse);

        if (pulse.target == targetToHit && result.some(({type}) => type == 'high')) {
            hitTarget = true;
        }

        pulses.push(...result);
    }

    return [low, high];
}

const part1: [number, number] = [0, 0];
for (let i=0; i<1000;i++) {
    const result = pressButton();
    part1[0] += result[0]
    part1[1] += result[1];
}

console.log(`Part 1: ${part1[0] * part1[1]}`)

function resetModules() {
    modules.forEach(module => {
        if (module.type == 'flipFlop') {
            module.status = 'off';
        } else {
            Object.keys(module.status).forEach(key => module.status[key] = false)
        }
    })
}

// HARD CODED BASED ON MY INPUT
// Inspecting the input, there's a single conjunction leading to rx
// So we can just find each of the things that lead to that and find the LCM
const toCheck = modules.get('vd');

if (!toCheck || toCheck.type != 'conjunction') {
    throw new Error('Invalid input')
}

const keys = Object.keys(toCheck.status);

const cycleLengths = keys.map(key => {
    resetModules();
    targetToHit = key;
    hitTarget = false;
    let buttonCount = 0;

    while (!hitTarget) {
        buttonCount++;
        pressButton();
    }

    return buttonCount
});

console.log(`Part 2: ${lcm(cycleLengths)}`)

