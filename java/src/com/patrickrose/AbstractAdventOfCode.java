package com.patrickrose;

/**
 * Created by patrick on 04/12/15.
 */
abstract public class AbstractAdventOfCode {

    protected String input;

    /**
     * Instantiate the advent of code with the puzzle input
     */
    public AbstractAdventOfCode()
    {
        this.setInput(this.getPuzzleInput());
    }

    /**
     * Instantiate the advent of code puzzle with test input
     * @param input The test input
     */
    public AbstractAdventOfCode(String input) {
        this.setInput(input);
    }

    protected abstract String getPuzzleInput();

    abstract public String GetAnswer();

    public void setInput(String input) {
        this.input = input;
    }
}
