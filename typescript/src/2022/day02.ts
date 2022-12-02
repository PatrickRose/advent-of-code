import getInput from "./util/getInput";

const sampleInput = `A Y
B X
C Z`;

const input = getInput(2);

type Option = 'rock' | 'paper' | 'scissors';

const scoreForThrow: { [K in Option]: number } = {
    rock: 1,
    paper: 2,
    scissors: 3
}

const scoreForResult = {
    lose: 0,
    draw: 3,
    win: 6
}

const results: { [K in Option]: { [K in Option]: number } } = {
    rock: {
        rock: scoreForResult.draw,
        paper: scoreForResult.win,
        scissors: scoreForResult.lose
    },
    paper: {
        rock: scoreForResult.lose,
        paper: scoreForResult.draw,
        scissors: scoreForResult.win
    },
    scissors: {
        rock: scoreForResult.win,
        paper: scoreForResult.lose,
        scissors: scoreForResult.draw
    }
};

const choices: [Option, Option][] = input.split('\n').map(
    (row) => {
        const them = row[0];
        const us = row[2];
        return [
            them == 'A' ? "rock" : (them == 'B' ? 'paper' : 'scissors'),
            us == 'X' ? "rock" : (us == 'Y' ? 'paper' : 'scissors'),
        ]
    }
)

const part1: number = choices.reduce(
    (previousValue, [them, us]) => {
        const calculated = results[them][us] + scoreForThrow[us];

        return previousValue + calculated;
    },
    0
);

console.log(`Part 1: ${part1}`)

const strategyResults: { [K in Option]: { [K in Option]: number } } = {
    rock: {
        rock: scoreForThrow.scissors + scoreForResult.lose,
        paper: scoreForThrow.rock + scoreForResult.draw,
        scissors: scoreForThrow.paper + scoreForResult.win
    },
    paper: {
        rock: scoreForThrow.rock + scoreForResult.lose,
        paper: scoreForThrow.paper + scoreForResult.draw,
        scissors: scoreForThrow.scissors + scoreForResult.win
    },
    scissors: {
        rock: scoreForThrow.paper + scoreForResult.lose,
        paper: scoreForThrow.scissors + scoreForResult.draw,
        scissors: scoreForThrow.rock + scoreForResult.win
    }
};


const part2: number = choices.reduce(
    (previousValue, [them, us]) => {
        return previousValue + strategyResults[them][us];
    },
    0
);

console.log(`Part 2: ${part2}`);
