import getInput from "./util/getInput";
import {getAdjacentPoints} from "../util/points";

const exampleInput = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`;

const realInput = getInput(20);

const input = realInput;

const [enhancement, origImage] = input.split("\n\n");

let image = new Map<number, Map<number, boolean>>();

origImage.split('\n').forEach(
    (row, y) => {
        const rowMap = new Map<number, boolean>();
        image.set(y, rowMap)
        row.split('').forEach(
            (char, x) => {
                rowMap.set(x, char == '#');
            }
        )
    }
);

function getMinMaxes(image: Map<number, Map<number, boolean>>) {
    const yValues = Array.from(image.keys());
    const xValues = yValues.map(y => Array.from(image.get(y)?.keys() ?? [])).flat();

    const [minY, maxY] = [Math.min(...yValues), Math.max(...yValues),];
    const [minX, maxX] = [Math.min(...xValues), Math.max(...xValues),];
    return {minY, maxY, minX, maxX};
}

function enhanceImage(image: Map<number, Map<number, boolean>>, enhancement: string, defaultValue: boolean): Map<number, Map<number, boolean>> {
    // Get the min/max x,y
    const {minY, maxY, maxX, minX} = getMinMaxes(image);
    const newImage = new Map<number, Map<number, boolean>>();

    for (let y = minY - 1; y <= maxY + 1; y++) {
        const row = new Map<number, boolean>();
        newImage.set(y, row);

        for (let x = minX - 1; x <= maxX + 1; x++) {
            const adjacentPoints = getAdjacentPoints(x, y);
            adjacentPoints.push({x, y});

            adjacentPoints.sort((a, b) => {
                if (a.y == b.y) {
                    return a.x - b.x
                }
                return a.y - b.y;
            });

            const binaryString = adjacentPoints.map(({
                                                         x,
                                                         y
                                                     }) => (image.get(y)?.get(x) ?? defaultValue) ? '1' : '0').join('');

            const binary = Number.parseInt(binaryString, 2);

            row.set(x, enhancement[binary] == '#');
        }
    }

    return newImage;
}

function imageToStr(image: Map<number, Map<number, boolean>>): string {
    const rows = [];
    const {minY, maxY, maxX, minX} = getMinMaxes(image);
    for (let y = minY - 1; y <= maxY + 1; y++) {
        const row = [];

        for (let x = minX - 1; x <= maxX + 1; x++) {
            row.push(`${image.get(y)?.get(x) ? '#' : '.'}`)
        }
        rows.push(row.join(''));
    }

    return rows.join('\n');
}

let defaultValue = false;

function getLitPixels(image: Map<number, Map<number, boolean>>): number {
    return Array.from(image.values()).map(
        val => Array.from(val.values()).filter(pixel => pixel).length
    ).reduce((previousValue, currentValue) => previousValue + currentValue);
}

for (let day = 0; day < 50; day++) {
    if (day == 2) {
        console.log(`Part 1: ${(getLitPixels(image))}`)
    }

    image = enhanceImage(image, enhancement, defaultValue);
    if (day == 0) {
        defaultValue = enhancement[0] == '#'
    } else {
        defaultValue = enhancement[defaultValue ? 511 : 0] == '#'
    }
}
console.log(`Part 2: ${(getLitPixels(image))}`)

