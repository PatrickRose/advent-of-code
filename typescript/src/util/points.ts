export type Point = {
    x: number,
    y: number,
}

export type PointString = `${Point["x"]},${Point["y"]}`

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
