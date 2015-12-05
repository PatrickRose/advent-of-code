<?php


use PatrickRose\DayFive\NewNaughtyOrNice;

class NewNaughtyOrNiceTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var NewNaughtyOrNice
     */
    private $naughtyOrNice;

    protected function setUp()
    {
        parent::setUp();

        $this->naughtyOrNice = new NewNaughtyOrNice();
    }


    protected function tearDown()
    {
        $this->naughtyOrNice = null;

        parent::tearDown();
    }

    public function provideLetterPairs()
    {
        return [
            ['xyxy', true],
            ['aabcdefgaa', true],
            ['aaa', false]
        ];
    }

    /**
     * @dataProvider provideLetterPairs
     */
    public function testPairOfLetters($input, $expected)
    {
        $this->assertSame($expected, $this->naughtyOrNice->hasPairOfTwoLetters($input));
    }

    public function provideRepeatedLetters()
    {
        return [
            ['xyx', true],
            ['abcdefeghi', true],
            ['ege', true],
            ['aaa', true],
            ['abba', false],
        ];
    }

    /**
     * @dataProvider provideRepeatedLetters
     */
    public function testRepeatedLetters($input, $expected)
    {
       $this->assertSame($expected, $this->naughtyOrNice->hasRepeatedLetter($input));
    }

    public function provideTestCases()
    {
        return [
            ['qjhvhtzxzqqjkmpb', true],
            ['xxyxx', true],
            ['uurcxstgmygtbstg', false],
            ['ieodomkazucvgmuy', false],
        ];
    }

    /**
     * @dataProvider provideTestCases
     */
    public function testIsNice($input, $expectedOutput)
    {
        $this->assertSame($expectedOutput, $this->naughtyOrNice->isNice($input));
    }

    public function testCanCountNice()
    {
        $input = [];
        $niceStrings = 0;

        foreach($this->provideTestCases() as $testCase)
        {
            $input[] = $testCase[0];
            if ($testCase[1])
            {
                $niceStrings++;
            }
        }

        $this->assertEquals($niceStrings, $this->naughtyOrNice->countAllNaughtyOrNice(implode(PHP_EOL, $input)));
    }
}
