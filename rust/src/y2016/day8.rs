use regex::Regex;

const PUZZLE_INPUT: &'static str ="rect 1x1
rotate row y=0 by 5
rect 1x1
rotate row y=0 by 5
rect 1x1
rotate row y=0 by 3
rect 1x1
rotate row y=0 by 2
rect 1x1
rotate row y=0 by 3
rect 1x1
rotate row y=0 by 2
rect 1x1
rotate row y=0 by 5
rect 1x1
rotate row y=0 by 5
rect 1x1
rotate row y=0 by 3
rect 1x1
rotate row y=0 by 2
rect 1x1
rotate row y=0 by 3
rect 2x1
rotate row y=0 by 2
rect 1x2
rotate row y=1 by 5
rotate row y=0 by 3
rect 1x2
rotate column x=30 by 1
rotate column x=25 by 1
rotate column x=10 by 1
rotate row y=1 by 5
rotate row y=0 by 2
rect 1x2
rotate row y=0 by 5
rotate column x=0 by 1
rect 4x1
rotate row y=2 by 18
rotate row y=0 by 5
rotate column x=0 by 1
rect 3x1
rotate row y=2 by 12
rotate row y=0 by 5
rotate column x=0 by 1
rect 4x1
rotate column x=20 by 1
rotate row y=2 by 5
rotate row y=0 by 5
rotate column x=0 by 1
rect 4x1
rotate row y=2 by 15
rotate row y=0 by 15
rotate column x=10 by 1
rotate column x=5 by 1
rotate column x=0 by 1
rect 14x1
rotate column x=37 by 1
rotate column x=23 by 1
rotate column x=7 by 2
rotate row y=3 by 20
rotate row y=0 by 5
rotate column x=0 by 1
rect 4x1
rotate row y=3 by 5
rotate row y=2 by 2
rotate row y=1 by 4
rotate row y=0 by 4
rect 1x4
rotate column x=35 by 3
rotate column x=18 by 3
rotate column x=13 by 3
rotate row y=3 by 5
rotate row y=2 by 3
rotate row y=1 by 1
rotate row y=0 by 1
rect 1x5
rotate row y=4 by 20
rotate row y=3 by 10
rotate row y=2 by 13
rotate row y=0 by 10
rotate column x=5 by 1
rotate column x=3 by 3
rotate column x=2 by 1
rotate column x=1 by 1
rotate column x=0 by 1
rect 9x1
rotate row y=4 by 10
rotate row y=3 by 10
rotate row y=1 by 10
rotate row y=0 by 10
rotate column x=7 by 2
rotate column x=5 by 1
rotate column x=2 by 1
rotate column x=1 by 1
rotate column x=0 by 1
rect 9x1
rotate row y=4 by 20
rotate row y=3 by 12
rotate row y=1 by 15
rotate row y=0 by 10
rotate column x=8 by 2
rotate column x=7 by 1
rotate column x=6 by 2
rotate column x=5 by 1
rotate column x=3 by 1
rotate column x=2 by 1
rotate column x=1 by 1
rotate column x=0 by 1
rect 9x1
rotate column x=46 by 2
rotate column x=43 by 2
rotate column x=24 by 2
rotate column x=14 by 3
rotate row y=5 by 15
rotate row y=4 by 10
rotate row y=3 by 3
rotate row y=2 by 37
rotate row y=1 by 10
rotate row y=0 by 5
rotate column x=0 by 3
rect 3x3
rotate row y=5 by 15
rotate row y=3 by 10
rotate row y=2 by 10
rotate row y=0 by 10
rotate column x=7 by 3
rotate column x=6 by 3
rotate column x=5 by 1
rotate column x=3 by 1
rotate column x=2 by 1
rotate column x=1 by 1
rotate column x=0 by 1
rect 9x1
rotate column x=19 by 1
rotate column x=10 by 3
rotate column x=5 by 4
rotate row y=5 by 5
rotate row y=4 by 5
rotate row y=3 by 40
rotate row y=2 by 35
rotate row y=1 by 15
rotate row y=0 by 30
rotate column x=48 by 4
rotate column x=47 by 3
rotate column x=46 by 3
rotate column x=45 by 1
rotate column x=43 by 1
rotate column x=42 by 5
rotate column x=41 by 5
rotate column x=40 by 1
rotate column x=33 by 2
rotate column x=32 by 3
rotate column x=31 by 2
rotate column x=28 by 1
rotate column x=27 by 5
rotate column x=26 by 5
rotate column x=25 by 1
rotate column x=23 by 5
rotate column x=22 by 5
rotate column x=21 by 5
rotate column x=18 by 5
rotate column x=17 by 5
rotate column x=16 by 5
rotate column x=13 by 5
rotate column x=12 by 5
rotate column x=11 by 5
rotate column x=3 by 1
rotate column x=2 by 5
rotate column x=1 by 5
rotate column x=0 by 1
";

pub fn calculate(day2: bool) {
    if day2 {

    } else {
        let answer = calculate_total(PUZZLE_INPUT);
        println!("{}", answer);
    }
}

pub fn calculate_total(input: &str) -> usize {
    let mut row1 = vec![false; 50];
    let mut row2 = vec![false; 50];
    let mut row3 = vec![false; 50];
    let mut row4 = vec![false; 50];
    let mut row5 = vec![false; 50];
    let mut row6 = vec![false; 50];

    for line in input.lines() {
        match get_command(&line) {
            Command::CreateRectangle => {
                lazy_static! {
                    static ref CREATE_RECTANGLE: Regex = Regex::new(r"^rect (\d+)x(\d+)$").unwrap();
                }

                for cap in CREATE_RECTANGLE.captures_iter(line) {
                    let x = cap.at(1).unwrap_or("0").parse::<usize>().unwrap_or(0);
                    let y = cap.at(2).unwrap_or("0").parse::<usize>().unwrap_or(0);

                    for i in 0..x {
                        for j in 0..y {
                            match j {
                                0 => row1[i] = true,
                                1 => row2[i] = true,
                                2 => row3[i] = true,
                                3 => row4[i] = true,
                                4 => row5[i] = true,
                                5 => row6[i] = true,
                                _ => {}
                            }
                        }
                    }
                }
            },
            Command::RotateRow => {
                lazy_static! {
                    static ref ROTATE_ROW: Regex = Regex::new(r"^rotate row y=(\d+) by (\d+)$").unwrap();
                }

                for cap in ROTATE_ROW.captures_iter(line) {
                    let row = cap.at(1).unwrap_or("0").parse::<usize>().unwrap_or(0);
                    let amount = cap.at(2).unwrap_or("0").parse::<usize>().unwrap_or(0);
                    let mut tmp = vec![false; 50];

                    match row {
                        0 => {
                            for (i, &val) in row1.iter().enumerate() {
                                let index = (i + amount) % 50;
                                tmp[index] = val == true;
                            }

                            for (i, &val) in tmp.iter().enumerate() {
                                row1[i] = val == true;
                            }
                        },
                        1 => {
                            for (i, &val) in row2.iter().enumerate() {
                                let index = (i + amount) % 50;
                                tmp[index] = val == true;
                            }

                            for (i, &val) in tmp.iter().enumerate() {
                                row2[i] = val == true;
                            }
                        },
                        2 => {
                            for (i, &val) in row3.iter().enumerate() {
                                let index = (i + amount) % 50;
                                tmp[index] = val == true;
                            }

                            for (i, &val) in tmp.iter().enumerate() {
                                row3[i] = val == true;
                            }
                        },
                        3 => {
                            for (i, &val) in row4.iter().enumerate() {
                                let index = (i + amount) % 50;
                                tmp[index] = val == true;
                            }

                            for (i, &val) in tmp.iter().enumerate() {
                                row4[i] = val == true;
                            }
                        },
                        4 => {
                            for (i, &val) in row5.iter().enumerate() {
                                let index = (i + amount) % 50;
                                tmp[index] = val == true;
                            }

                            for (i, &val) in tmp.iter().enumerate() {
                                row5[i] = val == true;
                            }
                        },
                        5 => {
                            for (i, &val) in row6.iter().enumerate() {
                                let index = (i + amount) % 50;
                                tmp[index] = val == true;
                            }

                            for (i, &val) in tmp.iter().enumerate() {
                                row6[i] = val == true;
                            }
                        },
                        _ => {}
                    }
                }
            }
            Command::RotateColumn => {
                lazy_static! {
                    static ref ROTATE_COLUMN: Regex = Regex::new(r"^rotate column x=(\d+) by (\d+)$").unwrap();
                }
                for cap in ROTATE_COLUMN.captures_iter(line) {
                    let column = cap.at(1).unwrap_or("0").parse::<usize>().unwrap_or(0);
                    let amount = cap.at(2).unwrap_or("0").parse::<usize>().unwrap_or(0);
                    let mut tmp = vec![false; 6];

                    tmp[0] = row1[column];
                    tmp[1] = row2[column];
                    tmp[2] = row3[column];
                    tmp[3] = row4[column];
                    tmp[4] = row5[column];
                    tmp[5] = row6[column];

                    for (i, &val) in tmp.iter().enumerate() {
                        match (i + amount) % 6 {
                            0 => {
                                row1[column] = val == true;
                            },
                            1 => {
                                row2[column] = val == true;
                            },
                            2 => {
                                row3[column] = val == true;
                            },
                            3 => {
                                row4[column] = val == true;
                            },
                            4 => {
                                row5[column] = val == true;
                            },
                            5 => {
                                row6[column] = val == true;
                            },
                            _ => {}
                        }
                    }
                }
            }
        }
    }
    
    for &val in row1.iter() { print!("{}", if val { '#' } else { '.' }); } println!(" ");
    for &val in row2.iter() { print!("{}", if val { '#' } else { '.' }); } println!(" ");
    for &val in row3.iter() { print!("{}", if val { '#' } else { '.' }); } println!(" ");
    for &val in row4.iter() { print!("{}", if val { '#' } else { '.' }); } println!(" ");
    for &val in row5.iter() { print!("{}", if val { '#' } else { '.' }); } println!(" ");
    for &val in row6.iter() { print!("{}", if val { '#' } else { '.' }); } println!(" ");

    let mut count = 0;

    for val in row1 {
        if val {
            count += 1;
        }
    }
    for val in row2 {
        if val {
            count += 1;
        }
    }
    for val in row3 {
        if val {
            count += 1;
        }
    }
    for val in row4 {
        if val {
            count += 1;
        }
    }
    for val in row5 {
        if val {
            count += 1;
        }
    }
    for val in row6 {
        if val {
            count += 1;
        }
    }

    return count;
}

#[derive(PartialEq)]
#[derive(Debug)]
pub enum Command {
    CreateRectangle,
    RotateColumn,
    RotateRow
}

pub fn get_command(input: &str) -> Command {
    if input.contains("rect") {
        return Command::CreateRectangle;
    }
    if input.contains("rotate column") {
        return Command::RotateColumn;
    }
    if input.contains("rotate row") {
        return Command::RotateRow;
    }

    panic!("Did not understand {}", input);
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    pub fn a_new_lcd_has_no_on_pixels() {
        assert_eq!(0, calculate_total(""));
    }

    #[test]
    pub fn can_switch_on_a_small_rectangle() {
        assert_eq!(1, calculate_total("rect 1x1"));
    }

    #[test]
    pub fn can_parse_a_string_to_get_the_column() {
        assert_eq!(Command::CreateRectangle, get_command("rect 3x2"));
        assert_eq!(Command::CreateRectangle, get_command("rect 3x5"));
        assert_eq!(Command::CreateRectangle, get_command("rect 1x1"));

        assert_eq!(Command::RotateColumn, get_command("rotate column x=1 by 1"));
        assert_eq!(Command::RotateColumn, get_command("rotate column x=3 by 1"));
        assert_eq!(Command::RotateColumn, get_command("rotate column x=2 by 4"));

        assert_eq!(Command::RotateRow, get_command("rotate row y=1 by 1"));
        assert_eq!(Command::RotateRow, get_command("rotate row y=3 by 1"));
        assert_eq!(Command::RotateRow, get_command("rotate row y=2 by 4"));
    }

    #[test]
    pub fn can_switch_on_a_small_rectangle_multiple_times() {
        assert_eq!(6, calculate_total("rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 4"));
    }

    #[test]
    pub fn can_do_rotations_past_the_end() {
        assert_eq!(49, calculate_total("rect 49x1
rotate column x=0 by 2
"));
        assert_eq!(5, calculate_total("rect 1x5
rotate row y=0 by 2"));
    }

}
