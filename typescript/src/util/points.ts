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

export function getPoint<T>(point:Point, map: PointMap<T>): T|undefined {
    return map.get(point.y)?.get(point.x)
}
