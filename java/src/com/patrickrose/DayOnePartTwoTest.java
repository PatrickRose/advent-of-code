package com.patrickrose;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;


import java.util.ArrayList;
import java.util.Collection;

import static org.junit.Assert.*;

@RunWith(Parameterized.class)
public class DayOnePartTwoTest {

    private final String input;
    private final String expectedOutput;

    @Parameters
    public static Collection<Object[]> data() {
        Collection<Object[]> toReturn = new ArrayList<Object[]>();

        toReturn.add(new String[]{")", "1"});
        toReturn.add(new String[]{"()())", "5"});
        toReturn.add(new String[]{"())", "3"});
        toReturn.add(new String[]{"))(", "1"});
        toReturn.add(new String[]{")))", "1"});
        toReturn.add(new String[]{")())())", "1"});

        return toReturn;
    }

    public DayOnePartTwoTest(String input, String expectedOutput) {
        this.input = input;
        this.expectedOutput = expectedOutput;
    }

    @Test
    public void testOutput() {
        DayOnePartTwo test = new DayOnePartTwo(this.input);

        assertEquals(this.expectedOutput, test.getAnswer());
    }

    @Test
    public void testDefaultInput() {
        DayOnePartTwo test = new DayOnePartTwo(this.input);

        assertEquals("()()(()()()(()()((()((()))((()((((()()((((()))()((((())(((((((()(((((((((()(((())(()()(()((()()(()(())(()((((()((()()()((((())((((((()(()(((()())(()((((()))())(())(()(()()))))))))((((((((((((()())()())())(())))(((()()()((((()(((()(()(()()(()(()()(()(((((((())(())(())())))((()())()((((()()((()))(((()()()())))(())))((((())(((()())(())(()))(()((((()())))())((()(())(((()((((()((()(())())))((()))()()(()(()))))((((((((()())((((()()((((()(()())(((((()(()())()))())(((()))()(()(()(()((((()(())(()))(((((()()(()()()(()(((())())(((()()(()()))(((()()(((())())(()(())())()()(())()()()((()(((()(())((()()((())()))((()()))((()()())((((()(()()(()(((()))()(()))))((()(((()()()))(()(((())()(()((()())(()(()()(()())(())()(((()(()())()((((()((()))))())()))((()()()()(())()())()()()((((()))))(()(((()()(((((((())()))()((((()((())()(()())(())()))(()(()())(((((((())))(((()))())))))()))())((())(()()((())()())()))))()((()()())(())((())((((()())())()()()(((()))())))()()))())(()()()(()((((((()()))())()))()(((()(((())((((()()()(()))())()()))))())()))())((())()())(((((())())((())())))(((())(((())(((((()(((((())(()(()())())(()(())(()))(()((((()))())()))))())))((()(()))))())))(((((())()))())()))))()))))(((()))()))))((()))((()((()(()(())()())))(()()()(())()))()((((())))))))(())(()((()()))(()))(()))(()((()))))))()()((((()()))()())()))))))()()()))(()((())(()))((()()()())()(((()((((())())))()((((()(()))))))())))()()())()))(()))))(()())()))))))((())))))))())()))()((())())))(()((()))()))(())))))(()))()())()()))((()(()))()()()()))))())()()))())(())()()))()))((()))))()()(()())))))()()()))((((()))()))))(()(())))(()())))((())())(()))()))))()())))()())()())))))))))()()))))())))((())((()))))())))(((()())))))))(()))()()))(()))()))))()())))))())((((()())))))))())))()()))))))))()))()))))()))))))(())))))))))())))))))))))))))())())((())))))))))()))((())))()))))))))())()(()))))))())))))()()()())()(()()()(()())(()))()()()(()())))())())))()))))())))))))()()()()())(())())()())()))))(()()()()()))))()))())())))((()())()())))()))()))))(()())))()))))))))(((()))()()))))))))))))))))))))(()))(()((()))())))())(()))(()(()(())))))()(()))()))()()))))))))))))()((()())(())())()(())))))())()())((()()))))(()()))))())()(())()))))))))))))))))))))()))(()(()())))))))()()((()))()))))))((())))()))))))))((()))())()()))())()()))((()))())))))))))))(()())()))(())((()(()()))(()())(())))()())(()(())()()))))()))()(()))))))(()))))))))))(()))())))))))))())))))())))(())))))()))))(())())))))))))()(()))))()())))())(()))()())))))))))))))())()()))))()))))))())))))()))))(())(()()()()((())()))())(()))((())()))())())(())(()()))))()))(())()()((())(())))(())))()))())))))))))()(((((())())))(())()))))(())))((()))()(((((((()))))()()))(())))))()(()))))(()()))()))())))))))(()())()))))))))())))(()))())()))(())()((())())()())())(()(()))))()))))))((()())(())()()(()())))()()))(())(())(()))())))()))(()))()()))((((()))))()))((()()()))))()))()))())))(()))()))))(())))()))())()(()))()())))())))))))())))())))()()))))))(()))())())))()))()()())())))))))))))))())))()))(()()))))())))())()(())))())))))))))))))))))()()())())))))()()()((()(()))()()(())()())()))()))))()()()))))))((()))))))))()(()(()((((((()()((()())))))))))))()))())))))((())())(()))())))())))))())()()())(())))())))()())())(())))))))()()(())))()))())))())())())()))))))))()))(()()()())())())))(())())))))))()()())()))))())))())()(())())))))))()())()))(()()(())())))()(()((()()((()()(((((())(()())()))(())()))(())))(())))))))()))()))((()))()))()))))))))()))))))))((()()())(()))(((()))(())))()))((())(((())))()())))())))))((())))))(())())((((((())())()(()))()(()((()())))((())()(()(()))))(())(()()())(())))())((()(((())())))(((()())())))())()(())())((((()()))))())((()))()()()()(())(((((((()()()((()))())(()())))(())())((((()()(()))))()((())))((())()))()(((()))())))()))((()(()))(())(()((((())((((()()(()()))(((())(()))))((((()(()))(())))))((()))(()))((()(((()(()))(()(()((()(())(()(()(()(()()((()))())(((())(()(()))))(()))()()))(())))(())()(((())(()))()((((()()))))())(()))))((())()((((()(((()))())())(((()))()())((())(())())(())()(())()(()()((((((()()))))()()(((()()))))()())()(((()(()))(()(()())(()(()))))(((((()(((())())))))(((((()((()()((())())((((((()(())(()()((()()()()()()()(()()))()(((()))()))(((((((())(((()((()())()((((())(((()(())))()((()(()()()((())((()())()))()))())))())((((((()))(()(()()()))(()((()(()(()))()((()(((()()()((())(((((())()(()))())())((()(())))(()(()())(())((())())())(((()()()(())))))())(()))))))()))))))())((()()()))((()((((((()))(((()((((()()()(((()))())()(()()(((()((()()()()())()()))()()()(()(())((()))))(()))())))))))()(()()(((((())()(()(((((()((()(()()())(()((((((((()((((((())()((((()()()((()((()((((((()))((())))))))())()))((()(()))()(()()(()((())((()()((((((((((((()())(()()()))((((()((((((())(()))())(()()((()()))()(((((((()((()()((((((()(((())))((())))((((((((()()(((((((())(((((()())(((())((())()((((()(((((((()(()(((()((((((()(((()(((((((((((()()((()()(()))((()()(((()(((())))((((())()(()(((())()(()(((())(((((((((((()))())))((((((())((()()((((()())())((((()()))((())(((((()(()()(()()()((())(()((()()((((()(((((()((()(()((((()())((((((()(((((()()(()(()((((())))(())(())(())((((()(()()((((()((((()()((()((((((())))(((((()))))()))(()((((((((()(((())())(((())))(()(()((())(((()((()()(((((()((()()(((())()(()))(((((((())(()(((((()))((()((()((()))(())())((((()((((())()(()))(((()(((((((((((((((())(((((((((()))(((()(()()()()((((((()((())()((((((((()(())(((((((((((()(()((())()((()()(()(()()((((()()((())(()((()()(()()((((()(((((((())))((((())(())()(((()()((()()((((()((()(((()((())(((()()()((((()((((()()(()(()((((((((())(()(((((())(()())(((((((()())()(()((((()((())(()()())((((()()(((()((((())(())(()()(((((((((()()))()(((())(()(()((((((())(()()())(()))()()(((()(((()((())(()(((((((()(()(()((()(((((()(()((()(()((((((()((((()()((((()(((()((())(()(()((()()((((()()(())()(())(((())(()((((((((()())(((((((((()(())()((((())))()))()()(((((()()((((((())(()()(((()(()(((((((()(()(((((((())(())((((()((()(())))((((()()())(()))((()())((((()(((((()(()(())(()(()()())(((((()(((((()((((()()((((((((()()))(()((((((())((((())()(()(((()()()(((()(()(())(())(((((()(())())((((())(())(()(((()(((((())((((())())((()(((((((()(((())(()(()))(((((((((()((()((()()(()((((())(((()((())((((())(()(((()(((()(()((((()(((())(()(((()(()()(()(()((()()(()())(())())((()(()(((()(((()(((()()(((((((((()(((((((((()()(((()(((()())((((()(()(((()()()((())((((((((((())(()(((()((((()())((((()((()))(((()()()(((((()(((((((())((()())(()((((())((((((((())(()((()((((((((((()()((()((()()))(((()())()())()(((()())()()(()(()(((((((())()))(())()))())()()((())()((()((((()((()((())(((((()((((((()(())))(()))())(((()))((()()(()(((()))((((())()(((()))))()(()(())()(((((())(()(()(())(())()((()()()((((()(())((()())(()(()))(()(()(()()(())()()(()((())()((()))))()))((()(()()()()((()())(()))())()(()(((((((((())())((()((()((((((())()((((())(((())((()(()()()((())(()((())(((()((((()()((()(()(((((())()))()((((((()))((())(((()()))(((())(())()))(((((((())(())())()(())(((((()))()((()))()(()()((()()()()()())(((((((", test.getPuzzleInput());
    }

}