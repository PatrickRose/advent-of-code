mod day1;
mod day2;
mod day3;

extern crate getopts;

use getopts::Options;
use std::env;


fn print_usage(program: &str, opts: Options) {
    let brief = format!("Usage: {} FILE [options]", program);
    print!("{}", opts.usage(&brief));
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let program = args[0].clone();

    let mut opts = Options::new();
    opts.optflag("h", "help", "print this help menu");
    opts.optopt("d", "day", "The day to do. Must be supplied", "Takes 1-25");
    opts.optflag("e", "extended", "Do the second part");
    let matches = match opts.parse(&args[1..]) {
        Ok(m) => { m }
        Err(f) => { panic!(f.to_string()) }
    };
    if matches.opt_present("h") {
        print_usage(&program, opts);
        return;
    }
    if !matches.opt_present("d") {
        println!("Must provide the day!");
        print_usage(&program, opts);
        return;
    }

    match matches.opt_str("d") {
        Some(x) => {
            match x.parse::<usize>() {
                Err(_) => {println!("Failed to parse {} as an int, did you pass a day? :-(", x); },
                Ok(day) => {
                    match day {
                        1 => {day1::calculate(matches.opt_present("e"))}
                        2 => {day2::calculate(matches.opt_present("e"))}
                        3 => {day3::calculate(matches.opt_present("e"))}
                        _ => {println!("Not done this day yet :-( {}", day); }
                    }
                }
            }
        }
        None => {}
    }
}
