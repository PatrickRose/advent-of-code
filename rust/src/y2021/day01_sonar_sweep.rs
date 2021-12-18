pub fn calculate() {
    let input = include_str!("../../../input/2021/day01.txt");

    let solved = solve(input);

    println!("Part 1: {}", solved.0);
    println!("Part 2: {}", solved.1);
}

fn solve(input: &str) -> (usize, usize) {
    let vec = input_to_vector(&input);

    let part2 = make_three_sum(vec.clone());

    return (num_increases(vec), num_increases(part2));
}

fn num_increases(values: Vec<usize>) -> usize {
    let mut count = 0;

    let mut i = 0;

    while i < values.len() - 1 {
        if values[i] < values[i + 1] {
            count += 1;
        }
        i += 1
    }

    return count;
}

fn input_to_vector(input: &str) -> Vec<usize> {
    let mut vec = Vec::new();

    input.lines().for_each(|line| match line.parse::<usize>() {
        Err(_) => {
            panic!("Failed to parse {} as an int?", &line);
        }
        Ok(val) => vec.push(val),
    });

    return vec;
}
fn make_three_sum(values: Vec<usize>) -> Vec<usize> {
    let mut vec = Vec::with_capacity(values.len() - 2);

    let mut i = 0;

    while i < values.len() - 2 {
        vec.push(values[i] + values[i + 1] + values[i + 2]);
        i += 1
    }
    return vec;
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn generate_vector() {
        let input = "199
200";

        assert_eq!(vec![199, 200], input_to_vector(input));
    }

    #[test]
    fn generate_vector_with_three_elements() {
        let input = "199
200
300";

        assert_eq!(vec![199, 200, 300], input_to_vector(input));
    }

    #[test]
    fn count_increases() {
        assert_eq!(num_increases(vec![199, 200, 300]), 2);
        assert_eq!(num_increases(vec![199, 300, 200, 300]), 2);
        assert_eq!(num_increases(vec![400, 199, 200, 300]), 2);
        assert_eq!(num_increases(vec![400, 199, 500, 200, 300, 600]), 3);
    }

    #[test]
    fn make_triple() {
        assert_eq!(make_three_sum(vec![199, 200, 300]), vec![699]);
        assert_eq!(make_three_sum(vec![199, 200, 300, 400]), vec![699, 900]);
    }

    #[test]
    fn solve() {
        assert_eq!(
            (7, 5),
            super::solve(
                "199
200
208
210
200
207
240
269
260
263"
            )
        )
    }
}
