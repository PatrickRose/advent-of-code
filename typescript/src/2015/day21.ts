import getInput from "./util/getInput";

const testInputs = {}

const input = getInput(testInputs, 21);

type Equipment = {
    cost: number,
    damage: number,
    armor: number
}

type Stats = {
    hp: number,
    damage: number,
    armor: number
}

const stats = input.split('\n').map(row => Number.parseInt(row.split(': ')[1]));

const bossStats: Stats = {
    hp: stats[0],
    damage: stats[1],
    armor: stats[2]
}

const weapons: Equipment[] = [
    {cost: 8, damage: 4, armor: 0},
    {cost: 10, damage: 5, armor: 0},
    {cost: 25, damage: 6, armor: 0},
    {cost: 40, damage: 7, armor: 0},
    {cost: 74, damage: 8, armor: 0},
];

const weaponOptions: Equipment[][] = []
weapons.forEach((val) => {
    weaponOptions.push([val]);
})

const armors: Equipment[] = [
    {cost: 13, damage: 0, armor: 1},
    {cost: 31, damage: 0, armor: 2},
    {cost: 53, damage: 0, armor: 3},
    {cost: 75, damage: 0, armor: 4},
    {cost: 102, damage: 0, armor: 5},
]

const armorOptions: Equipment[][] = [[]]
armors.forEach((val) => {
    armorOptions.push([val]);
})

const rings: Equipment[] = [
    {cost: 25, damage: 1, armor: 0},
    {cost: 50, damage: 2, armor: 0},
    {cost: 100, damage: 3, armor: 0},
    {cost: 20, damage: 0, armor: 1},
    {cost: 40, damage: 0, armor: 2},
    {cost: 80, damage: 0, armor: 3},
];

const ringOptions: Equipment[][] = [[]];
rings.forEach((a, aIndex) => {
    ringOptions.push([a]);
    rings.forEach((b, bIndex) => {
        if (bIndex > aIndex) {
            ringOptions.push([a, b]);
        }
    })
});

const options: Equipment[][] = [];

weaponOptions.forEach(weapon => {
    armorOptions.forEach(armor => {
        ringOptions.forEach(ring => {
            options.push([...weapon, ...armor, ...ring])
        })
    })
});

function runCombat(us: Stats, boss: Stats|null = null): boolean {
    if (boss === null) {
        boss = {...bossStats}
    }

    let turn = 1;

    while (true) {
        const target = turn % 2 == 1 ? boss : us;
        const attacker = turn % 2 != 1 ? boss : us;

        target.hp -= Math.max(1, attacker.damage - target.armor);

        if (target.hp <= 0) {
            return turn % 2 == 1;
        }

        turn++;
    }
}

const results = options.map((val) => {
    const stats = {
        hp: 100,
        damage: val.reduce((prev, curr) => prev + curr.damage, 0),
        armor: val.reduce((prev, curr) => prev + curr.armor, 0),
    }

    return {
        result: runCombat(stats),
        cost: val.reduce((prev, curr) => prev + curr.cost, 0)
    }
})

const partOne = results
    .filter(val => val.result)
    .reduce(
        (a, {cost}) => {
            return Math.min(a, cost)
        },
        Infinity
    );

console.log(`Part 1: ${partOne}`);

const partTwo = results
    .filter(val => !val.result)
    .reduce(
        (a, {cost}) => {
            return Math.max(a, cost)
        },
        -Infinity
    );

console.log(`Part 2: ${partTwo}`);
