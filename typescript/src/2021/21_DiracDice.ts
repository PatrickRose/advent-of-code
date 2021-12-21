import getInput from "./util/getInput";

const exampleInput = `Player 1 starting position: 4
Player 2 starting position: 8`;

const realInput = getInput(21);

const input = realInput;

let dieRolls = 0;

let [player1Score, player2Score] = [0, 0];
let player1Pos = Number.parseInt(input.split("\n")[0].split(': ')[1], 10);
let player2Pos = Number.parseInt(input.split("\n")[1].split(': ')[1], 10);

type Game = {
    player1: {
        position: number,
        score: number
    },
    player2: {
        position: number,
        score: number
    },
    player1Turn: boolean
};

const baseGame: Game = {
    player1: {
        position: player1Pos,
        score: 0,
    },
    player2: {
        position: player2Pos,
        score: 0
    },
    player1Turn: true,
};

let player1Turn = true;
console.log({player1Pos, player1Score, player2Pos, player2Score, dieRolls});

while (player1Score < 1000 && player2Score < 1000) {
    // Roll the dice 3 times
    const rolls = [++dieRolls, ++dieRolls, ++dieRolls,].map(val => {
        const newVal = val % 100;
        return newVal == 0 ? 100 : newVal;
    });
    const sum = rolls.reduce((previousValue, currentValue) => previousValue + currentValue);

    if (player1Turn) {
        player1Pos = (player1Pos + sum) % 10;

        if (player1Pos == 0) {
            player1Pos = 10;
        }

        player1Score += player1Pos;

        console.log(`Player 1 rolled ${rolls.join('+')} and moved to ${player1Pos} for a total score of ${player1Pos}`);
    } else {
        player2Pos = (player2Pos + sum) % 10;

        if (player2Pos == 0) {
            player2Pos = 10;
        }

        player2Score += player2Pos;

        console.log(`Player 2 rolled ${rolls.join('+')} and moved to ${player2Pos} for a total score of ${player2Pos}`);
    }

    player1Turn = !player1Turn;
}

console.log({player1Score, player2Score, dieRolls});

console.log(`Part 1: ${Math.min(player1Score, player2Score) * dieRolls}`);

const cache = new Map<string, [bigint, bigint]>();

function cacheStrForGame({player1, player2, player1Turn}: Game): string {
    return `player1:[${player1.position},${player1.score}];player2:[${player2.position},${player2.score}];${player1Turn ? '1' : '2'}`
}

function winCounts(currentGame: Game): [bigint, bigint] {
    if (currentGame.player1.score >= 21) {
        return [1n, 0n];
    }
    if (currentGame.player2.score >= 21) {
        return [0n, 1n];
    }

    // We roll the dice 3 times
    // So there's not that many options for the values
    const dieRolls = [
        [3, 1],
        [4, 3],
        [5, 6],
        [6, 7],
        [7, 6],
        [8, 3],
        [9, 1]
    ];

    return dieRolls.map(([dieCount, amount]): [bigint, bigint] => {
        const player1: Game["player1"] = {
            position: currentGame.player1.position,
            score: currentGame.player1.score,
        };
        const player2: Game["player2"] = {
            position: currentGame.player2.position,
            score: currentGame.player2.score,
        };

        if (currentGame.player1Turn) {
            player1.position = (player1.position + dieCount) % 10;

            if (player1.position == 0) {
                player1.position = 10;
            }

            player1.score += player1.position;
        } else {
            player2.position = (player2.position + dieCount) % 10;

            if (player2.position == 0) {
                player2.position = 10;
            }

            player2.score += player2.position;
        }

        const copiedGame: Game = {
            player1,
            player2,
            player1Turn: !currentGame.player1Turn
        };

        const key = cacheStrForGame(copiedGame);
        const cachedValues = cache.get(key);

        const [first, second] = cachedValues ?? winCounts(copiedGame);

        if (!cachedValues) {
            cache.set(key, [first, second]);
        }

        return [first * BigInt(amount), second * BigInt(amount)];
    }).reduce((previousValue, currentValue) => [previousValue[0] + currentValue[0], previousValue[1] + currentValue[1]]);
}

const [first, second] = winCounts(baseGame);

console.log(`Part 2: ${first > second ? first : second}`);
