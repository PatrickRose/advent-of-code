mod day01_sonar_sweep;
// mod day2;
// mod day3;
// mod day4;
// mod day5;
// mod day6;
// mod day7;
// mod day8;
// mod day9;

pub fn run(day: usize) {
    match day {
        1 => day01_sonar_sweep::calculate(),
        // 2 => {day2::calculate(part2)}
        // 3 => {day3::calculate(part2)}
        // 4 => {day4::calculate(part2)}
        // 5 => {day5::calculate(part2)}
        // 6 => {day6::calculate(part2)}
        // 7 => {day7::calculate(part2)}
        // 8 => {day8::calculate(part2)}
        // 9 => {day9::calculate(part2)}
        _ => {
            println!("Not done this day yet :-( {}", day);
        }
    }
}
