extern crate getopts;
#[macro_use] extern crate lazy_static;
extern crate regex;
extern crate crypto;

use getopts::Options;
use std::env;

mod y2016;
mod y2021;

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
    opts.optopt("y", "year", "Which year to do", "default to 2017");
    opts.optflag("e", "extended", "Do the second part");
    let matches = match opts.parse(&args[1..]) {
        Ok(m) => { m }
        Err(f) => { panic!("{}", f.to_string()) }
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

    let mut year = 2017;

    if matches.opt_present("y") {
        match matches.opt_str("y") {
            Some(x) => {
                match x.parse::<usize>() {
                    Err(_) => {println!("Failed to parse {} as an int?", x); },
                    Ok(val) => {
                        year = val;
                    }
                }
            }
            None => { panic!("Unknown year")}
        }
    }

    let day;

    match matches.opt_str("d") {
        Some(x) => {
            match x.parse::<usize>() {
                Err(_) => {panic!("Failed to parse {} as an int, did you pass a day? :-(", x); },
                Ok(val) => {
                    day = val;
                }
            }
        }
        None => { panic!("")}
    }

    match year {
        2016 => { y2016::run(day, matches.opt_present("e")) },
        2021 => { y2021::run(day, matches.opt_present("e")) },
        _ => { println!("Unknown year {}", year)}
    }
}
