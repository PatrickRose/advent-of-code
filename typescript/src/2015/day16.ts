import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, 16);

type Sue = Record<string, number>;
const MFCSAMSue: Sue = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
}

const sues = input.split('\n')
    .map(val => {
        const match = val.match(/(Sue \d+): (.+)/);

        if (!match) {
            throw new Error(`${val} is not valid`);
        }

        const sueNumber = match[1];
        const details = match[2];

        const sue: Sue = {};

        details.split(',').forEach((val) => {

            const [key, value] = val.trim().split(':');

            sue[key] = Number.parseInt(value, 10);
        })

        return {sueNumber, sue};
    });

const part1Sue = sues.find(({sue}) => {
    return Object.entries(sue).every(([key, value]) => MFCSAMSue[key] == value
    )
});

if (!part1Sue) {
    throw new Error('Did not find a Sue for part 1')
}

console.log(`Part 1: ${part1Sue.sueNumber}`);

const part2Sue = sues.find(({sue}) => {
    return Object.entries(sue).every(([key, value]) => {
            if (key == 'cats' || key == 'trees') {
                return value > MFCSAMSue[key]
            } else if (key == 'pomeranians' || key == 'goldfish') {
                return value < MFCSAMSue[key]
            }
            return MFCSAMSue[key] == value
        }
    )
});

if (!part2Sue) {
    throw new Error('Did not find a Sue for part 2')
}

console.log(`Part 2: ${part2Sue.sueNumber}`);
