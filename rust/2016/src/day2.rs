const PUZZLE_INPUT: &'static str ="DLUUULUDLRDDLLLUDULLULLRUURURLUULDUUUDLDDRUDLUULLRLDDURURDDRDRDLDURRURDLDUURULDDULDRDDLDLDLRDRUURLDLUDDDURULRLLLLRLULLUDRDLDUURDURULULULRLULLLULURLRDRDDDDDDDLRLULUULLULURLLDLRLUDULLDLLURUDDLDULDLULDDRLRLRDDLRURLLLURRLDURRDLLUUUUDRURUULRLDRRULLRUDLDRLUDRDRDRRDDURURRDRDRUDURDLUDRUDLRRULDLRDDRURDDUUDLDRDULDDRRURLLULRDRURLRLDLLLUULUUDLUDLDRRRRDUURULDUDUDRLDLLULLLRDDDDDLRDDLLUULLRRRDURLRURDURURLUDRRLRURDRDRRRRULUDLDRDULULRUDULLLUDRRLRLURDDURULDUUDULLURUULRDRDULRUUUDURURDDRRUDURRLRDRULRUUU
LDRURRUUUULDRDDDLLULDRUDDRLLDLDRDLRUDDDLDDULULULLRULDUDRRDLRUURURDRURURDLLRUURDUUDRLDURDRDLRRURURDUUUURUURRLLLDRDUURRRRURULUUUDLUDDRUURRLDULRDULRRRRUDURRLURULRURRDRDLLDRRDUDRDURLDDRURULDRURUDDURDLLLUURRLDRULLURDRDRLDRRURRLRRRDDDDLUDLUDLLDURDURRDUDDLUDLRULRRRDRDDLUDRDURDRDDUURDULRRULDLDLLUDRDDUDUULUDURDRLDURLRRDLDDLURUDRLDUURLLRLUDLLRLDDUDLLLRRRLDLUULLUDRUUDRLDUUUDUURLRDDDDRRDRLDDRDLUDRULDDDRDUULLUUUUULDULRLLLRLLDULRDUDDRDDLRRLRDDULLDURRRURDDUDUDDRLURRLUUUULLDRDULUUDRDULDLLUDLURDLLURRDLUULURRULRLURRRRRUURDDURLRLLDDLRRDUUURDRDUDRDDDLLDDRDRRRLURRDUULULULULRRURDDLDDLLLRUDDDDDDLLLRDULURULLRLRDRR
DDRLLLDLRRURRDLDDRUURRURRLRRRRUURUURDLURRRDDLRUDRURLUURLLRRLRLURLURURDULLLLDLRURULUUDURRLULRDRDRRDDLLULRLUDLUUUDRLLRRURRLDULDDLRRLUUUUDDLRLDRLRRDRDLDDURDDRDDLDLURLRRRDDUDLLRLRLURRRRULLULLLLDRLDULDLLDULRLDRDLDDRRDDDDRUDRLLURULRLDDLLRRURURDDRLLLULLULDDRDLDDDLRLLDRLDRUURRULURDDRLULLDUURRULURUUDULLRUDDRRLLDLLRDRUDDDDLLLDDDLLUUUULLDUUURULRUUDUUUDDLDURLDRDRRLLUDULDLUDRLLLDRRRULUUDDURUDRLUDDRRLLDUDUURDDRURLUURDURURURRUUDUDDLLLDRRRURURRURDLRULLDUDRLRLLRUDRUDLR
RRRDRLRURLRRLUURDRLDUURURLRDRRUDLLUUDURULLUURDLLDRRLURRUDUUDRRURLRRDULLDDLRRRUDUUDUUDLDDDLUUDLDULDDULLDUUUUDDUUDUDULLDDURRDLRRUDUDLRDUULDULRURRRLDLLURUDLDDDRRLRDURDLRRLLLRUDLUDRLLLRLLRRURUDLUDURLDRLRUDLRUULDRULLRLDRDRRLDDDURRRUDDDUDRRDRLDDRDRLLRLLRDLRDUDURURRLLULRDRLRDDRUULRDDRLULDLULURDLRUDRRDDDLDULULRDDRUDRLRDDRLDRDDRRRDUURDRLLDDUULRLLLULLDRDUDRRLUUURLDULUUURULLRLUDLDDLRRDLLRDDLRDRUUDURDDLLLDUUULUUDLULDUDULDRLRUDDURLDDRRRDLURRLLRRRUDDLDDRURDUULRUURDRRURURRRUUDUDULUDLUDLLLUUUULRLLRRRRDUDRRDRUDURLUDDLDRDLDDRULLRRULDURUL
DLLLRDDURDULRRLULURRDULDLUDLURDDURRLLRRLLULRDLDRDULRLLRDRUUULURRRLLRLDDDRDRRULDRRLLLLDLUULRRRURDDRULLULDDDLULRLRRRUDRURULUDDRULDUDRLDRRLURULRUULLLRUURDURLLULUURUULUUDLUDLRRULLLRRLRURDRRURDRULRURRUDUDDDRDDULDLURUDRDURLDLDLUDURLLRUULLURLDDDURDULRLUUUDLLRRLLUURRDUUDUUDUURURDRRRRRRRRRUDULDLULURUDUURDDULDUDDRDDRDRLRUUUUDLDLRDUURRLRUUDDDDURLRRULURDUUDLUUDUUURUUDRURDRDDDDULRLLRURLRLRDDLRUULLULULRRURURDDUULRDRRDRDLRDRRLDUDDULLDRUDDRRRD";

#[derive(PartialEq)]
#[derive(Debug)]
pub enum Number {
    One, Two, Three, Four, Five,
    Six, Seven, Eight, Nine
}

#[derive(PartialEq)]
#[derive(Debug)]
pub enum EvilNumber {
    One, Two, Three, Four, Five,
    Six, Seven, Eight, Nine,
    A, B, C, D
}

pub fn calculate(part2: bool) {
    if part2 {
        println!("{}", get_evil_code(PUZZLE_INPUT));
    } else {
        println!("{}", get_code(PUZZLE_INPUT));
    }        
}

pub fn move_on_keypad(direction: char, current_number: Number) -> Number {
    match current_number {
        Number::One => {
            match direction {
                'U' => return Number::One,
                'D' => return Number::Four,
                'L' => return Number::One,
                'R' => return Number::Two,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Two => {
            match direction {
                'U' => return Number::Two,
                'D' => return Number::Five,
                'L' => return Number::One,
                'R' => return Number::Three,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Three => {
            match direction {
                'U' => return Number::Three,
                'D' => return Number::Six,
                'L' => return Number::Two,
                'R' => return Number::Three,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Four => {
            match direction {
                'U' => return Number::One,
                'D' => return Number::Seven,
                'L' => return Number::Four,
                'R' => return Number::Five,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Five => {
            match direction {
                'U' => return Number::Two,
                'D' => return Number::Eight,
                'L' => return Number::Four,
                'R' => return Number::Six,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Six => {
            match direction {
                'U' => return Number::Three,
                'D' => return Number::Nine,
                'L' => return Number::Five,
                'R' => return Number::Six,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Seven => {
            match direction {
                'U' => return Number::Four,
                'D' => return Number::Seven,
                'L' => return Number::Seven,
                'R' => return Number::Eight,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Eight => {
            match direction {
                'U' => return Number::Five,
                'D' => return Number::Eight,
                'L' => return Number::Seven,
                'R' => return Number::Nine,
                _ => panic!("This direction isn't recognised"),
            }
        },
        Number::Nine => {
            match direction {
                'U' => return Number::Six,
                'D' => return Number::Nine,
                'L' => return Number::Eight,
                'R' => return Number::Nine,
                _ => panic!("This direction isn't recognised"),
            }
        }
    }
}

pub fn move_on_evil_keypad(direction: char, current_number: EvilNumber) -> EvilNumber {
    match current_number {
        EvilNumber::One => {
            match direction {
                'U' => return EvilNumber::One,
                'D' => return EvilNumber::Three,
                'L' => return EvilNumber::One,
                'R' => return EvilNumber::One,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Two => {
            match direction {
                'U' => return EvilNumber::Two,
                'D' => return EvilNumber::Six,
                'L' => return EvilNumber::Two,
                'R' => return EvilNumber::Three,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Three => {
            match direction {
                'U' => return EvilNumber::One,
                'D' => return EvilNumber::Seven,
                'L' => return EvilNumber::Two,
                'R' => return EvilNumber::Four,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Four => {
            match direction {
                'U' => return EvilNumber::Four,
                'D' => return EvilNumber::Eight,
                'L' => return EvilNumber::Three,
                'R' => return EvilNumber::Four,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Five => {
            match direction {
                'U' => return EvilNumber::Five,
                'D' => return EvilNumber::Five,
                'L' => return EvilNumber::Five,
                'R' => return EvilNumber::Six,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Six => {
            match direction {
                'U' => return EvilNumber::Two,
                'D' => return EvilNumber::A,
                'L' => return EvilNumber::Five,
                'R' => return EvilNumber::Seven,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Seven => {
            match direction {
                'U' => return EvilNumber::Three,
                'D' => return EvilNumber::B,
                'L' => return EvilNumber::Six,
                'R' => return EvilNumber::Eight,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Eight => {
            match direction {
                'U' => return EvilNumber::Four,
                'D' => return EvilNumber::C,
                'L' => return EvilNumber::Seven,
                'R' => return EvilNumber::Nine,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::Nine => {
            match direction {
                'U' => return EvilNumber::Nine,
                'D' => return EvilNumber::Nine,
                'L' => return EvilNumber::Eight,
                'R' => return EvilNumber::Nine,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::A => {
            match direction {
                'U' => return EvilNumber::Six,
                'D' => return EvilNumber::A,
                'L' => return EvilNumber::A,
                'R' => return EvilNumber::B,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::B => {
            match direction {
                'U' => return EvilNumber::Seven,
                'D' => return EvilNumber::D,
                'L' => return EvilNumber::A,
                'R' => return EvilNumber::C,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::C => {
            match direction {
                'U' => return EvilNumber::Eight,
                'D' => return EvilNumber::C,
                'L' => return EvilNumber::B,
                'R' => return EvilNumber::C,
                _ => panic!("This direction isn't recognised"),
            }
        },
        EvilNumber::D => {
            match direction {
                'U' => return EvilNumber::B,
                'D' => return EvilNumber::D,
                'L' => return EvilNumber::D,
                'R' => return EvilNumber::D,
                _ => panic!("This direction isn't recognised"),
            }
        },
    }
}

pub fn get_code(instructions: &str) -> String {
    let mut answer = String::with_capacity(4);
    let mut current_number = Number::Five;
    
    for line in instructions.lines() {
        for c in line.chars() {
            current_number = move_on_keypad(c, current_number);
        }

        match current_number {
            Number::One => answer.push('1'),
            Number::Two => answer.push('2'),
            Number::Three => answer.push('3'),
            Number::Four => answer.push('4'),
            Number::Five => answer.push('5'),
            Number::Six => answer.push('6'),
            Number::Seven => answer.push('7'),
            Number::Eight => answer.push('8'),
            Number::Nine => answer.push('9'),
        }
    }

    return answer;
}

pub fn get_evil_code(instructions: &str) -> String {
    let mut answer = String::with_capacity(4);
    let mut current_number = EvilNumber::Five;
    
    for line in instructions.lines() {
        for c in line.chars() {
            current_number = move_on_evil_keypad(c, current_number);
        }

        match current_number {
            EvilNumber::One => answer.push('1'),
            EvilNumber::Two => answer.push('2'),
            EvilNumber::Three => answer.push('3'),
            EvilNumber::Four => answer.push('4'),
            EvilNumber::Five => answer.push('5'),
            EvilNumber::Six => answer.push('6'),
            EvilNumber::Seven => answer.push('7'),
            EvilNumber::Eight => answer.push('8'),
            EvilNumber::Nine => answer.push('9'),
            EvilNumber::A => answer.push('A'),
            EvilNumber::B => answer.push('B'),
            EvilNumber::C => answer.push('C'),
            EvilNumber::D => answer.push('D'),
        }
    }

    return answer;
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    pub fn handles_one() {
        let up = move_on_keypad('U', Number::One);
        assert_eq!(Number::One, up, "When moving up");
        let down = move_on_keypad('D', Number::One);
        assert_eq!(Number::Four, down, "When moving down");
        let left = move_on_keypad('L', Number::One);
        assert_eq!(Number::One, left, "When moving left");
        let right = move_on_keypad('R', Number::One);
        assert_eq!(Number::Two, right, "When moving right");
    }

    #[test]
    pub fn handles_two() {
        let up = move_on_keypad('U', Number::Two);
        assert_eq!(Number::Two, up, "When moving up");
        let down = move_on_keypad('D', Number::Two);
        assert_eq!(Number::Five, down, "When moving down");
        let left = move_on_keypad('L', Number::Two);
        assert_eq!(Number::One, left, "When moving left");
        let right = move_on_keypad('R', Number::Two);
        assert_eq!(Number::Three, right, "When moving right");
    }

    #[test]
    pub fn handles_three() {
        let up = move_on_keypad('U', Number::Three);
        assert_eq!(Number::Three, up, "When moving up");
        let down = move_on_keypad('D', Number::Three);
        assert_eq!(Number::Six, down, "When moving down");
        let left = move_on_keypad('L', Number::Three);
        assert_eq!(Number::Two, left, "When moving left");
        let right = move_on_keypad('R', Number::Three);
        assert_eq!(Number::Three, right, "When moving right");
    }

    #[test]
    pub fn handles_four() {
        let up = move_on_keypad('U', Number::Four);
        assert_eq!(Number::One, up, "When moving up");
        let down = move_on_keypad('D', Number::Four);
        assert_eq!(Number::Seven, down, "When moving down");
        let left = move_on_keypad('L', Number::Four);
        assert_eq!(Number::Four, left, "When moving left");
        let right = move_on_keypad('R', Number::Four);
        assert_eq!(Number::Five, right, "When moving right");
    }

    #[test]
    pub fn handles_five() {
        let up = move_on_keypad('U', Number::Five);
        assert_eq!(Number::Two, up, "When moving up");
        let down = move_on_keypad('D', Number::Five);
        assert_eq!(Number::Eight, down, "When moving down");
        let left = move_on_keypad('L', Number::Five);
        assert_eq!(Number::Four, left, "When moving left");
        let right = move_on_keypad('R', Number::Five);
        assert_eq!(Number::Six, right, "When moving right");
    }

    #[test]
    pub fn handles_six() {
        let up = move_on_keypad('U', Number::Six);
        assert_eq!(Number::Three, up, "When moving up");
        let down = move_on_keypad('D', Number::Six);
        assert_eq!(Number::Nine, down, "When moving down");
        let left = move_on_keypad('L', Number::Six);
        assert_eq!(Number::Five, left, "When moving left");
        let right = move_on_keypad('R', Number::Six);
        assert_eq!(Number::Six, right, "When moving right");
    }

    #[test]
    pub fn handles_seven() {
        let up = move_on_keypad('U', Number::Seven);
        assert_eq!(Number::Four, up, "When moving up");
        let down = move_on_keypad('D', Number::Seven);
        assert_eq!(Number::Seven, down, "When moving down");
        let left = move_on_keypad('L', Number::Seven);
        assert_eq!(Number::Seven, left, "When moving left");
        let right = move_on_keypad('R', Number::Seven);
        assert_eq!(Number::Eight, right, "When moving right");
    }

    #[test]
    pub fn handles_eight() {
        let up = move_on_keypad('U', Number::Eight);
        assert_eq!(Number::Five, up, "When moving up");
        let down = move_on_keypad('D', Number::Eight);
        assert_eq!(Number::Eight, down, "When moving down");
        let left = move_on_keypad('L', Number::Eight);
        assert_eq!(Number::Seven, left, "When moving left");
        let right = move_on_keypad('R', Number::Eight);
        assert_eq!(Number::Nine, right, "When moving right");
    }

    #[test]
    pub fn handles_nine() {
        let up = move_on_keypad('U', Number::Nine);
        assert_eq!(Number::Six, up, "When moving up");
        let down = move_on_keypad('D', Number::Nine);
        assert_eq!(Number::Nine, down, "When moving down");
        let left = move_on_keypad('L', Number::Nine);
        assert_eq!(Number::Eight, left, "When moving left");
        let right = move_on_keypad('R', Number::Nine);
        assert_eq!(Number::Nine, right, "When moving right");
    }

    #[test]
    pub fn it_can_get_the_code() {
        assert_eq!("1985", super::get_code("ULL
RRDDD
LURDL
UUUUD"));
    }

}
