<?php

use PatrickRose\DayFive\NaughtyOrNice;

class NaughtyOrNiceTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var NaughtyOrNice
     */
    private $naughtyOrNice;

    protected function setUp()
    {
        parent::setUp();

        $this->naughtyOrNice = new NaughtyOrNice;
    }


    protected function tearDown()
    {
        $this->naughtyOrNice = null;

        parent::tearDown();
    }

    public function provideVowels()
    {
        $allowedVowels = ['a','e','i','o','u'];

        $toReturn = [];

        foreach($allowedVowels as $firstVowel)
        {
            foreach($allowedVowels as $secondVowel)
            {
                foreach ($allowedVowels as $thirdVowel)
                {
                    $toReturn[] = [$firstVowel . $secondVowel . $thirdVowel];
                }
            }
        }

        return $toReturn;
    }

    /**
     * @dataProvider provideVowels
     */
    public function testVowelFunction($input)
    {
        $this->assertTrue($this->naughtyOrNice->containsThreeVowels($input));
    }

    /**
     * @dataProvider provideVowels
     */
    public function testVowelFunctionReturnsFalse($input)
    {
        $input = substr($input, 0, 2) . 'q';
        $this->assertFalse($this->naughtyOrNice->containsThreeVowels($input));
    }

    public function provideDoubleLetters()
    {
        $allLetters = 'qwertyuiopasdfghjklzxcvbnm';
        $toReturn = [];
        for($i = 0; $i < strlen($allLetters); $i++)
        {
            $letter = $allLetters[$i];
            $toReturn[] = [$letter . $letter];
        }

        return $toReturn;
    }

    /**
     * @dataProvider provideDoubleLetters
     */
    public function testDoubleLetter($input)
    {
        $this->assertTrue($this->naughtyOrNice->hasDoubleLetter($input));
    }

    /**
     * @dataProvider provideDoubleLetters
     */
    public function testDoubleLetterReturnsFalse($input)
    {
        $input = $input[0] . ($input[0] == 'a' ? 'q' : 'a') . $input[1];
        $this->assertFalse($this->naughtyOrNice->hasDoubleLetter($input));
    }

    public function provideBadStrings()
    {
        return [
            ['ab'],
            ['cd'],
            ['pq'],
            ['xy']
        ];
    }

    /**
     * @dataProvider provideBadStrings
     */
    public function testFindingBadStrings($input)
    {
        $this->assertTrue($this->naughtyOrNice->hasBadString($input));
    }

    /**
     * @dataProvider provideBadStrings
     */
    public function testFindingBadStringsReturnsFalse($input)
    {
        $input = $input[0] . 'i' . $input[1];
        $this->assertFalse($this->naughtyOrNice->hasBadString($input));
    }

    public function provideTestCases()
    {
        return [
            ['ugknbfddgicrmopn', true],
            ['aaa', true],
            ['jchzalrnumimnmhp', false],
            ['haegwjzuvuyypxyu', false],
            ['dvszwmarrgswjxmb', false],
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
