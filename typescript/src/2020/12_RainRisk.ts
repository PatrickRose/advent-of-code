import getInput from "./util/getInput";

const input = getInput(12);

type Position = {
    x: number,
    y: number
}

type Direction = {
    apply(amount: number, position: Position): Position,
    turn(direction: 'Left' | 'Right', amount: number): Direction
}

const faceEast: Direction = {
    apply(amount: number, position: Position): Position {
        position.x += amount

        return position;
    },

    turn(direction: 'Left' | 'Right', amount: number): Direction {
        switch (amount) {
            case 90:
                return direction == 'Left' ? faceNorth : faceSouth;
            case 180:
                return faceWest;
            case 270:
                return direction == 'Left' ? faceSouth : faceNorth;
            default:
                throw new Error(`Can't turn ${amount}`)
        }
    }
}

const faceNorth: Direction = {
    apply(amount: number, position: Position): Position {
        position.y += amount

        return position;
    },

    turn(direction: 'Left' | 'Right', amount: number): Direction {
        switch (amount) {
            case 90:
                return direction == 'Left' ? faceWest : faceEast;
            case 180:
                return faceSouth;
            case 270:
                return direction == 'Left' ? faceEast : faceWest;
            default:
                throw new Error(`Can't turn ${amount}`)
        }
    }
}

const faceSouth: Direction = {
    apply(amount: number, position: Position): Position {
        position.y -= amount

        return position;
    },

    turn(direction: 'Left' | 'Right', amount: number): Direction {
        switch (amount) {
            case 90:
                return direction == 'Left' ? faceEast : faceWest;
            case 180:
                return faceNorth;
            case 270:
                return direction == 'Left' ? faceWest : faceEast;
            default:
                throw new Error(`Can't turn ${amount}`)
        }
    }
}

const faceWest: Direction = {
    apply(amount: number, position: Position): Position {
        position.x -= amount

        return position;
    },

    turn(direction: 'Left' | 'Right', amount: number): Direction {
        switch (amount) {
            case 90:
                return direction == 'Left' ? faceSouth : faceNorth;
            case 180:
                return faceEast;
            case 270:
                return direction == 'Left' ? faceNorth : faceSouth;
            default:
                throw new Error(`Can't turn ${amount}`)
        }
    }
}

type Navigation = {
    position: Position,
    direction: Direction,
    waypoint?: Position
}

type Action = {
    perform(amount: number, navigation: Navigation): Navigation
}

const north: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            navigation.waypoint = faceNorth.apply(amount, navigation.waypoint)
        } else {
            navigation.position = faceNorth.apply(amount, navigation.position);
        }

        return navigation;
    }
}

const south: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            navigation.waypoint = faceSouth.apply(amount, navigation.waypoint)
        } else {
            navigation.position = faceSouth.apply(amount, navigation.position);
        }

        return navigation;
    }
}

const east: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            navigation.waypoint = faceEast.apply(amount, navigation.waypoint)
        } else {
            navigation.position = faceEast.apply(amount, navigation.position);
        }

        return navigation;
    }
}

const west: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            navigation.waypoint = faceWest.apply(amount, navigation.waypoint)
        } else {
            navigation.position = faceWest.apply(amount, navigation.position);
        }

        return navigation;
    }
}

const left: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            const {x: baseX, y: baseY} = navigation.waypoint;

            switch (amount) {
                case 90:
                    navigation.waypoint = {
                        x: -baseY,
                        y: baseX
                    };
                    break;
                case 180:
                    navigation.waypoint = {
                        x: -baseX,
                        y: -baseY
                    };
                    break;
                case 270:
                    navigation.waypoint = {
                        x: baseY,
                        y: -baseX
                    };
                    break;
                default:
                    throw new Error(`Cannot turn by ${amount}`);
            }
        } else {
            navigation.direction = navigation.direction.turn('Left', amount);
        }

        return navigation;
    }
}

const right: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            const {x: baseX, y: baseY} = navigation.waypoint;

            switch (amount) {
                case 90:
                    navigation.waypoint = {
                        x: baseY,
                        y: -baseX
                    };
                    break;
                case 180:
                    navigation.waypoint = {
                        x: -baseX,
                        y: -baseY
                    };
                    break;
                case 270:
                    navigation.waypoint = {
                        x: -baseY,
                        y: baseX
                    };
                    break;
                default:
                    throw new Error(`Cannot turn by ${amount}`);
            }
        } else {
            navigation.direction = navigation.direction.turn('Right', amount);
        }

        return navigation;
    }
}

const forward: Action = {
    perform(amount: number, navigation: Navigation): Navigation {
        if (navigation.waypoint) {
            navigation.position = {
                x: navigation.position.x + (navigation.waypoint.x * amount),
                y: navigation.position.y + (navigation.waypoint.y * amount),
            }
        } else {
            navigation.position = faceNorth.apply(amount, navigation.position);
        }

        return navigation;
    }
}

function runCommands(commands: Array<string>, navigation: Navigation): number {

    commands.forEach(
        (row) => {
            const matches = row.match(/^([NSEWLRF])(\d+)$/);

            if (matches === null) {
                throw new Error(`Unexpected input ${row}`);
            }

            const action = matches[1];
            const amount = Number(matches[2]);

            if (isNaN(amount)) {
                throw new Error(`Unexpected input ${row}`);
            }

            switch (action) {
                case 'N':
                    north.perform(amount, navigation);
                    break;
                case 'S':
                    south.perform(amount, navigation);
                    break;
                case 'E':
                    east.perform(amount, navigation);
                    break;
                case 'W':
                    west.perform(amount, navigation);
                    break;
                case 'L':
                    left.perform(amount, navigation);
                    break;
                case 'R':
                    right.perform(amount, navigation);
                    break;
                case 'F':
                    forward.perform(amount, navigation);
                    break;
                default:
                    throw new Error(`Unexpected input ${row}`);
            }
        }
    );

    return Math.abs(navigation.position.x) + Math.abs(navigation.position.y);
}

const commands = input.split("\n");

const partOneNav: Navigation = {direction: faceEast, position: {x: 0, y: 0}};
const partTwoNav: Navigation = {direction: faceEast, position: {x: 0, y: 0}, waypoint: {x: 10, y: 1}};

console.log(`Part 1: ${runCommands(commands, partOneNav)}`);
console.log(`Part 2: ${runCommands(commands, partTwoNav)}`);
