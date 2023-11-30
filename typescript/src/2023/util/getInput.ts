import getInputBase from "../../util/getInput";

function getRealInput(day: number) {
    return getInputBase(2023, day)
}

export default function getInput<K extends string, T extends Record<K, string>>(testInputs: T, day: number, inputType: (K | true) = true): string {
    if (inputType === true) {
        return getRealInput(day);
    }

    return testInputs[inputType];
}
