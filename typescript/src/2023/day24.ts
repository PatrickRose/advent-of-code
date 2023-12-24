import getInput from "./util/getInput";
import {Point, Point3D, strToPoint3D} from "../util/points";
import {accumulator} from "../util/accumulator";
import {init} from "z3-solver";

const testInputs = {
    example: `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`
}

const input = getInput(testInputs, 24);

const [testMin, testMax] = input == testInputs.example
    ? [7, 27]
    : [200000000000000, 400000000000000]

type Hailstone = {
    position: Point3D,
    velocity: Point3D
}

type Line2D = {
    a: number,
    b: number,
    c: number,
    original: Hailstone
};

function hailstoneTo2DLine({position, velocity}: Hailstone): Line2D {
    const nextPoint: Point3D = {
        x: position.x+velocity.x,
        y: position.y+velocity.y,
        z: position.z+velocity.z,
    }

    const a = nextPoint.y - position.y;
    const b = position.x - nextPoint.x;

    return {
        a: a,
        b: b,
        c: a * position.x + b * position.y,
        original: {position, velocity}
    }
}

const hailstones: Hailstone[] = input.split('\n').map(val => {
    const [position, velocity] = val.split(' @ ');

    return {
        position: strToPoint3D(position),
        velocity: strToPoint3D(velocity),
    }
});

const lines = hailstones.map(hailstoneTo2DLine);

function pointIsInTheFuture(point: Point, hailstone: Hailstone): boolean {
    const xDelta = point.x - hailstone.position.x;
    const yDelta = point.y - hailstone.position.y;

    return (xDelta / hailstone.velocity.x) > 0 &&
        (yDelta / hailstone.velocity.y) > 0
}

function linesIntersect( {a: A1, b: B1, c: C1, original: H1}: Line2D, {a: A2, b: B2, c: C2, original: H2}: Line2D): boolean {
    const delta = (A1 * B2) - (A2 * B1)

    if (delta == 0) {
        return false;
    }

    // Then the intersection is
    const x = ((B2 * C1) - (B1 * C2)) / delta;
    const y = ((A1 * C2) - (A2 * C1)) / delta;

    // If the number isn't in the test area, then we don't care
    if (x < testMin || x > testMax || y < testMin || y > testMax) {
        return false;
    }

    // Then we just check whether the new point is the future
    const point: Point = {x, y};

    const h1InFuture = pointIsInTheFuture(point, H1);
    const h2InFuture = pointIsInTheFuture(point, H2);

    return h1InFuture && h2InFuture;
}

const intersects = lines.map((firstLine, index) => {
    return lines.slice(index).filter((secondLine) => linesIntersect(firstLine, secondLine)).length
})

console.log(`Part 1: ${accumulator(intersects)}`)

async function part2(hailStones: Hailstone[]): Promise<number> {
    const {Context} = await init();
    const Z3 = Context("main");

    const x = Z3.Real.const("x");
    const y = Z3.Real.const("y");
    const z = Z3.Real.const("z");

    const vx = Z3.Real.const("vx");
    const vy = Z3.Real.const("vy");
    const vz = Z3.Real.const("vz");

    const solver = new Z3.Solver();

    for (let i = 0; i < hailStones.length; i++) {
        const stone = hailStones[i];
        const t = Z3.Real.const(`t${i}`);

        solver.add(t.ge(0));
        solver.add(x.add(vx.mul(t)).eq(t.mul(stone.velocity.x).add(stone.position.x)));
        solver.add(y.add(vy.mul(t)).eq(t.mul(stone.velocity.y).add(stone.position.y)));
        solver.add(z.add(vz.mul(t)).eq(t.mul(stone.velocity.z).add(stone.position.z)));
    }

    const isSat = await solver.check();

    if (isSat !== "sat") return -1;

    const model = solver.model();
    const rx = Number(model.eval(x));
    const ry = Number(model.eval(y));
    const rz = Number(model.eval(z));

    console.log([rx, ry, rz]);
    return rx + ry + rz;
}

part2(hailstones).then(val => console.log(`Part 2: ${val}`));
