package com.patrickrose;

import com.patrickrose.daythree.Santa;

import java.util.HashMap;

public class DayThreePartTwo extends DayThreePartOne {

    public DayThreePartTwo() {
        super();
    }

    public DayThreePartTwo(String input) {
        super(input);
    }

    @Override
    public String getAnswer() {
        Santa santa = new Santa();
        Santa roboSanta = new Santa();

        boolean moveSanta = true;

        HashMap<Integer, HashMap<Integer, Boolean>> locations = initialiseLocations();


        for(char movement: input.toCharArray())
        {
            if (moveSanta) {
                parseMovement(santa, locations, movement);
            }
            else
            {
                parseMovement(roboSanta, locations, movement);
            }

            moveSanta = !moveSanta;
        }

        int answer = countLocations(locations);

        return "" + answer;
    }
}