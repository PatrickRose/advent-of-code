import getInput from "./util/getInput";

const input = getInput(2);

type Position = [number, number];
let position: Position = [1, 1];
type KeyPad = { [key: string]: string };

function decode(keyPad: KeyPad): string {
    let position: Position;

    for (let value in keyPad) {
        if (keyPad[value] == "5") {
            console.log(value);
            const [x, y] = value.split(',').map(val => Number.parseInt(val, 10));
            position = [x, y];
        }
    }

    return input.split('\n').map((value): string => {
        value.trim().split("").forEach(char => {
            let [x, y] = position;
            switch (char) {
                case "U":
                    y--;
                    break;
                case "D":
                    y++;
                    break;
                case "L":
                    x--;
                    break;
                case "R":
                    x++;
                    break;
                default:
                    throw Error(`Got ${char}`);
            };

            const newPos = `${x},${y}`;

            if (newPos in keyPad) {
                position = [x, y];
            }
        });
        const [x, y] = position;
        const posStr = `${x},${y}`;

        if (keyPad.hasOwnProperty(posStr)) {
            return keyPad[posStr];
        }

        throw Error(`Got ${posStr} which doesn't exist?`);

    }).join("");

}

const part1 = decode(
    {
        "0,0": "1", "1,0": "2", "2,0": "3", "0,1": "4", "1,1": "5", "2,1": "6", "0,2": "7", "1,2": "8", "2,2": "9",
    }
)
const part2 = decode(
    {
        "2,0": "1",
        "1,1": "2",
        "2,1": "3",
        "3,1": "4",
        "0,2": "5",
        "1,2": "6",
        "2,2": "7",
        "3,2": "8",
        "4,2": "9",
        "1,3": "A",
        "2,3": "B",
        "3,3": "C",
        "2,4": "D",
    }
)

console.log(`Part 1: ${part1}`);
console.log(`Part 2: ${part2}`);
