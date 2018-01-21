<?php

namespace PatrickRose\AdventOfCode\Days;

class HaltingProblem extends AbstractDay
{

    protected function getPuzzleInput(): string
    {
        return <<<INPUT
Begin in state A.
Perform a diagnostic checksum after 12386363 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state E.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state C.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the right.
    - Continue with state A.

In state C:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state D.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the right.
    - Continue with state C.

In state D:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state E.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state F.

In state E:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state C.

In state F:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state E.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
INPUT;

    }

    public function getAnswer(bool $partTwo): string
    {
        // First, parse the input
        $input = $this->getPuzzleInput();

        // The first two lines tell us what our starting state and steps are
        list($startStateDesc, $numStepsDesc, $stateDescriptions) = explode("\n", $input, 3);

        preg_match('/Begin in state (\w)./', $startStateDesc, $matches);
        $currentState = $matches[1];

        preg_match('/Perform a diagnostic checksum after (\d+) steps./', $numStepsDesc, $matches);
        $numSteps = $matches[1];

        $stateDescriptions = explode("In state ", trim($stateDescriptions));

        // First state description is garbage
        unset($stateDescriptions[0]);

        /** @var State[] $states */
        $states = [];

        $turing = new TuringMachine();

        foreach ($stateDescriptions as $stateDescription) {
            // Massive fun regex time!
            preg_match('/(\w):\s+If the current value is 0:\s+- Write the value (\d).\s+- Move one slot to the (left|right).\s+- Continue with state (\w+).\s+If the current value is 1:\s+- Write the value (\d).\s+- Move one slot to the (left|right).\s+- Continue with state (\w+)./', $stateDescription, $matches);
            $states[$matches[1]] = new State(
                $turing,
                [
                    'write' => $matches[2],
                    'move' => $matches[3] == 'left' ? -1 : 1,
                    'next' => $matches[4],
                ],
                [
                    'write' => $matches[5],
                    'move' => $matches[6] == 'left' ? -1 : 1,
                    'next' => $matches[7],
                ]
            );
        }

        for ($i = 0; $i < $numSteps; $i++) {
            $currentState = $states[$currentState]->run();
        }

        return $turing->checkSum();
    }
}

class TuringMachine
{

    private $tape = [];

    private $position = 0;

    public function move($amount)
    {
        $this->position += $amount;
    }

    public function checkSum()
    {
        return count($this->tape);
    }

    public function getCurrentValue(): bool
    {
        return isset($this->tape[$this->position]);
    }

    public function writeValue(bool $value)
    {
        if ($value) {
            $this->tape[$this->position] = $value;
        } else {
            unset($this->tape[$this->position]);
        }
    }

}

class State
{
    /**
     * @var TuringMachine
     */
    private $turing;
    /**
     * @var array
     */
    private $false;
    /**
     * @var array
     */
    private $true;

    /**
     * @param TuringMachine $turing
     * @param array $false
     * @param array $true
     */
    public function __construct(TuringMachine $turing, array $false, array $true)
    {
        $this->turing = $turing;
        $this->false = $false;
        $this->true = $true;
    }

    public function run(): string
    {
        $action = $this->turing->getCurrentValue() ? $this->true : $this->false;

        $this->turing->writeValue($action['write']);
        $this->turing->move($action['move']);

        return $action['next'];
    }
}
