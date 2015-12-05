package com.patrickrose;

public class DayOnePartTwo extends DayOne {

    public DayOnePartTwo() {
        super();
    }

    public DayOnePartTwo(String input) {
        super(input);
    }

    @Override
    public String getAnswer() {
        for(int i = 0; i < input.length(); i++)
        {
            this.changeFloor(input.charAt(i));
            if (location == -1)
            {
                return "" + (i + 1);
            }
        }

        return null;
    }
}
