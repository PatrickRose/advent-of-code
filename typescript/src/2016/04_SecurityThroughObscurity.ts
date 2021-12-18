import getInput from "./util/getInput";

const input = getInput(4);

class Room {
    constructor(private readonly name: string, public readonly id: number, private readonly checksum: string) {
    }

    public isValid(): boolean {
        const charCounts: { char: string, count: number }[] = [];
        this.name.split('').forEach(char => {
            if (char == '-') {
                return;
            }

            const existing = charCounts.find(value => value.char == char);

            if (existing) {
                existing.count++;
            } else {
                charCounts.push({
                    char: char,
                    count: 1
                });
            }
        });

        charCounts.sort((a, b) => {
            if (a.count == b.count) {
                return a.char.localeCompare(b.char);
            }

            return b.count - a.count;
        });

        const actualSum = charCounts.slice(0, 5).map(val => val.char);
        const checkSum = this.checksum.split('');
        actualSum.sort();
        checkSum.sort();

        return actualSum.join('') == checkSum.join('');
    }

    public decryptedName(): string {
        return this.name.split('').map(
            (char): string => {
                if (char == '-') {
                    return ' ';
                }

                const baseCodePoint = char.codePointAt(0);

                if (!baseCodePoint) {
                    throw Error('Should never happen');
                }

                const currentAlphaPos = baseCodePoint - 97;
                const newAlphaPos = (currentAlphaPos + this.id) % 26;
                return String.fromCharCode(newAlphaPos + 97);
            }
        ).join('');
    }
}

const rooms: Room[] = input.split("\n").map(
    row => {
        const match = row.match(/(.+)-(\d+)\[(.+)\]/);

        if (!match) {
            throw Error(`${row} didn't look like a room?`);
        }

        return new Room(match[1], Number.parseInt(match[2], 10), match[3])
    }
)

const validRooms = rooms.filter(room => room.isValid());

console.log(`Part 1: ${validRooms.reduce((previous, current) => previous + current.id, 0)}`);

const northPoleObjectStorage = validRooms.find(room => room.decryptedName() == 'northpole object storage');

if (!northPoleObjectStorage) {
    throw Error(`Didn't find northpole object storage!`);
}

console.log(`Part 2: ${northPoleObjectStorage.id}`);
