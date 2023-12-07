import getInput from "./util/getInput";

const testInputs = {
    array: '[1,2,3]',
    object: '{"a":2,"b":4}',
    nestedArray: '[[[3]]]',
    nestedObject: '{"a":{"b":4},"c":-1}',
    nestedZeroObject: '{"a":[-1,1]}',
    nestedZeroArray: '{"a":[-1,1]}',
    arrayRed: '[1,{"c":"red","b":2},3]',
}

const input = getInput(testInputs, 12);

const object: unknown = JSON.parse(input);

function countNumbers(val: unknown, ignoreRed: boolean): number {
    if (typeof val == "number") {
        return val;
    }

    if (typeof val == "string") {
        return 0;
    }

    if (typeof val == 'object') {
        const arrayOfValues = Array.isArray(val)
            ? val
            : Array.from(Object.values(val as Record<string, unknown>))

        if (ignoreRed && !Array.isArray(val) && arrayOfValues.includes('red')) {
            return 0;
        }

        return arrayOfValues.reduce((previousValue, currentValue) => previousValue + countNumbers(currentValue, ignoreRed), 0);
    }

    return 0;
}

console.log(`Part 1: ${countNumbers(object, false)}`);
console.log(`Part 2: ${countNumbers(object, true)}`);
