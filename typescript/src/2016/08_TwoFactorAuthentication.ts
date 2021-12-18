import getInput from "./util/getInput";

const input = getInput(8);

const lights: boolean[][] = []

const SCREEN_WIDTH = 50;
const SCREEN_HEIGHT = 6;
for (let i = 0; i < SCREEN_HEIGHT; i++) {
    const a = [];
    for (let x = 0; x < SCREEN_WIDTH; x++) {
        a.push(false);
    }
    lights.push(a);
}

const INSTRUCTIONS: [RegExp, (regexMatch: RegExpMatchArray) => void][] = [
    [
        /rect (\d+)x(\d+)/,
        regexMatch => {
            const [x, y] = [regexMatch[1], regexMatch[2]].map(val => Number.parseInt(val, 10));
            for (let y1 = 0; y1 < y; y1++) {
                for (let x1 = 0; x1 < x; x1++) {
                    lights[y1][x1] = true;
                }
            }
        }
    ],
    [
        /rotate column x=(\d+) by (\d+)/,
        regexMatch => {
            const [x, amount] = [regexMatch[1], regexMatch[2]].map(val => Number.parseInt(val, 10));

            const column = lights.map(row => row[x]);

            column.forEach(
                (val, index) => {
                    const newIndex = (index + amount) % SCREEN_HEIGHT;
                    lights[newIndex][x] = val;
                }
            )
        }
    ],
    [
        /rotate row y=(\d+) by (\d+)/,
        regexMatch => {
            const [y, amount] = [regexMatch[1], regexMatch[2]].map(val => Number.parseInt(val, 10));

            lights[y] = lights[y].map(
                (val, index, list) => {
                    const newIndex = (SCREEN_WIDTH + index - amount) % SCREEN_WIDTH;

                    return list[newIndex];
                }
            );
        }
    ]
]
console.log(lights.map(row => row.map(val => val ? '#' : '.').join('')).join('\n'));

input.split("\n").forEach(
    row => {
        for (let [regex, instruction] of INSTRUCTIONS) {
            const match = row.match(regex);

            if (match) {
                instruction(match);
                break;
            }
        }
    }
);

console.log(`Part 1: ${lights.reduce((previousValue, currentValue) => previousValue + currentValue.filter(val => val).length, 0)}`)
console.log(`Part 2:\n${lights.map(row => row.map(val => val ? '#' : '.').join('')).join('\n')}`)
