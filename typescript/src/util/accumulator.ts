export function accumulator(values: number[]): number {
    return values.reduce((prev, curr) => prev+curr, 0);
}
