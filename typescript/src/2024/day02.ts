import getInput from "./util/getInput";

const testInputs = {
    example: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`
}

const input = getInput(testInputs, 2);

const reports: number[][] = input.split('\n').map(row => row.split(' ').map(val => Number.parseInt(val, 10)));

const reportIsSafe = (report: number[]) => {
    // Check the first two
    const increasing = report[0] - report[1] < 0;

    return report.every((val: number, index: number): boolean => {
        if (index == 0) {
            return true;
        }

        const difference = val - report[index - 1];
        if ((increasing && difference < 0)
            || (!increasing && difference > 0)) {
            return false;
        }

        const absDiff = Math.abs(difference);

        return absDiff >= 1 && absDiff <= 3
    });
};
const safeReports = reports.filter(reportIsSafe);

console.log(`Part 1: ${safeReports.length}`);

const problemDamperReports = reports.filter((report) => {
    // Are we already safe?
    if (reportIsSafe(report)) {
        return true;
    }

    // Otherwise, loop through until it is
    for(let i=0; i<report.length;i++) {
        const newReport = report.slice(0, i);
        newReport.push(...report.slice(i+1));

        if (reportIsSafe(newReport)) {
            return true;
        }
    }

    return false;
})

console.log(`Part 2: ${problemDamperReports.length}`);
