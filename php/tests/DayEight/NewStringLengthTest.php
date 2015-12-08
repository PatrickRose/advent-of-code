<?php

use PatrickRose\DayEight\NewStringLength;
use PatrickRose\DayEight\StringLength;

class NewStringLengthTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var StringLength
     */
    private $stringLength;

    protected function setUp()
    {
        $this->stringLength = new NewStringLength();
    }


    public function provideCharacterLengths()
    {
        return [
            '""' => ['""', 6],
            '"abc"' => ['"abc"', 9],
            '"aaa\"aaa"' => ['"aaa\"aaa"', 16],
            '"\x27"' => ['"\x27"', 11],
            '"\\\\x27"' => ['"\\\\x27"', 13],
        ];
    }

    /**
     * @dataProvider provideCharacterLengths
     */
    public function testGetCharacterLength($input)
    {
        $this->assertEquals(strlen($input), $this->stringLength->getActualLength($input));
    }

    /**
     * @dataProvider provideCharacterLengths
     */
    public function testGetActualLength($input, $expected)
    {
        $this->assertEquals($expected, $this->stringLength->getStringLength($input));
    }

    /**
     * @dataProvider provideCharacterLengths
     */
    public function testGetDifference($input, $stringLength)
    {
        $this->assertEquals($stringLength - strlen($input), $this->stringLength->getDifference($input));
    }

    public function testCalculateAnswer()
    {
        $lengths = $this->provideCharacterLengths();

        $input = array_keys($lengths);

        $this->assertEquals(25, $this->stringLength->calculateAnswer($input));
    }

}
