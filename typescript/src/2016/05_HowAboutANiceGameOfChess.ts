// I'm really not here to write an md5 implementation
import {Md5} from "ts-md5";
import getInput from "./util/getInput";

const input = getInput(5);

let password1: string = '';
const password2: { [key: number]: string } = {};

let i = 0;

do {
    const newStr = Md5.hashStr(`${input}${i}`);

    if (newStr.slice(0, 5) == '00000') {
        const newChar = newStr[5];
        if (password1.length < 8) {
            password1 += newChar;
            if (password1.length == 8) {
                console.log('Finished part 1, continuing through to part 2...');
            }
        }

        const position = Number.parseInt(newChar, 10);

        if (!isNaN(position) && position < 8 && !(position in password2)) {
            password2[position] = newStr[6];
        }
    }

    i++;
} while (password1.length < 8 || Object.keys(password2).length < 8)

console.log(`Part 1: ${password1}`);
let password2Str = '';

for (let i = 0; i < 8; i++) {
    if (!password2[i]) {
        console.error(password2);
        throw Error(`Didn't have a value for ${i}`);
    }
    password2Str += password2[i];
}

console.log(`Part 2: ${password2Str}`)
