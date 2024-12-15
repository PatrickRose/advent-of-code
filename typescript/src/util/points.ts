import parseInt from "./parseInt";

export type Point = {
    x: number,
    y: number,
}

export type PointString = `${Point["x"]},${Point["y"]}`

export type PointMap<T> = Map<number, Map<number, T>>;

export function getAdjacentPoints(x: number, y: number, includeDiagonals = true): Point[] {
    const toReturn = [
        {x: x - 1, y: y},
        {x: x, y: y - 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y},
    ];

    if (includeDiagonals) {
        toReturn.push({x: x - 1, y: y - 1})
        toReturn.push({x: x - 1, y: y + 1})
        toReturn.push({x: x + 1, y: y - 1})
        toReturn.push({x: x + 1, y: y + 1})

        toReturn.sort((a, b) => {
            if (a.x == b.x) {
                return a.y - b.y;
            }

            return a.x - b.x;
        })
    }

    return toReturn;
}

export function calculateManhattan(first: Point, second: Point): number {
    return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

export function pointToPointString(point: Point): PointString {
    return `${point.x},${point.y}`;
}

export function setPoint<T>(point: Point, value: T, map: PointMap<T>) {
    let innerMap = map.get(point.y);
    if (innerMap === undefined) {
        innerMap = new Map<number, T>();
        map.set(point.y, innerMap)
    }

    innerMap.set(point.x, value);
}

export function unsetPoint<T>(point: Point, map: PointMap<T>) {
    let innerMap = map.get(point.y);
    if (innerMap === undefined) {
        innerMap = new Map<number, T>();
        map.set(point.y, innerMap)
    }

    innerMap.delete(point.x);
}

export function getPoint<T>(point:Point, map: PointMap<T>): T|undefined {
    return map.get(point.y)?.get(point.x)
}

export function setPointArray<T>(point: Point, value: T, map: T[][]) {
    if (map[point.y] === undefined) {
        map[point.y] = [];
    }

    map[point.y][point.x] = value;
}

export function getPointArray<T>(point:Point, map: T[][]): T|undefined {
    if (map[point.x] === undefined) {
        return undefined;
    }

    return map[point.x][point.y]
}

export function pointStringToPoint(point: PointString): Point {
    return {
        x: parseInt(point.split(',')[0]),
        y: parseInt(point.split(',')[1])
    }
}

export function direction(firstPoint: Point, secondPoint: Point): 'Left' | 'Right' | 'Up' | 'Down' {
    const xDiff = firstPoint.x - secondPoint.x
    const yDiff = firstPoint.y - secondPoint.y
    if (yDiff == 0) {
        if (xDiff == -1) {
            return "Right"
        } else if (xDiff == 1) {
            return 'Left'
        }
    } else if (xDiff == 0) {
        if (yDiff == -1) {
            return "Down"
        } else if (yDiff == 1) {
            return 'Up'
        }
    }

    throw Error(`Points ${pointToPointString(firstPoint)} and ${pointToPointString(secondPoint)} are not adjacent`)
}

export function forEachPoint<T>(map: PointMap<T>, callback: (point: Point, val: T) => void, sortOrder: null|((a:Point, b:Point) => number) = null) {
    if (sortOrder === null) {
        map.forEach((inner, y) => {
            inner.forEach((val, x) => callback({x, y}, val))
        });
    } else {
        const items: {point: Point, val: T}[] = [];

        map.forEach((inner, y) => {
            inner.forEach((val, x) => items.push({point: {x,y}, val}))
        });

        items.sort((a,b) => sortOrder(a.point, b.point));

        items.forEach(({val,point}) => callback(point, val))
    }
}

export type Direction = 'north' | 'south' | 'east' | 'west';
export const DIRECTIONS: Direction[] = ['north', 'south', 'west', 'east'];
export const DIRECTIONS_REVERSE: Record<Direction, Direction> = {
    north: "south",
    south: "north",
    east: "west",
    west: "east",
}

export function applyDirectionToPoint({x,y}: Point, direction: Direction): Point {
    switch (direction) {
        case "north":
            return {
                x,
                y: y-1
            }
        case "east":
            return {
                x: x+1,
                y
            };
        case "south":
            return {
                x,
                y: y+1
            };
        case "west":
            return {
                x: x-1,
                y
            }
    }
}

export function forEachPointInStr(input: string, callback: (point: Point, char: string) => void): void {
    input.split('\n').forEach((row, y) =>
        row.split('').forEach(
            (char, x) => callback({x,y}, char)
        )
    )
}

export function subtractPoint(a: Point, b: Point): Point {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

export function addPoint(a: Point, b: Point): Point {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

export function pointOutOfRange({x,y}: Point, maxX: number, maxY: number, minX: number = 0, minY: number = 0) {
    return x < minX
        || x >= maxX
        || y < minY
        || y >= maxY;
}

export type Point3D = {
    x: number,
    y: number,
    z: number,
};

export function strToPoint3D(input: string): Point3D {
    const [x, y, z] = input.split(',').map(val => parseInt(val));

    return {x, y, z}
}
