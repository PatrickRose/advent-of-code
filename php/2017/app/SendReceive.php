<?php

namespace PatrickRose\AdventOfCode;

class SendReceive
{

    private $position = 0;

    public $waiting = false;

    private $registers = [];
    private $partTwo;
    private $instructions;
    private $ranInstruction = [];

    public function __construct($id, $instructions, $partTwo)
    {
        $this->registers['p'] = $partTwo ? $id : 0;
        $this->partTwo = $partTwo;
        $this->instructions = $instructions;
    }

    public function run($received = [])
    {
        $this->waiting = false;
        $numInstructions = count($this->instructions);
        $sending = [];

        do {
            $thisInstruction = $this->instructions[$this->position];
            list($instructionType, $arguments) = explode(
                ' ',
                $thisInstruction, 2
            );

            $arguments = explode(' ', $arguments);
            if (!isset($this->ranInstruction[$instructionType])) {
                $this->ranInstruction[$instructionType] = 0;
            }

            $this->ranInstruction[$instructionType] += 1;

            switch ($instructionType) {
                // snd X plays a sound with a frequency equal to the value of X.
                case 'snd':
                    $sending[] = $this->getRegisterValue($arguments[0]);
                    break;
                // set X Y sets register X to the value of Y.
                case 'set':
                    $this->registers[$arguments[0]] = $this->getRegisterValue(
                        $arguments[1]
                    );
                    break;
                // add X Y increases register X by the value of Y.
                case 'add':
                    if (!isset($this->registers[$arguments[0]])) {
                        $this->registers[$arguments[0]] = 0;
                    }

                    $this->registers[$arguments[0]] += $this->getRegisterValue(
                        $arguments[1]
                    );
                    break;
                // mul X Y sets register X to the result of multiplying the
                // value contained in register X by the value of Y.
                case 'mul':
                    if (!isset($this->registers[$arguments[0]])) {
                        $this->registers[$arguments[0]] = 0;
                    }
                    $this->registers[$arguments[0]] *= $this->getRegisterValue(
                        $arguments[1]
                    );
                    break;
                //mod X Y sets register X to the remainder of dividing the
                // value contained in register X by the value of Y (that is,
                // it sets X to the result of X modulo Y).
                case 'mod':
                    if (!isset($this->registers[$arguments[0]])) {
                        $this->registers[$arguments[0]] = 0;
                    }

                    $toModBy = $this->getRegisterValue($arguments[1]);

                    if ($toModBy != 0) {
                        $this->registers[$arguments[0]] %= $toModBy;
                    }

                    break;
                // rcv X recovers the frequency of the last sound played, but
                // only when the value of X is not zero. (If it is zero, the
                // command does nothing.)
                case 'rcv':
                    if ($this->partTwo) {
                        if (empty($received)) {
                            $this->waiting = true;
                            return $sending;
                        } else {
                            $toAdd = array_shift($received);
                            $this->registers[$arguments[0]] = $toAdd;
                        }
                    } else {
                        if ($this->getRegisterValue($arguments[0]) != 0) {
                            return end($sending);
                        }
                    }
                    break;
                case 'jgz':
                    if ($this->getRegisterValue($arguments[0]) > 0) {
                        $this->position += $this->getRegisterValue($arguments[1]);
                    } else {
                        $this->position++;
                    }

                    break;
                case 'jnz':
                    if ($this->getRegisterValue($arguments[0]) != 0) {
                        $this->position += $this->getRegisterValue($arguments[1]);
                    } else {
                        $this->position++;
                    }
                    break;
                case 'sub':
                    if (!isset($this->registers[$arguments[0]])) {
                        $this->registers[$arguments[0]] = 0;
                    }

                    $this->registers[$arguments[0]] -= $this->getRegisterValue(
                        $arguments[1]
                    );
                    break;
                default:
                    throw new \InvalidArgumentException("Unknown command $instructionType");
            }

            if (!in_array($instructionType, ['jnz', 'jgz'])) {
                $this->position++;
            }
        } while ($this->position > 0 && $this->position < $numInstructions);
    }

    public function getRegisterValue($value)
    {
        return is_numeric($value) ? $value : $this->registers[$value] ?? 0;
    }

    /**
     * @return array
     */
    public function getRanInstruction(): array
    {
        return $this->ranInstruction;
    }

    public function setRegisterValue($register, $value)
    {
        $this->registers[$register] = $value;
    }
}
