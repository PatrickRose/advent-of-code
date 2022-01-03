import getInput from './util/getInput';

const exampleInput = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

const realInput = getInput(23);

const input = realInput;

const NUM_SPACES = 4;

type Column = {
    columnNumber: "A" | "B" | "C" | "D",
    position: 1 | 2 | 3 | 4
}

const ALL_COLUMN_NUMBERS: Column["columnNumber"][] = ["A", "B", "C", "D",];

type Corridor = 1 | 2 | 4 | 6 | 8 | 10 | 11;

type Position = Column | Corridor;

type GameState = {
    a1: Position,
    a2: Position,
    a3: Position,
    a4: Position,
    b1: Position,
    b2: Position,
    b3: Position,
    b4: Position,
    c1: Position,
    c2: Position,
    c3: Position,
    c4: Position,
    d1: Position,
    d2: Position,
    d3: Position,
    d4: Position,
}

type GameStateKey = keyof GameState;

function getCacheKey(gameState: GameState): string {
    const cacheKey: string[] = [];
    for (let key in gameState) {
        const toLookAt = gameState[key as GameStateKey];

        if (typeof toLookAt === 'number') {
            cacheKey.push(`${toLookAt}`);
        } else {
            cacheKey.push(`${toLookAt.columnNumber}${toLookAt.position}`);
        }
    }

    return cacheKey.join(',');
}

function getStateFromInput(input: string, part2: boolean): GameState {
    const gameState: GameState = {
        a1: { columnNumber: "A", position: 1 },
        a2: { columnNumber: "A", position: 2 },
        a3: { columnNumber: "A", position: 3 },
        a4: { columnNumber: "A", position: 4 },
        b1: { columnNumber: "B", position: 1 },
        b2: { columnNumber: "B", position: 2 },
        b3: { columnNumber: "B", position: 3 },
        b4: { columnNumber: "B", position: 4 },
        c1: { columnNumber: "C", position: 1 },
        c2: { columnNumber: "C", position: 2 },
        c3: { columnNumber: "C", position: 3 },
        c4: { columnNumber: "C", position: 4 },
        d1: { columnNumber: "D", position: 1 },
        d2: { columnNumber: "D", position: 2 },
        d3: { columnNumber: "D", position: 3 },
        d4: { columnNumber: "D", position: 4 },
    }

    const inputRows = input.split("\n");

    if (!part2) {
        let [a, b, c, d] = Array(4).fill(true);

        inputRows.slice(2, 4).forEach(
            (row, rowIndex) => {
                const matches = row.match(/#+([A-D])#+([A-D])#+([A-D])#+([A-D])#+/);

                if (!matches) {
                    throw Error(`${row} did not match regex`);
                }

                const position: Column["position"] = rowIndex == 0 ? 1 : 2;

                matches.slice(1).forEach(
                    (char, colIndex) => {
                        const columnNumber = ALL_COLUMN_NUMBERS[colIndex];

                        const column: Column = { position, columnNumber };
                        let key: GameStateKey;

                        switch (char) {
                            case 'A':
                                key = a ? 'a1' : 'a2';
                                a = false;
                                break;
                            case 'B':
                                key = b ? 'b1' : 'b2';
                                b = false;
                                break;
                            case 'C':
                                key = c ? 'c1' : 'c2';
                                c = false;
                                break;
                            case 'D':
                                key = d ? 'd1' : 'd2';
                                d = false;
                                break;
                            default:
                                throw Error(`Unknown character ${char}`);
                        }

                        gameState[key] = column;
                    }
                )
            }
        );
    } else {
        let [a, b, c, d] = Array(4).fill(1);
        const rows = inputRows.slice(2, 3);
        rows.push("  #D#C#B#A#");
        rows.push("  #D#B#A#C#")
        rows.push(inputRows[3]);

        rows.forEach(
            (row, rowIndex) => {
                const matches = row.match(/#+([A-D])#+([A-D])#+([A-D])#+([A-D])#+/);

                if (!matches) {
                    throw Error(`${row} did not match regex`);
                }

                const position: Column["position"] = (rowIndex + 1) as Column["position"];

                matches.slice(1).forEach(
                    (char, colIndex) => {
                        const columnNumber = ALL_COLUMN_NUMBERS[colIndex];

                        const column: Column = { position, columnNumber };
                        let key: GameStateKey

                        switch (char) {
                            case 'A':
                                key = `a${a++}` as GameStateKey;
                                break;
                            case 'B':
                                key = `b${b++}` as GameStateKey;
                                break;
                            case 'C':
                                key = `c${c++}` as GameStateKey;
                                break;
                            case 'D':
                                key = `d${d++}` as GameStateKey;
                                break;
                            default:
                                throw Error(`Unknown character ${char}`);
                        }

                        gameState[key] = column;
                    }
                )
            }
        );
    }

    return gameState;
}

type PosToPosition = Partial<{
    1: GameStateKey,
    2: GameStateKey,
    3: GameStateKey,
    4: GameStateKey,
    5: GameStateKey,
    6: GameStateKey,
    7: GameStateKey,
    8: GameStateKey,
    9: GameStateKey,
    10: GameStateKey,
    11: GameStateKey,
    A1: GameStateKey,
    A2: GameStateKey,
    A3: GameStateKey,
    A4: GameStateKey,
    B1: GameStateKey,
    B2: GameStateKey,
    B3: GameStateKey,
    B4: GameStateKey,
    C1: GameStateKey,
    C2: GameStateKey,
    C3: GameStateKey,
    C4: GameStateKey,
    D1: GameStateKey,
    D2: GameStateKey,
    D3: GameStateKey,
    D4: GameStateKey,
}>;

type PossiblePositions = keyof PosToPosition;

function positionsBetweenPoints(
    start: PossiblePositions,
    end: PossiblePositions
): PossiblePositions[] {
    const possible: PossiblePositions[] = [];

    const roomToColumn: { [key: string]: PossiblePositions } = {
        A: 3,
        B: 5,
        C: 7,
        D: 9,
    }

    if (typeof start == 'string') {
        // Keep moving up until the person hits the corridor
        for (let pos = Number.parseInt(start[1], 10) - 1; pos > 0; pos--) {
            possible.push(`${start[0]}${pos}` as PossiblePositions);
        }

        start = roomToColumn[start[0]];
        possible.push(start);
    }

    const corridorTarget: PossiblePositions = typeof end == 'string'
        ? roomToColumn[end[0]]
        : end;

    const difference = start > corridorTarget ? -1 : 1;

    while (start != corridorTarget) {
        start = ((start as number) + difference) as PossiblePositions;
        possible.push(start);
    }

    if (typeof end == 'string') {
        for (let pos = 1; pos <= Number.parseInt(end[1]); pos++) {
            possible.push(`${end[0]}${pos}` as PossiblePositions);
        }
    }

    return possible;
}

function getMovesForState(gameState: GameState): [GameState, number][] | null {
    const inverseMap: PosToPosition = {}

    function positionIsEmpty(position: PossiblePositions): boolean {
        return inverseMap[position] === undefined
    }

    function canMoveIntoColumn(amphipodType: string): boolean {
        for (let corridor in inverseMap) {
            if (corridor[0] == amphipodType) {
                const value = inverseMap[corridor as keyof PosToPosition];

                if (value && value[0].toUpperCase() != amphipodType) {
                    return false;
                }
            }
        }

        return true;
    }

    function columnMove(
        amphipodType: string,
        currentPos: PossiblePositions,
        energyCost: number,
        key: GameStateKey
    ): [GameState, number] | null {
        // Now we just try all of the positions in that column
        for (let pos = NUM_SPACES; pos > 0; pos--) {
            const toTry = `${amphipodType}${pos}` as PossiblePositions;

            const path = positionsBetweenPoints(currentPos, toTry);

            if (path.every(positionIsEmpty)) {
                const nextState: GameState = {
                    ...gameState
                };

                nextState[key] = {
                    columnNumber: amphipodType as Column["columnNumber"],
                    position: pos as Column["position"]
                }

                return [nextState, path.length * energyCost];
            }
        }

        return null;
    }

    for (let keyTmp in gameState) {
        const key = keyTmp as GameStateKey;
        const value = gameState[key];

        if (typeof value == 'number') {
            inverseMap[value] = key;
        } else {
            const mapKey = `${value.columnNumber}${value.position}`;
            inverseMap[mapKey as keyof PosToPosition] = key;
        }
    }

    const possibles: [GameState, number][] = [];

    let allSolved = true;

    // Iterate through every key and work out what the different moves are
    for (let key in gameState) {
        const currentPos = gameState[key as GameStateKey];

        const amphipodType = key[0].toUpperCase();

        const energyCost = {
            A: 1,
            B: 10,
            C: 100,
            D: 1000
        }[amphipodType] ?? 0;

        const convertedPosition: PossiblePositions = typeof currentPos == 'number'
            ? currentPos
            : `${currentPos.columnNumber}${currentPos.position}`;

        const possibleColumn = columnMove(
            amphipodType,
            convertedPosition,
            energyCost,
            key as GameStateKey
        );

        const canMove = canMoveIntoColumn(amphipodType);

        const inRightColumn = convertedPosition.toString()[0] == amphipodType

        if (canMove && inRightColumn) {
            continue;
        }

        allSolved = false;

        if (typeof currentPos === 'number') {
            // Then it's in the hallway and can't move
            // unless we can move into the right column
            if (!canMove) {
                continue;
            }

            if (possibleColumn) {
                possibles.push(possibleColumn);
            }

            continue;
        } else {
            if (canMove && possibleColumn) {
                // Just move to the column
                possibles.push(possibleColumn);
                continue;
            }

            // Otherwise, try every possible position in the corridor
            for (let pos = 1; pos <= 11; pos++) {
                if (![1, 2, 4, 6, 8, 10, 11].includes(pos)) {
                    continue;
                }

                const path = positionsBetweenPoints(
                    convertedPosition,
                    pos as PossiblePositions
                );

                if (path.every(positionIsEmpty)) {
                    const nextState = {
                        ...gameState
                    };
                    nextState[key as GameStateKey] = pos as Corridor;

                    possibles.push([nextState, path.length * energyCost]);
                }
            }
        }
    }

    return allSolved ? null : possibles;
}

function calculateMinimum(
    gameState: GameState,
    cacheMap: Map<string, number> = new Map<string, number>()
): number {
    const cacheKey = getCacheKey(gameState);

    const answer = cacheMap.get(cacheKey);
    if (answer !== undefined) {
        return answer;
    }

    const possibleMoves = getMovesForState(gameState);

    if (possibleMoves === null) {
        return 0;
    }

    if (possibleMoves.length == 0) {
        // There are no possible moves, so this path is dead
        return Infinity;
    }

    const actualAnswer = Math.min(...possibleMoves.map(
        ([gameState, cost]) => calculateMinimum(gameState, cacheMap) + cost
    ));

    cacheMap.set(cacheKey, actualAnswer);

    return actualAnswer;
}

const initialPositionPart1 = getStateFromInput(input, false);
const initialPositionPart2 = getStateFromInput(input, true);

const part1 = calculateMinimum(initialPositionPart1);
console.log(`Part 1: ${part1}`);

const part2 = calculateMinimum(initialPositionPart2);
console.log(`Part 2: ${part2}`);
