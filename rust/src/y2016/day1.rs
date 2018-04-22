const PUZZLE_INPUT: &'static str = "R4, R1, L2, R1, L1, L1, R1, L5, R1, R5, L2, R3, L3, L4, R4, R4, R3, L5, L1, R5, R3, L4, R1, R5, L1, R3, L2, R3, R1, L4, L1, R1, L1, L5, R1, L2, R2, L3, L5, R1, R5, L1, R188, L3, R2, R52, R5, L3, R79, L1, R5, R186, R2, R1, L3, L5, L2, R2, R4, R5, R5, L5, L4, R5, R3, L4, R4, L4, L4, R5, L4, L3, L1, L4, R1, R2, L5, R3, L4, R3, L3, L5, R1, R1, L3, R2, R1, R2, R2, L4, R5, R1, R3, R2, L2, L2, L1, R2, L1, L3, R5, R1, R4, R5, R2, R2, R4, R4, R1, L3, R4, L2, R2, R1, R3, L5, R5, R2, R5, L1, R2, R4, L1, R5, L3, L3, R1, L4, R2, L2, R1, L1, R4, R3, L2, L3, R3, L2, R1, L4, R5, L1, R5, L2, L1, L5, L2, L5, L2, L4, L2, R3";

enum Direction {
    North,
    South,
    East,
    West
}

pub fn calculate(part2: bool) {
    if part2 {
        println!("{}", find_first_dupe(PUZZLE_INPUT));
    } else {
        println!("{}", shortest_route(PUZZLE_INPUT));
    }
}

fn change_direction(left_right: &str, current_direction: Direction) -> Direction {
    match left_right {
        "L" => {
            match current_direction {
                Direction::North => { return Direction::West },
                Direction::East => { return Direction::North },
                Direction::South => { return Direction::East },
                Direction::West => { return Direction::South },
            }
        },
        "R" => {
            match current_direction {
                Direction::North => { return Direction::East },
                Direction::East => { return Direction::South },
                Direction::South => { return Direction::West },
                Direction::West => { return Direction::North },
            }
        },
        _ => {
            panic!("Did not pass L or R, passed {}", left_right);
        }
    }
}

pub fn find_first_dupe(input: &str) -> i32 {
    let mut ns: i32 = 0;
    let mut ew: i32 = 0;
    let mut current_direction = Direction::North;
    let mut visited = String::new();
    
    for s in input.split(", ") {
        let mut string = String::new();
        for (i, c) in s.chars().enumerate() {
            if i == 0 {
                current_direction = change_direction(&c.to_string(), current_direction);
            }
            else {
                string.push(c);
            }
        }
        match string.parse::<i32>() {
            Err(_) => {println!("FUCK YOU");},
            Ok(amount) => {
                for _ in 0..amount {
                    match current_direction {
                        Direction::South => { ns += 1 },
                        Direction::North => { ns -= 1 },
                        Direction::East => { ew += 1 },
                        Direction::West => { ew -= 1 }
                    }

                    let to_add = format!(",{}{}, ", ns, ew);

                    if visited.contains(&to_add) {
                        return ns.abs() + ew.abs();
                    } else {
                        visited.push_str(&to_add);
                    }
                }
            }
        }
    }

    return 0;
}

pub fn shortest_route(input: &str) -> i32 {
    let mut ns: i32 = 0;
    let mut ew: i32 = 0;
    let mut current_direction = Direction::North;
    
    for s in input.split(", ") {
        let mut string = String::new();
        for (i, c) in s.chars().enumerate() {
            if i == 0 {
                current_direction = change_direction(&c.to_string(), current_direction);
            }
            else {
                string.push(c);
            }
        }
        match string.parse::<i32>() {
            Err(_) => {},
            Ok(amount) => {
                match current_direction {
                    Direction::North => { ns -= amount },
                    Direction::South => { ns += amount },
                    Direction::East => { ew += amount },
                    Direction::West => { ew -= amount }
                }
            }
        }
    }

    return ns.abs() + ew.abs();
}

#[cfg(test)]
mod tests {
    
    use super::Direction;
    use super::*;

    fn direction_matches(first: Direction, second: Direction) -> bool {
        match first {
            Direction::East => {
                match second {
                    Direction::East => return true,
                    _ => return false,
                }
            },
            Direction::West => {
                match second {
                    Direction::West => return true,
                    _ => return false,
                }
            },
            Direction::South => {
                match second {
                    Direction::South => return true,
                    _ => return false,
                }
            },
            Direction::North => {
                match second {
                    Direction::North => return true,
                    _ => return false,
                }
            }
        }
    }

    #[test]
    fn change_direction_north() {
        let left = super::change_direction("L", Direction::North);
        assert!(direction_matches(Direction::West, left));
        
        let right = super::change_direction("R", Direction::North);
        assert!(direction_matches(Direction::East, right));
    }

    #[test]
    fn change_direction_east() {
        let left = super::change_direction("L", Direction::East);
        assert!(direction_matches(Direction::North, left));

        let right = super::change_direction("R", Direction::East);
        assert!(direction_matches(Direction::South, right));
    }

    #[test]
    fn change_direction_south() {
        let left = super::change_direction("L", Direction::South);
        assert!(direction_matches(Direction::East, left));

        let right = super::change_direction("R", Direction::South);
        assert!(direction_matches(Direction::West, right));
    }

    #[test]
    fn change_direction_west() {
        let left = super::change_direction("L", Direction::West);
        assert!(direction_matches(Direction::South, left));

        let right = super::change_direction("R", Direction::West);
        assert!(direction_matches(Direction::North, right));
    }

    #[test]
    fn get_shortest_route()
    {
        assert_eq!(5, shortest_route("R2, L3"));
        assert_eq!(2, shortest_route("R2, R2, R2"));
        assert_eq!(12, shortest_route("R5, L5, R5, R3"));
    }

    #[test]
    fn get_shortest_first_dupe()
    {
        assert_eq!(4, find_first_dupe("R8, R4, R4, R8"));
    }
}

