import getInput from "./util/getInput";

const sampleInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const input = getInput(4);

const assignments: [[number, number], [number, number]][] = input.split('\n').map(
    (row) => {
        const [first, second] = row.split(',');

        const [first1, first2] = first.split('-').map((val) => Number.parseInt(val, 10))
        const [second1, second2] = second.split('-').map((val) => Number.parseInt(val, 10))

        return [
            [first1, first2],
            [second1, second2]
        ];
    }
);

const contains = assignments.filter(([[first1, first2], [second1, second2]]) => {
    return (first1 <= second1 && first2 >= second2)
        || (second1 <= first1 && second2 >= first2);
});

console.log(`Part 1: ${contains.length}`);

const overlaps = assignments.filter(([[first1, first2], [second1, second2]]) => {
    return (first1 <= second1 && second1 <= first2)
        || (first1 <= second2 && second2 <= first2)
        || (second1 <= first1 && first1 <= second2)
        || (second1 <= first2 && first2 <= second2);
});

console.log(`Part 2: ${overlaps.length}`);
