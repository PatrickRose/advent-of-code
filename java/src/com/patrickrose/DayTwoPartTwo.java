package com.patrickrose;

import java.util.ArrayList;

/**
 * Created by patrick on 05/12/15.
 */
public class DayTwoPartTwo extends DayTwoPartOne {

    public DayTwoPartTwo() {
        super();
    }

    public DayTwoPartTwo(String input) {
        super(input);
    }

    @Override
    public String getAnswer() {
        int answer = 0;

        for (String present: input.split("\n")) {
            ArrayList<Integer> list = parsePresent(present);

            answer += 2 * (list.get(0) + list.get(1)) + (list.get(0) * list.get(1) * list.get(2));
        }

        return "" + answer;
    }
}
