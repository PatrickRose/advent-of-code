<?php

namespace PatrickRose\DaySeven;


use PatrickRose\AdventOfCode;

class BitWise extends AdventOfCode
{

    public $wires = [];

    const OPERATORS = ['NOT', 'OR', 'AND', 'RSHIFT', 'LSHIFT'];

    protected function runPuzzleInput()
    {
        foreach(explode(PHP_EOL, file_get_contents(__DIR__ . '/input.txt')) as $input)
        {
            $this->parseInputString($input);
        }

        return $this->getRequiredValue();
    }

    protected function getRequiredValue()
    {
        $this->calculateAnswers();

        return $this->wires['a'];
    }

    public function parseInputString($string)
    {
        list($input, $variable) = explode(' -> ', $string);

        if (is_numeric($input)) {
            $input = (int)$input;
        }

        $this->wires[$variable] = $input;
    }

    public function calculateAnswers($attempt = 0)
    {
        if ($attempt > count($this->wires)) {
            // Not solvable
            return false;
        }

        // We can dream
        $solved = true;

        foreach ($this->wires as $variable => $input) {
            $wires = explode(' ', $input);
            if (count($wires) == 1 && is_numeric($wires[0])) {
                // Already solved
                continue;
            }

            // Do we know the values for these?
            foreach ($wires as $wire) {
                if (!$this->hasValue($wire)) {
                    $solved = false;
                    continue 2;
                }
            }


            // Now we just parse it
            // Is it a value?
            if (count($wires) == 1)
            {
                $value = $this->getValue($wires[0]);
            }
            // Is it a NOT?
            elseif ($wires[0] == 'NOT') {
                $value = ~ (int) $this->getValue($wires[1]);
            } else {
                // It's a different operator
                switch ($wires[1]) {
                    case 'AND':
                        $value = $this->getValue($wires[0]) & $this->getValue($wires[2]);
                        break;
                    case 'OR':
                        $value = $this->getValue($wires[0]) |  $this->getValue($wires[2]);
                        break;
                    case 'LSHIFT':
                        $value = $this->getValue($wires[0]) <<  $this->getValue($wires[2]);
                        break;
                    case 'RSHIFT':
                        $value = $this->getValue($wires[0]) >>  $this->getValue($wires[2]);
                        break;
                    default:
                        throw new \LogicException('Unknown operator ' . var_export($wires[1], true));
                }
            }

            $this->wires[$variable] = $value & 65535;
        }

        return $solved ?: $this->calculateAnswers($attempt + 1);
    }

    private function hasValue($wire)
    {
        return in_array($wire, self::OPERATORS)
        // Is it a digit?
        || is_numeric($wire)
        // Have we calculated the value of this wire?
        || is_numeric($this->wires[$wire]);
    }

    protected function getValue($variable)
    {
        if (is_numeric($variable))
        {
            return (int) $variable;
        }

        return $this->wires[$variable];
    }
}