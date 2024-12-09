import getInput from "./util/getInput";
import {mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `2333133121414131402`,
    shortExample: `12345`
}

const input = getInput(testInputs, 9);

const diskPieces: (number|'.')[] = [];

type FileBlock = {
    value: number|null,
    length: number,
    moved: boolean
}

const blocks: FileBlock[] = [];
input.split('').forEach((rawVal, i)=> {
    const val = Number.parseInt(rawVal, 10);

    const toPush = i % 2 == 0 ? (i / 2) : '.';

    diskPieces.push(...Array(val).fill(toPush));

    blocks.push({
        value: toPush == '.' ? null : toPush,
        length: val,
        moved: false,
    });
});

const output = diskPieces;

let write = 0;
let read = output.length - 1;
const swaps: (number|'.')[] = [];

while (write < read) {
    if (output[write] != '.') {
        write++;
    } else if (output[read] == '.') {
        read--;
    } else {
        swaps.push(output[read]);
        output[write] = output[read];
        output[read] = '.';
        write++;
        read--;
    }
}

const part1 = mappedAccumulator(output, (val, index) => {
    if (val == '.') {
        return 0;
    }
    return val * index
});

console.log(`Part 1: ${part1}`);

const newBlocks: FileBlock[] = [];

for (const block of blocks) {
    if (block.moved) {
        // We moved this elsewhere - just ignore it
        continue;
    }

    block.moved = true;

    if (block.value != null) {
        // Then we don't need to do anything - just add it on
        newBlocks.push(block);
        continue;
    }

    // Otherwise, we have a block of empty space
    // Keep looking for something we can fit in
    const reversed = blocks.slice().reverse();
    let toAdd: FileBlock|undefined;

    while (toAdd = reversed.find(val => val.value && !val.moved && val.length <= block.length)) {
        block.length -= toAdd.length;
        const newBlock = {...toAdd, moved: true};
        toAdd.value = null;
        newBlocks.push(newBlock);
    }

    newBlocks.push(block);
}

function convertBlocksToStructure(blocks: FileBlock[]): (number|'.')[] {
    const newFileStructure: (number | '.')[] = [];

    for (const block of newBlocks) {
        for (let i = 0; i < block.length; i++) {
            newFileStructure.push(block.value ?? '.');
        }
    }

    return newFileStructure;
}

const filesystem = convertBlocksToStructure(newBlocks);

const part2 = mappedAccumulator(filesystem, (val, index) => {
    if (val == '.') {
        return 0;
    }
    return val * index
});

console.log(`Part 2: ${part2}`);
