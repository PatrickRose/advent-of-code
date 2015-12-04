package com.patrickrose;

public class Main {

    private static final String DAY_ONE_PART_ONE = "1.1";
    private static final String DAY_ONE_PART_TWO = "1.2";
    private static final String DAY_TWO = "2";
    private static final String DAY_THREE = "3";
    private static final String DAY_FOUR = "4";

    public static void main(String[] args) {
        for(String arg: args)
        {
            AbstractAdventOfCode code;
            switch (arg) {
                case DAY_ONE_PART_ONE:
                    code = new DayOne();
                    break;
                case DAY_ONE_PART_TWO:
                    code = new DayOnePartTwo();
                    break;
                default:
                    System.out.println("Unknown argument " + arg);
                    continue;
            }

            System.out.println(code.GetAnswer());
        }
    }
}
