export type Point = {
    x: number,
    y: number,
}

export function getAdjacentPoints(x: number, y: number): [
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
    Point,
] {
    return [
        {x: x - 1, y: y - 1},
        {x: x - 1, y: y},
        {x: x - 1, y: y + 1},
        {x: x, y: y - 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y - 1},
        {x: x + 1, y: y},
        {x: x + 1, y: y + 1},
    ]
}
