import getInput from "./util/getInput";
import {accumulator} from "../util/accumulator";
import parseInt from "../util/parseInt";

const testInputs = {
    hash: 'HASH',
    example: 'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7'
}

const input = getInput(testInputs, 15);

const sections = input.split(',');

function hashAlgorithm(input: string): number {
    let toReturn = 0;

    input.split('').forEach(char => {
        toReturn += char.charCodeAt(0);
        toReturn *= 17;
        toReturn = toReturn % 256;
    })

    return toReturn;
}

const part1 = sections.map(hashAlgorithm)

console.log(`Part 1: ${accumulator(part1)}`)

const lensBoxes: { label: string, lens: number }[][] = [];

for (let i = 0; i < 256; i++) {
    lensBoxes.push([]);
}

sections.forEach(section => {
    const [label, action] = section.split(/[=-]/);

    const boxNumber = hashAlgorithm(label);

    if (action == '') {
        // Then we need to remove the box
        lensBoxes[boxNumber] = lensBoxes[boxNumber].filter(val => val.label != label);
    } else {
        const lens = parseInt(action);

        const box = lensBoxes[boxNumber];
        const exists = box.find(val => val.label == label);

        if (exists) {
            exists.lens = lens;
        } else {
            box.push({label, lens});
        }
    }
});

const part2 = lensBoxes.map((val, boxNum) => {
    return val.reduce(
        (prev, {lens}, index) => {
            let valOfLens =  (boxNum + 1) * (index + 1) * lens;

            return prev+valOfLens;
        },
        0
    )
})

console.log(`Part 2: ${accumulator(part2)}`);
