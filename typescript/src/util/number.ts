export function highestCommonFactor(a: number, b: number): number {
    if (b === 0) {
        return a;
    }

    return highestCommonFactor(b, a % b);
}

export function lcm(input: number[]): number {
    return input.reduce(
        (prev, curr) => {
            return (prev * curr) / highestCommonFactor(prev, curr)
        },
        1
    );
}
