import getInput from "./util/getInput";
import {Md5} from "ts-md5";

const testInputs = {}

const input = getInput(testInputs, 4);

let answers: { 1: null|number, 2:null|number  } = {1:null, 2: null};

for(let i=0; answers[1] === null || answers[2] === null; i++) {
    const hash = Md5.hashAsciiStr(`${input}${i}`);

    if (answers["1"] === null && hash.substring(0, 5) == '00000') {
        answers[1] = i;
    }

    if (answers["2"] === null && hash.substring(0, 6) == '000000') {
        answers[2] = i;
    }
}

console.log(`Part 1: ${answers[1]}`);
console.log(`Part 2: ${answers[2]}`);
