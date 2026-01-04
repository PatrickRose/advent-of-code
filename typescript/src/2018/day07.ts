import getInput from "./util/getInput";

const testInputs = {
    example: `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`
}

const input = getInput(testInputs, 7);

const requirements: Record<string, Set<string>> = {};
const steps: Set<string> = new Set;

input.split('\n').forEach((val) => {
    const matches = val.match(/Step (.) must be finished before step (.) can begin/);

    if (!matches) {
        throw new Error(`Invalid input ${val}`);
    }

    const pre = matches[1];
    const post = matches[2];

    if (!requirements[post]) {
        requirements[post] = new Set;
    }

    requirements[post].add(pre);
    steps.add(pre);
    steps.add(post);
});

function findAvailableSteps(completedSet: Set<string>): string[] {
    const possible: string[] = [];

    for (const step of steps) {
        if (completedSet.has(step)) {
            continue;
        }

        const requirementsForStep = requirements[step] ?? new Set();

        if (requirementsForStep.isSubsetOf(completedSet)) {
            possible.push(step);
        }
    }

    possible.sort();

    return possible;
}

function part1(): string {
    const completed: string[] = [];

    while (completed.length != steps.size) {
        // Find which steps are available
        const completedSet = new Set(completed);
        const possible = findAvailableSteps(completedSet);

        completed.push(possible[0]);
    }

    return completed.join('');
}

console.log(`Part 1: ${part1()}`)

function calculateTaskLength(toAdd: string, includeExtraTime: boolean) {
    return toAdd.charCodeAt(0)
        - 64 // 65 is A
        + (includeExtraTime ? 60: 0)
     ;
}

function part2(numWorkers: number, includeExtraTime: boolean): number {
    const completed: Set<string> = new Set;
    let workingOn: { step: string, left: number }[] = [];

    let currSecond = 0;

    while (completed.size != steps.size) {
        // Find which steps have now been completed
        const nowCompleted = workingOn.filter(
            ({left}) => left == 0
        );

        nowCompleted.forEach((val) => completed.add(val.step));
        workingOn = workingOn.filter(
            ({left}) => left > 0
        );

        const inProgress = workingOn.map(({step}) => step);

        const couldDo = findAvailableSteps(completed);

        while (workingOn.length < numWorkers) {
            const toAdd = couldDo.shift();

            if (!toAdd) {
                break;
            }

            if (inProgress.includes(toAdd)) {
                continue;
            }

            workingOn.push({
                step: toAdd,
                left: calculateTaskLength(toAdd, includeExtraTime)
            })
        }

        if (workingOn.length == 0) {
            continue;
        }

        workingOn.sort(({left: a}, {left: b}) => a-b);
        const toAdd = workingOn[0].left;
        workingOn = workingOn.map(({step, left}) => {
            return {
                step,
                left: left-toAdd
            }
        });

        currSecond += toAdd;
    }

    return currSecond;
}

const isExample = input == testInputs.example;

console.log(`Part 2: ${part2(isExample ? 2 : 5, !isExample)}`)
