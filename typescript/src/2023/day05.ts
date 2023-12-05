import getInput from "./util/getInput";
import parseInt from "../util/parseInt";

const testInputs = {
    example: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`
}

const input = getInput(testInputs, 5);

type MapDefinition = {
    dest: number,
    source: number,
    range: number
};

const seeds: number[] = [];
const seedToSoil: MapDefinition[] = [];
const seedToFertilizer: MapDefinition[] = [];
const fertilizerToWater: MapDefinition[] = [];
const waterToLight: MapDefinition[] = [];
const lightToTemperature: MapDefinition[] = [];
const temperatureToHumidity: MapDefinition[] = [];
const humidityToLocation: MapDefinition[] = [];

function getMappedValue(val: number, map: MapDefinition[]): number {
    for (let {source, range, dest} of map) {
        if (val < source) {
            continue;
        }

        const diff = val - source;

        if (diff > range) {
            continue;
        }

        return dest + diff;
    }


    return val;
}

function getReverseMappedValue(val: number, map: MapDefinition[]): number {
    for (let {source, range, dest} of map) {
        if (val < dest) {
            continue;
        }

        const diff = val - dest;

        if (diff > range) {
            continue;
        }

        return source + diff;
    }


    return val;
}

input.split('\n\n').forEach(section => {
    if (section.match(/^seeds:( \d+)+$/)) {
        seeds.push(...section.split(' ').slice(1).map(val => parseInt(val)));
        return;
    }

    const definition = section.split('\n');
    const mapDef = definition[0];
    const vals = definition.slice(1);
    const map = {
        'seed-to-soil map:': seedToSoil,
        'soil-to-fertilizer map:': seedToFertilizer,
        'fertilizer-to-water map:': fertilizerToWater,
        'water-to-light map:': waterToLight,
        'light-to-temperature map:': lightToTemperature,
        'temperature-to-humidity map:': temperatureToHumidity,
        'humidity-to-location map:': humidityToLocation
    }[mapDef];

    if (map === undefined) {
        throw new Error(`Unknown map ${mapDef}`);
    }

    vals.forEach(row => {
        const [dest, source, range] = row.split(' ').map(val => parseInt(val));
        map.push({dest, source, range});
    });
});

const order = [
    seedToSoil,
    seedToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation
];

function getMinLocation(seeds: number[]): number {
    const locations = seeds.map(seedVal => {
        let location = seedVal;
        order.forEach(map => {
            location = getMappedValue(location, map)
        });

        return location;
    });

    return Math.min(...locations);
}

function runReverse(value: number): number {
    return order.slice().reverse().reduce((prev, curr) => getReverseMappedValue(prev, curr), value)
}

console.log(`Part 1: ${getMinLocation(seeds)}`);

const seedDefs: { start: number, length: number }[] = [];

while (seeds.length) {
    const [start, length] = seeds.slice(0, 2);
    seeds.shift();
    seeds.shift();
    seedDefs.push({start, length});
}

let part2 = 0;
let part2Val = runReverse(part2)

while (!seedDefs.some(
    ({start, length}) => {
        if (part2Val < start) {
            return false;
        }

        return part2Val - start < length;
    }
)) {
    part2++;
    part2Val = runReverse(part2);
}

console.log(`Part 2: ${part2}`);
