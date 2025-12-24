import getInput from "./util/getInput";
import {getValueFromCache} from "../util/cache";

const testInputs = {
    example: `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
    part2: `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
you: svr`
}

const input = getInput(testInputs, 11);

const mappings: Record<string, string[]> = Object.fromEntries(
    input.split('\n').map(row => {
        const [key, outputs] = row.split(': ');

        return [key, outputs.split(' ')];
    })
);

function numberOfPaths(from: string, requires: string[] = []): number {
    const cache: Map<string, number> = new Map;

    function getPaths(position: string, requires: string[]): number {
        if (position == 'out') {
            return requires.length == 0 ? 1 : 0;
        }

        return getValueFromCache(
            `${position}:${requires.join(',')}`,
            () => {
                const paths = mappings[position]
                    .map(val => getPaths(val, requires.filter(req => val != req)))
                    .filter(val => val > 0)

                if (paths.length == 0) {
                    return 0
                }

                return paths.reduce((prev, curr) => prev+curr);
            },
            cache
        )
    }

    return getPaths(from, requires);
}

console.log(`Part 1: ${numberOfPaths('you')}`)

console.log(`Part 2: ${numberOfPaths('svr', ['fft', 'dac'])}`)
