export function accumulator(values: number[]): number {
    return values.reduce((prev, curr) => prev+curr, 0);
}

export function mappedAccumulator<T>(values: T[], mapping: (val: T, index: number) => number, initial: number = 0): number {
    return values.reduce((prev, curr, index) => prev+mapping(curr, index), initial);
}
