import getInput from "./util/getInput";
import {accumulator, mappedAccumulator} from "../util/accumulator";

const testInputs = {
    example: `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`
}

const input = getInput(testInputs, 8);

type Node = {
    childNodes: Node[],
    metadata: number[],
    value: number|null
}

const data = input.split(' ').map(val => Number.parseInt(val, 10));

function makeNode(input: number[]): Node {
    const node: Node = {
        childNodes: [],
        metadata: [],
        value: null
    }

    const childCount = input.shift();

    if (childCount === undefined) {
        throw new Error('Unable to get child count');
    }

    const metaCount = input.shift();

    if (metaCount === undefined) {
        throw new Error('Unable to get meta count');
    }

    for (let i=0; i<childCount; i++) {
        node.childNodes.push(makeNode(input));
    }

    for (let i=0; i<metaCount; i++) {
        const meta = input.shift();

        if (meta === undefined) {
            throw new Error(`Failed to get metadata ${i+1}`);
        }

        node.metadata.push(meta);
    }

    return node;
}

const node = makeNode(data)

function getMetadataValue(node: Node): number {
    return accumulator(node.metadata) + mappedAccumulator(node.childNodes, getMetadataValue)
}

console.log(`Part 1: ${getMetadataValue(node)}`);

function getValueOfNode(node: Node): number {
    if (node.value === null) {
        if (node.childNodes.length == 0) {
            node.value = accumulator(node.metadata);
        } else {
            node.value = mappedAccumulator(node.metadata, (val) => {
                if (val > node.childNodes.length) {
                    return 0;
                }

                return getValueOfNode(node.childNodes[val - 1]);
            })
        }
    }

    return node.value;
}

console.log(`Part 2: ${getValueOfNode(node)}`);
