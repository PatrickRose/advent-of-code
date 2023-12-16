export function getMaxXAndYFromStr(input: string): { maxX: number, maxY: number } {
    const maxY = input.split('\n').length;
    const maxX = input.split('\n')[0].length;

    return {maxX, maxY}
}
