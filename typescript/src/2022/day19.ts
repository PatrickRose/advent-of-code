import getInput from "./util/getInput";

const sampleInput = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

const input = getInput(19);

type BluePrint = {
    id: number,
    ore: number,
    clay: number,
    obsidian: {
        ore: number,
        clay: number
    },
    geode: {
        ore: number,
        obsidian: number
    }
}

const blueprints: BluePrint[] = input.split('\n').map(
    row => {
        const [blueprint, recipes] = row.split(': ');

        const blueprintID = Number.parseInt(blueprint.split(' ')[1]);

        const toReturn: BluePrint = {
            id: blueprintID,
            ore: 0,
            clay: 0,
            obsidian: {
                ore: 0,
                clay: 0,
            },
            geode: {
                ore: 0,
                obsidian: 0,
            }
        }

        recipes.split('. ').forEach(
            recipe => {
                const oreMatch = recipe.match(/Each ore robot costs (\d+) ore/);
                if (oreMatch) {
                    toReturn.ore = Number.parseInt(oreMatch[1], 10)
                    return;
                }

                const clayMatch = recipe.match(/Each clay robot costs (\d+) ore/);
                if (clayMatch) {
                    toReturn.clay = Number.parseInt(clayMatch[1], 10);
                }

                const obsidianMatch = recipe.match(/Each obsidian robot costs (\d+) ore and (\d+) clay/);
                if (obsidianMatch) {
                    toReturn.obsidian.ore = Number.parseInt(obsidianMatch[1]);
                    toReturn.obsidian.clay = Number.parseInt(obsidianMatch[2]);
                }

                const geodeMatch = recipe.match(/Each geode robot costs (\d+) ore and (\d+) obsidian./);
                if (geodeMatch) {
                    toReturn.geode.ore = Number.parseInt(geodeMatch[1], 10);
                    toReturn.geode.obsidian = Number.parseInt(geodeMatch[2], 10);
                }
            }
        );

        return toReturn;
    }
);

type MineralAmounts = { ore: number, clay: number, obsidian: number, geode: number };

function findMaxGeodes(
    blueprint: BluePrint,
    numMinutes: number,
    numRobots: MineralAmounts,
    mineralAmounts: MineralAmounts,
    maxMinutes: number,
    caches: Map<string, number>[]
): number {
    const cacheKey = [
        numMinutes,
        [numRobots.ore, numRobots.clay, numRobots.obsidian, numRobots.geode].join(','),
        [mineralAmounts.ore, mineralAmounts.clay, mineralAmounts.obsidian, mineralAmounts.geode].join(',')
    ].join('\n');

    for (let cache of caches) {
        const thisCache = cache.get(cacheKey);

        if (thisCache !== undefined) {
            return thisCache;
        }
    }

    let ore = blueprint.ore <= mineralAmounts.ore && numRobots.ore < Math.max(blueprint.ore, blueprint.clay, blueprint.obsidian.ore, blueprint.geode.ore);
    let clay = blueprint.clay <= mineralAmounts.ore && numRobots.clay < Math.max(blueprint.obsidian.clay);
    let obsidian = blueprint.obsidian.clay <= mineralAmounts.clay && blueprint.obsidian.ore <= mineralAmounts.ore && numRobots.obsidian < Math.max(blueprint.geode.obsidian);
    let geode = blueprint.geode.ore <= mineralAmounts.ore && blueprint.geode.obsidian <= mineralAmounts.obsidian;

    const newMineralAmounts: MineralAmounts = {
        ore: mineralAmounts.ore,
        clay: mineralAmounts.clay,
        obsidian: mineralAmounts.obsidian,
        geode: mineralAmounts.geode
    };
    Object.entries(newMineralAmounts).forEach(([key, value]) => {
        newMineralAmounts[key as keyof MineralAmounts] += numRobots[key as keyof MineralAmounts];
    });

    if (numMinutes == maxMinutes) {
        return newMineralAmounts.geode;
    }

    const options: number[] = [
        newMineralAmounts.geode + ((numMinutes - maxMinutes) * numRobots.geode)
    ];

    if (geode) {
        const afterMinerals = {
            ore: newMineralAmounts.ore,
            clay: newMineralAmounts.clay,
            obsidian: newMineralAmounts.obsidian,
            geode: newMineralAmounts.geode
        };

        afterMinerals.obsidian -= blueprint.geode.obsidian;
        afterMinerals.ore -= blueprint.geode.ore;

        options.push(findMaxGeodes(
            blueprint,
            numMinutes + 1,
            {...numRobots, geode: numRobots.geode + 1},
            afterMinerals,
            maxMinutes,
            caches
        ))
    } else {

        if (ore) {
            const afterMinerals = {
                ore: newMineralAmounts.ore,
                clay: newMineralAmounts.clay,
                obsidian: newMineralAmounts.obsidian,
                geode: newMineralAmounts.geode
            };

            afterMinerals.ore -= blueprint.ore;

            options.push(findMaxGeodes(
                blueprint,
                numMinutes + 1,
                {...numRobots, ore: numRobots.ore + 1},
                afterMinerals,
                maxMinutes,
                caches
            ))
        }

        if (clay) {
            const afterMinerals = {
                ore: newMineralAmounts.ore,
                clay: newMineralAmounts.clay,
                obsidian: newMineralAmounts.obsidian,
                geode: newMineralAmounts.geode
            };

            afterMinerals.ore -= blueprint.clay;
            options.push(findMaxGeodes(
                blueprint,
                numMinutes + 1,
                {...numRobots, clay: numRobots.clay + 1},
                afterMinerals,
                maxMinutes,
                caches
            ))
        }

        if (obsidian) {
            const afterMinerals = {
                ore: newMineralAmounts.ore,
                clay: newMineralAmounts.clay,
                obsidian: newMineralAmounts.obsidian,
                geode: newMineralAmounts.geode
            };

            afterMinerals.ore -= blueprint.obsidian.ore;
            afterMinerals.clay -= blueprint.obsidian.clay;

            options.push(findMaxGeodes(
                blueprint,
                numMinutes + 1,
                {...numRobots, obsidian: numRobots.obsidian + 1},
                afterMinerals,
                maxMinutes,
                caches
            ))
        }
        // Always add an option to not build if we aren't building a geode robot
        options.push(
            findMaxGeodes(
                blueprint,
                numMinutes + 1,
                {...numRobots},
                {...newMineralAmounts},
                maxMinutes,
                caches
            )
        )
    }

    const max = Math.max(...options);

    let set = false;

    // This is a terrible hack around the fact we end up with too many states for some blueprints
    // Clearly there should be some additional pruning so I don't hit this case
    // but I don't know what that could be
    for (let cache of caches) {
        try {
            cache.set(cacheKey, max);
            set = true;
            break;
        } catch (e) {
            // skip to the next cache
        }
    }

    if (!set) {
        const newCache = new Map();
        newCache.set(cacheKey, max);
        caches.push(newCache);
        console.log(`Adding another map, now have ${caches.length}`);
    }

    return max;
}

const results = blueprints.reduce(
    (previous, blueprint) => {
        let maxGeodes = findMaxGeodes(
            blueprint,
            1,
            {
                ore: 1,
                clay: 0,
                obsidian: 0,
                geode: 0
            },
            {
                ore: 0,
                clay: 0,
                obsidian: 0,
                geode: 0
            },
            24,
            [new Map()]
        );

        return previous + (blueprint.id * maxGeodes)
    },
    0
)

console.log(`Part 1: ${results}`);

const part2 = blueprints.slice(0, 3).reduce(
    (previous, blueprint) => {
        let maxGeodes = findMaxGeodes(
            blueprint,
            1,
            {
                ore: 1,
                clay: 0,
                obsidian: 0,
                geode: 0
            },
            {
                ore: 0,
                clay: 0,
                obsidian: 0,
                geode: 0
            },
            32,
            [new Map()]
        );

        return previous * maxGeodes
    },
    1
)

console.log(`Part 2: ${part2}`)
