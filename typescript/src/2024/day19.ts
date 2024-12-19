import getInput from "./util/getInput";

const testInputs = {
    example: `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`
}

const input = getInput(testInputs, 19);

const [towelParse, designParse] = input.split('\n\n');

const towels = towelParse.split(', ');
const designs = designParse.split('\n');

function isValidDesign(design: string, cache: Map<string, boolean> = new Map): boolean {
    const cacheVal = cache.get(design);

    if (cacheVal !== undefined) {
        return cacheVal;
    }

    const calculateResult = () => {
        for (const towel of towels) {
            if (design.startsWith(towel)) {
                const newDesign = design.slice(towel.length);
                if (newDesign == '') {
                    return true;
                }
                if (isValidDesign(newDesign, cache)) {
                    return true;
                }
            }
        }


        return false;
    };

    const result = calculateResult();

    cache.set(design, result);

    return result;
}

const validDesigns = designs.filter(val => isValidDesign(val)).length;
console.log(`Part 1: ${validDesigns}`);

function numberOfWays(design: string, cache: Map<string, bigint> = new Map): bigint {
    const cacheVal = cache.get(design);

    if (cacheVal !== undefined) {
        return cacheVal;
    }

    let result = 0n;

    for (const towel of towels) {
        if (design.startsWith(towel)) {
            const newDesign = design.slice(towel.length);
            if (newDesign == '') {
                result += 1n;
            } else {
                result += numberOfWays(newDesign, cache);
            }
        }
    }


    cache.set(design, result);

    return result;
}

const part2 = designs.map((val) => numberOfWays(val)).reduce((prev, curr) => prev+curr);

console.log(`Part 2: ${part2}`);
