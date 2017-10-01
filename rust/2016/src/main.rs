mod day1;
mod day2;
mod day3;
mod day4;
mod day5;
mod day6;
mod day7;
mod day8;
mod day9;

extern crate getopts;
#[macro_use] extern crate lazy_static;
extern crate regex;
extern crate crypto;

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
                        4 => {day4::calculate(matches.opt_present("e"))}
                        5 => {day5::calculate(matches.opt_present("e"))}
                        6 => {day6::calculate(matches.opt_present("e"))}
                        7 => {day7::calculate(matches.opt_present("e"))}
                        8 => {day8::calculate(matches.opt_present("e"))}
                        9 => {day9::calculate(matches.opt_present("e"))}
                        _ => {println!("Not done this day yet :-( {}", day); }
                    }
                }
            }
        }
        None => {}
    }
}
