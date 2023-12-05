import getInputBase from "../../util/getInput";

function getRealInput(day: number) {
    return getInputBase(2023, day)
}

export default function getInput<K extends string>(testInputs: Record<K, string>, day: number, inputType: (K | true) = true): string {
    if (inputType === true) {
        return getRealInput(day);
    }

    return testInputs[inputType];
}
