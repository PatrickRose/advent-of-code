import getInput from "./util/getInput";

const exampleInput1 = `D2FE28`;
const exampleInput2 = `38006F45291200`;
const exampleInput3 = `EE00D40C823060`;
const exampleInput4 = `8A004A801A8002F478`;
const exampleInput5 = `C200B40A82`;
const exampleInput6 = `A0016C880162017C3686B18A3D4780`;

const realInput = getInput(16);

const input = realInput;

type Bits = ('0' | '1')[];
const bits: Bits = [];

const CHAR_TO_BITS: { [key: string]: Bits } = {
    '0': ['0', '0', '0', '0',],
    '1': ['0', '0', '0', '1',],
    '2': ['0', '0', '1', '0',],
    '3': ['0', '0', '1', '1',],
    '4': ['0', '1', '0', '0',],
    '5': ['0', '1', '0', '1',],
    '6': ['0', '1', '1', '0',],
    '7': ['0', '1', '1', '1',],
    '8': ['1', '0', '0', '0',],
    '9': ['1', '0', '0', '1',],
    'A': ['1', '0', '1', '0',],
    'B': ['1', '0', '1', '1',],
    'C': ['1', '1', '0', '0',],
    'D': ['1', '1', '0', '1',],
    'E': ['1', '1', '1', '0',],
    'F': ['1', '1', '1', '1',],
}

input.split('').forEach(
    char => {
        bits.push(...CHAR_TO_BITS[char] ?? [])
    }
)

abstract class AbstractPacket {
    constructor(protected readonly version: number) {
    }

    abstract readBits(currPos: number, data: Bits): number;

    abstract getValue(): number;

    getVersion(): number {
        return this.version;
    }

    toStr(prefix: string = ''): string {
        return `${prefix}${this.constructor.name}: ${this.getValue()}`;
    }
}

class LiteralValue extends AbstractPacket {
    private data: number = -1;

    readBits(currPos: number, data: Bits): number {
        const thisData: Bits = [];

        while (true) {
            const toAdd = data.slice(currPos, currPos + 5);
            currPos += 5;

            thisData.push(...toAdd.slice(1));

            if (toAdd[0] == '0') {
                break;
            }
        }

        this.data = Number.parseInt(thisData.join(''), 2);

        return currPos;
    }

    getValue(): number {
        return this.data;
    }
}

abstract class AbstractOperatorPacket extends AbstractPacket {
    protected subPackets: AbstractPacket[] = [];

    readBits(currPos: number, data: Bits): number {
        const lengthType = data[currPos];
        currPos += 1;

        if (lengthType == '0') {
            const numBits = Number.parseInt(data.slice(currPos, currPos + 15).join(''), 2);
            currPos += 15;

            const bitsForPacket = data.slice(currPos, currPos + numBits);
            currPos += numBits;

            this.subPackets = getPackets(bitsForPacket);
        } else {
            const numPackets = Number.parseInt(data.slice(currPos, currPos + 11).join(''), 2);
            currPos += 11;

            while (this.subPackets.length < numPackets) {
                const [next, newPos] = getNextPacket(data, currPos);
                currPos = newPos;

                if (next === null) {
                    throw Error('Did not get a packet');
                }

                this.subPackets.push(next);
            }
        }

        return currPos;
    }

    getVersion(): number {
        return this.version + this.subPackets.map(packet => packet.getVersion()).reduce(((prev, curr) => prev + curr));
    }

    toStr(prefix: string = ''): string {
        const parent = super.toStr(prefix);

        const subs = this.subPackets.map(packet => packet.toStr(`${prefix}  `));

        return parent + "\n" + subs.join("\n");
    }

    protected getValuesForSubPackets() {
        return this.subPackets.map(packet => packet.getValue());
    }
}

class SumPacket extends AbstractOperatorPacket {
    getValue(): number {
        return this.getValuesForSubPackets().reduce((previousValue, currentValue) => previousValue + currentValue);
    }
}

class ProductPacket extends AbstractOperatorPacket {
    getValue(): number {
        return this.getValuesForSubPackets().reduce((previousValue, currentValue) => previousValue * currentValue, 1);
    }
}

class MinPacket extends AbstractOperatorPacket {
    getValue(): number {
        return Math.min(...this.getValuesForSubPackets());
    }
}

class MaxPacket extends AbstractOperatorPacket {
    getValue(): number {
        return Math.max(...this.getValuesForSubPackets());
    }
}

class GreaterThan extends AbstractOperatorPacket {
    getValue(): number {
        const [first, second] = this.getValuesForSubPackets();

        return first > second ? 1 : 0;
    }
}

class LessThan extends AbstractOperatorPacket {
    getValue(): number {
        const [first, second] = this.getValuesForSubPackets();

        return first < second ? 1 : 0;
    }
}

class EqualTo extends AbstractOperatorPacket {
    getValue(): number {
        const [first, second] = this.getValuesForSubPackets();

        return first == second ? 1 : 0;
    }
}

const PACKET_MAP: Record<number,
    typeof LiteralValue
    | typeof SumPacket
    | typeof ProductPacket
    | typeof MinPacket
    | typeof MaxPacket
    | typeof GreaterThan
    | typeof LessThan
    | typeof EqualTo
> = {
    0: SumPacket,
    1: ProductPacket,
    2: MinPacket,
    3: MaxPacket,
    4: LiteralValue,
    5: GreaterThan,
    6: LessThan,
    7: EqualTo
}

function getNextPacket(bits: Bits, position: number): [AbstractPacket | null, number] {
    if (!bits.slice(position, bits.length).includes('1')) {
        return [null, bits.length];
    }

    // Otherwise we have a packet
    const version = Number.parseInt(bits.slice(position, position + 3).join(''), 2);
    position += 3;

    const type = Number.parseInt(bits.slice(position, position + 3).join(''), 2);
    position += 3;

    let constructor = PACKET_MAP[type];

    const packet = new constructor(version);
    return [
        packet, packet.readBits(position, bits)
    ];
}

function getPackets(bits: Bits): AbstractPacket[] {
    const packets: AbstractPacket[] = [];
    let position = 0;

    while (position < bits.length) {
        const [packet, newPosition] = getNextPacket(bits, position);

        position = newPosition;

        if (packet !== null) {
            packets.push(packet)
        }
    }

    return packets;
}

const packets = getPackets(bits);

console.log(packets[0].toStr());

console.log(`Part 1: ${packets.map(packet => packet.getVersion()).reduce(((previousValue, currentValue) => previousValue + currentValue))}`);
console.log(`Part 2: ${packets[0].getValue()}`);
