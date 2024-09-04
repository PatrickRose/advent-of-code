import getInput from "./util/getInput";

const testInputs = {
    example: `H => HO
H => OH
O => HH

HOH`,
    example2: `H => HO
H => OH
O => HH

HOHOHO`,
    example3: `HO => HH

HOHOHO`,
    example4: `HO => HH
OH => HH

HOHOHO`,
    partTwoExample1: `e => H
e => O
H => HO
H => OH
O => HH

HOH`,
    partTwoExample2: `e => H
e => O
H => HO
H => OH
O => HH

HOHOHO`
}

const input = getInput(testInputs, 19);

const [replacementsDef, initial] = input.split('\n\n');

type Replacement = { requiredChar: string, replacement: string };
const replacements: Replacement[] = replacementsDef
    .split('\n')
    .map((row => {
        const [requiredChar, replacement] = row.split(' => ');

        return {replacement, requiredChar}
    }));

function getMolecules(initial: string): Set<string> {
    const results: Set<string> = new Set;

    replacements
        .forEach(({requiredChar, replacement}) => {
            let position = 0;
            while ((position = initial.indexOf(requiredChar, position)) !== -1) {
                const newString = [
                    initial.substring(0, position),
                    replacement,
                    initial.substring(position + requiredChar.length),
                ].join('');

                results.add(newString);

                position++;
            }
        });

    return results;
}

console.log(`Part 1: ${getMolecules(initial).size}`);

let molecule = initial;
let steps = 0;

while (molecule != 'e') {
    for(let replacementDef of replacements) {
        const {replacement, requiredChar} = replacementDef;

        while (molecule.includes(replacement)) {
            molecule = molecule.replace(replacement, requiredChar);
            steps++;
        }
    }
}

console.log(`Part 2: ${steps}`)
