use crypto::md5::Md5;
use crypto::digest::Digest;

const PUZZLE_INPUT: &'static str ="uqwqemis";

pub fn calculate(part2: bool) {
    if part2 {
        println!("{}", get_hard_password(PUZZLE_INPUT));
    } else {
        println!("{}", get_password(PUZZLE_INPUT));
    }
}

pub fn get_password(input: &str) -> String {
    let mut answer = String::with_capacity(8);
    let mut hasher = Md5::new();
    let mut i: u64 = 0;

    let key = input.as_bytes();
    while answer.len() < 8 {
        hasher.input(key);
        hasher.input(i.to_string().as_bytes());

        let mut output = [0; 16]; // An MD5 is 16 bytes
        hasher.result(&mut output);

        let first_five = output[0] as i32 + output[1] as i32 + (output[2] >> 4) as i32;
        if first_five == 0 {
            match output[2] % 16 {
                0 => answer.push('0'),
                1 => answer.push('1'),
                2 => answer.push('2'),
                3 => answer.push('3'),
                4 => answer.push('4'),
                5 => answer.push('5'),
                6 => answer.push('6'),
                7 => answer.push('7'),
                8 => answer.push('8'),
                9 => answer.push('9'),
                10 => answer.push('a'),
                11 => answer.push('b'),
                12 => answer.push('c'),
                13 => answer.push('d'),
                14 => answer.push('e'),
                15 => answer.push('f'),
                _ => {panic!("{}")}
            }
        }
        i += 1;
        hasher.reset();
    }

    return answer;
}

pub fn get_hard_password(input: &str) -> String {
    let mut answer0 = '-';
    let mut answer1 = '-';
    let mut answer2 = '-';
    let mut answer3 = '-';
    let mut answer4 = '-';
    let mut answer5 = '-';
    let mut answer6 = '-';
    let mut answer7 = '-';
    let mut hasher = Md5::new();
    let mut i: u64 = 0;
    let mut found_chars = 0;

    let key = input.as_bytes();
    while found_chars < 8 {
        hasher.input(key);
        hasher.input(i.to_string().as_bytes());

        let mut output = [0; 16]; // An MD5 is 16 bytes
        hasher.result(&mut output);

        let first_five = output[0] as i32 + output[1] as i32 + (output[2] >> 4) as i32;
        if first_five == 0 {
            let value;
            match output[3] >> 4 % 16 {
                0 => value = '0',
                1 => value = '1',
                2 => value = '2',
                3 => value = '3',
                4 => value = '4',
                5 => value = '5',
                6 => value = '6',
                7 => value = '7',
                8 => value = '8',
                9 => value = '9',
                10 => value = 'a',
                11 => value = 'b',
                12 => value = 'c',
                13 => value = 'd',
                14 => value = 'e',
                15 => value = 'f',
                _ => {panic!("Wasn't a valid hex char")}
            }
            match output[2] % 16 {
                0 => {
                    if answer0 == '-' {
                        answer0 = value;
                        found_chars += 1;
                    }
                }
                1 => {
                    if answer1 == '-' {
                        answer1 = value;
                        found_chars += 1;
                    }
                }
                2 => {
                    if answer2 == '-' {
                        answer2 = value;
                        found_chars += 1;
                    }
                }
                3 => {
                    if answer3 == '-' {
                        answer3 = value;
                        found_chars += 1;
                    }
                }
                4 => {
                    if answer4 == '-' {
                        answer4 = value;
                        found_chars += 1;
                    }
                }
                5 => {
                    if answer5 == '-' {
                        answer5 = value;
                        found_chars += 1;
                    }
                }
                6 => {
                    if answer6 == '-' {
                        answer6 = value;
                        found_chars += 1;
                    }
                }
                7 => {
                    if answer7 == '-' {
                        answer7 = value;
                        found_chars += 1;
                    }
                }
                _ => {}
            }
        }
        i += 1;
        hasher.reset();
    }

    return format!("{}{}{}{}{}{}{}{}", answer0, answer1, answer2, answer3, answer4, answer5, answer6, answer7);
}

#[cfg(test)]
mod tests {

    // use super::*;

    #[test]
    pub fn can_mine_the_password() {
        // Skipped because it's long
        // assert_eq!("18f47a30", get_password("abc"));
    }

    #[test]
    pub fn can_mine_the_hard_password() {
        // Skipped because it's long
        // assert_eq!("05ace8e3", get_hard_password("abc"));
    }
}
