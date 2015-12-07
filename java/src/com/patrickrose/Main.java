package com.patrickrose;

public class Main {

    private static final String DAY_ONE_PART_ONE = "1.1";
    private static final String DAY_ONE_PART_TWO = "1.2";
    private static final String DAY_TWO_PART_ONE = "2.1";
    private static final String DAY_TWO_PART_TWO = "2.2";
    private static final String DAY_THREE_PART_ONE = "3.1";
    private static final String DAY_THREE_PART_TWO = "3.2";
    private static final String DAY_FOUR_PART_ONE = "4.1";
    private static final String DAY_FOUR_PART_TWO = "4.2";

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
                case DAY_TWO_PART_ONE:
                    code = new DayTwoPartOne();
                    break;
                case DAY_TWO_PART_TWO:
                    code = new DayTwoPartTwo();
                    break;
                case DAY_THREE_PART_ONE:
                    code = new DayThreePartOne();
                    break;
                case DAY_THREE_PART_TWO:
                    code = new DayThreePartTwo();
                    break;
                case DAY_FOUR_PART_ONE:
                    code = new DayFourPartOne();
                    break;
                case DAY_FOUR_PART_TWO:
                    code = new DayFourPartTwo();
                    break;
                default:
                    System.out.println("Unknown argument " + arg);
                    continue;
            }

            System.out.println(code.getAnswer());
        }
    }
}
