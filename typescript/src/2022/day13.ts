import getInput from "./util/getInput";

const sampleInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const input = getInput(13);

type Packet = (Packet | number)[] | number;

const packets: [Packet, Packet][] = input.split('\n\n').map(
    (row) => {
        const [first, second] = row.split('\n');

        return [
            JSON.parse(first),
            JSON.parse(second),
        ]
    }
)

function comparePacket(left: Packet, right: Packet): boolean|undefined {
    const leftIsNumber = typeof left == 'number';
    const rightIsNumber = typeof right == 'number';

    if (leftIsNumber && rightIsNumber) {
        if (left == right) {
            return undefined;
        }

        return left < right;
    }

    if (leftIsNumber && !rightIsNumber) {
        return comparePacket([left], right);
    }

    if (!leftIsNumber && rightIsNumber) {
        return comparePacket(left, [right]);
    }

    if (!leftIsNumber && !rightIsNumber) {
        for (let i = 0; i < left.length; i++) {
            const first = left[i];
            const second = right[i];

            if (second === undefined) {
                return false;
            }

            const compare = comparePacket(first, second);

            if (compare !== undefined) {
                return compare;
            }
        }

        if (left.length == right.length) {
            return undefined
        } else {
            return true;
        }
    } else {
        throw Error('Should never hit this line - typechecker just can\'t see it');
    }
}

const indexes = packets.map(([left, right], index) => comparePacket(left, right) ? index + 1 : 0);

console.log(`Part 1: ${indexes.reduce((a, b) => a+b, 0)}`);

const partTwoPackets: Packet[] = [[[2]],[[6]]];

packets.forEach(([first, second]) => {
    partTwoPackets.push(first);
    partTwoPackets.push(second);
})

partTwoPackets.sort((a, b) => {
    const result = comparePacket(a, b);

    if (result === undefined) {
        return 0;
    }

    return result ? -1 : 1;
})

let partTwo = 1;

partTwoPackets.forEach((packet, index) => {
    let stringify = JSON.stringify(packet);
    if ((stringify == '[[2]]') || (stringify == '[[6]]')) {
        partTwo *= (index + 1);
    }
})

console.log(`Part 2: ${partTwo}`);
