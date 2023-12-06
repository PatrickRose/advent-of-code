import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {}

const input = getInput(testInputs, 11);

function incrementPassword(password: string): string {
    return (parseInt(password, 36) + 1).toString(36).replaceAll('0', 'a');
}

function meetsRequirements(password: string): boolean {
    if (['i','o','l'].some(val => password.includes(val))) {
        return false;
    }

    if (!password.match(/abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/)) {
        return false;
    }

    const repeated = password.match(/(.)\1.*(.)\2/);

    return repeated !== null && repeated[1] != repeated[2];
}

let newPassword = input;

while (!meetsRequirements(newPassword)) {
    newPassword = incrementPassword(newPassword);
}

console.log(`Part 1: ${newPassword}`);

newPassword = incrementPassword(newPassword);

while (!meetsRequirements(newPassword)) {
    newPassword = incrementPassword(newPassword);
}

console.log(`Part 2: ${newPassword}`);
