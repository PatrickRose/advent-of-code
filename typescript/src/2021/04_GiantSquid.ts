import getInput from "./util/getInput";

const input = getInput(4);

const split = input.split("\n\n");

const numbers = split[0];

type BingoCell = {
    number: number,
    seen: boolean,
}

type BingoBoard = [
    [BingoCell, BingoCell, BingoCell, BingoCell, BingoCell],
    [BingoCell, BingoCell, BingoCell, BingoCell, BingoCell],
    [BingoCell, BingoCell, BingoCell, BingoCell, BingoCell],
    [BingoCell, BingoCell, BingoCell, BingoCell, BingoCell],
    [BingoCell, BingoCell, BingoCell, BingoCell, BingoCell],
]

let hasGotLineCount = 0;

class Board {
    private bingoBoard: BingoBoard;
    private hasGotLine: number | null = null;

    constructor(input: string) {
        const bingoBoard: BingoBoard = [
            [{number: -1, seen: false}, {number: -1, seen: false}, {number: -1, seen: false}, {
                number: -1,
                seen: false
            }, {number: -1, seen: false},],
            [{number: -1, seen: false}, {number: -1, seen: false}, {number: -1, seen: false}, {
                number: -1,
                seen: false
            }, {number: -1, seen: false},],
            [{number: -1, seen: false}, {number: -1, seen: false}, {number: -1, seen: false}, {
                number: -1,
                seen: false
            }, {number: -1, seen: false},],
            [{number: -1, seen: false}, {number: -1, seen: false}, {number: -1, seen: false}, {
                number: -1,
                seen: false
            }, {number: -1, seen: false},],
            [{number: -1, seen: false}, {number: -1, seen: false}, {number: -1, seen: false}, {
                number: -1,
                seen: false
            }, {number: -1, seen: false},],
        ];

        const rows = input.split("\n");

        rows.forEach((row, rowNum) => {
            row.trim().split(/\s+/).forEach((cell, colNum) => {
                const val: number = Number.parseInt(cell, 10);

                if (isNaN(val)) {
                    throw Error(`"${cell}" on ${row} was not a number`);
                }

                bingoBoard[rowNum][colNum].number = val;
            })
        });

        this.bingoBoard = bingoBoard;
    }

    public receive(number: number): boolean {
        if (this.hasGotLine) {
            return false;
        }

        for (let row of this.bingoBoard) {
            for (let cell of row) {
                if (cell.number == number) {
                    cell.seen = true;
                    return true;
                }
            }
        }

        return false;
    }

    public hasLine(): number | null {
        if (!this.hasGotLine) {
            if (this.calculateHasLine()) {
                this.hasGotLine = hasGotLineCount++;
            }

            return this.hasGotLine;
        }

        return this.hasGotLine;
    }

    public valueOfBoard(): number {
        return this.bingoBoard.map(
            row => row.reduce(
                (previousValue, current) => {
                    if (previousValue.seen) {
                        return current;
                    }

                    if (current.seen) {
                        return previousValue;
                    }

                    return {
                        seen: false,
                        number: previousValue.number + current.number
                    }
                },
            )
        ).reduce((previousValue, current) => {
            if (previousValue.seen) {
                return current;
            }

            if (current.seen) {
                return previousValue;
            }

            return {
                seen: false,
                number: previousValue.number + current.number
            }
        }).number
    }

    private calculateHasLine(): boolean {
        for (let row of this.bingoBoard) {
            if (row.every(val => val.seen)) {
                return true;
            }
        }

        for (const col of [0, 1, 2, 3, 4]) {
            let seen = true;
            for (let row of this.bingoBoard) {
                if (!row[col].seen) {
                    seen = false;
                    break;
                }
            }
            if (seen) {
                return true;
            }
        }
        return false;
    }
}

const boards = split.slice(1).map(val => new Board(val));

let part1 = false;
let part2 = false;

numbers.split(',').forEach(val => {
    if (part1 && part2) {
        return;
    }

    const numberToRead = Number.parseInt(val);

    if (isNaN(numberToRead)) {
        throw new Error(`${val} isn't a valid number`);
    }

    const boardsThatReceive = boards.filter(val => val.receive(numberToRead));

    const winningBoards = boardsThatReceive.filter(board => board.hasLine() !== null);

    if (!part1) {
        if (winningBoards.length > 1) {
            throw Error(`Multiple boards win?`)
        } else if (winningBoards.length == 1) {
            console.log(`Part 1: ${winningBoards[0].valueOfBoard() * numberToRead}`);

            part1 = true;
        }
    }

    if (boards.every(board => board.hasLine() !== null)) {
        // We know all lines aren't null, but the type checker doesn't
        boards.sort((a, b) => (b.hasLine() || 0) - (a.hasLine() || 0));

        const lastBoard = boards[0];

        console.log(`Part 2: ${lastBoard.valueOfBoard() * numberToRead}`);
        part2 = true;
    }
});
