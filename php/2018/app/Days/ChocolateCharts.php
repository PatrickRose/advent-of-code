<?php


namespace PatrickRose\AdventOfCode\Days;

use PatrickRose\AdventOfCode\Util\LinkedListElement;

class ChocolateCharts extends AbstractDay
{
    protected function getPuzzleInput(): string
    {
        return 846601;
    }

    public function getAnswer(bool $partTwo): string
    {
        $input = $this->getPuzzleInput();

        $elfOne = new LinkedListElement(3);
        $elfTwo = $elfOne->insertAfter(7);
        $endOfList = $elfTwo;

        $recipeStr = '37';
        $numRecipes = 2;

        // This answer works for a small number of iterations, but OOMs
        // on larger ones - since the answer is in the 20 million mark
        // there's not much we can do about it

        do {
            $elfOneScore = $elfOne->getValue();
            $elfTwoScore = $elfTwo->getValue();

            foreach (str_split($elfOneScore + $elfTwoScore) as $toAdd) {
                $recipeStr .= $toAdd;
                $endOfList = $endOfList->insertAfter($toAdd);
                $numRecipes++;
            }

            if (strlen($recipeStr) > strlen($input) + 2) {
                $recipeStr = substr($recipeStr, -strlen($input) - 2);
            }

            for ($i = 0; $i <= $elfOneScore; $i++) {
                $elfOne = $elfOne->getAfter();
            }
            for ($i = 0; $i <= $elfTwoScore; $i++) {
                $elfTwo = $elfTwo->getAfter();
            }

            if ($partTwo) {
                $finished = strpos((string)$recipeStr, (string)$input);
            } else {
                $finished = $numRecipes > ($input + 10);
            }
        } while (!$finished);

        while ($numRecipes > $input) {
            $endOfList = $endOfList->getBefore();
            $numRecipes--;
        }

        if ($partTwo) {
            while ($endOfList->getValue() != ($input % 10)) {
                $endOfList = $endOfList->getBefore();
                $numRecipes--;
            }
            return $numRecipes - strlen($input);
        }

        $answer = '';
        for ($i = 0; $i < 10; $i++) {
            $answer .= $endOfList->getValue();
            $endOfList = $endOfList->getAfter();
        }

        return $answer;
    }
}
