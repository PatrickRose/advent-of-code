package com.patrickrose.daythree;

public class Santa {

    private int x;

    private int y;

    public Santa() {
        x = 0;
        y = 0;
    }

    public int getY() {
        return y;
    }

    public int getX() {
        return x;
    }

    public void move(char movement)
    {
        switch (movement)
        {
            case '^':
                y++;
                break;
            case '>':
                x++;
                break;
            case 'v':
                y--;
                break;
            case '<':
                x--;
                break;
            default:
                throw new IllegalArgumentException("Unknown movement type" + movement);
        }
    }
}
