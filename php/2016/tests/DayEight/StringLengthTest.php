<?php

use PatrickRose\DayEight\StringLength;

class StringLengthTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var StringLength
     */
    private $stringLength;

    protected function setUp()
    {
        $this->stringLength = new StringLength();
    }


    public function provideCharacterLengths()
    {
        return [
            '""' => ['""', 0],
            '"abc"' => ['"abc"', 3],
            '"aaa\"aaa"' => ['"aaa\"aaa"', 7],
            '"\x27"' => ['"\x27"', 1],
            '"\\\\x27"' => ['"\\\\x27"', 4],
        ];
    }

    /**
     * @dataProvider provideCharacterLengths
     */
    public function testGetCharacterLength($input)
    {
        $this->assertEquals(strlen($input), $this->stringLength->getStringLength($input));
    }

    /**
     * @dataProvider provideCharacterLengths
     */
    public function testGetActualLength($input, $expected)
    {
        $this->assertEquals($expected, $this->stringLength->getActualLength($input));
    }

    /**
     * @dataProvider provideCharacterLengths
     */
    public function testGetDifference($input, $stringLength)
    {
        $this->assertEquals(strlen($input) - $stringLength, $this->stringLength->getDifference($input));
    }

    public function testCalculateAnswer()
    {
        $lengths = $this->provideCharacterLengths();

        $input = array_keys($lengths);

        $this->assertEquals(15, $this->stringLength->calculateAnswer($input));
    }

}
