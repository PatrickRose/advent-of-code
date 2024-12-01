import * as fs from "fs";
import { getRootDirectory } from './util/getInput';

let [year] = process.argv.slice(2);

if (year === undefined) {
    year = `${(new Date()).getFullYear()}`;
}

const yearDirectory = `${getRootDirectory()}/typescript/src/${year}`;

console.info('Creating year directory...');

if (!fs.existsSync(yearDirectory)) {
    fs.mkdirSync(yearDirectory);
}

const getInputHelper = `import getInputBase from "../../util/getInput";

function getRealInput(day: number) {
    return getInputBase(${year}, day)
}

export default function getInput<K extends string>(testInputs: Record<K, string>, day: number, inputType: (K | true) = true): string {
    if (inputType === true) {
        return getRealInput(day);
    }

    return testInputs[inputType];
}`

console.info('Creating getInput helper');

if (!fs.existsSync(`${yearDirectory}/util/getInput.ts`)) {
    if (!fs.existsSync(`${yearDirectory}/util`)) {
        fs.mkdirSync(`${yearDirectory}/util`);
    }

    fs.writeFileSync(`${yearDirectory}/util/getInput.ts`, getInputHelper);
}

const formatter = new Intl.NumberFormat(undefined, {minimumIntegerDigits:2});

for (let i=1; i<=25; i++) {
    const scaffold = `import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, ${i});`;

    const fileName = `${yearDirectory}/day${formatter.format(i)}.ts`;

    if (!fs.existsSync(fileName)) {
        console.info(`Creating day ${i}`);
        fs.writeFileSync(fileName, scaffold);
    } else {
        console.info(`Day ${i} exists`);
    }
}


console.info('Done!')
