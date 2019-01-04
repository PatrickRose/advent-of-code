<?php


namespace PatrickRose\AdventOfCode\Util;


class Registers
{

    private $registers = [
        0, 0, 0, 0
    ];

    public function getValueOf($register): int
    {
        if ($register < 0 || $register > 3) {
            throw new \InvalidArgumentException("Unknown register");
        }
        return $this->registers[$register];
    }

    public function setValueOf($register, int $value)
    {
        if ($register < 0 || $register > 3) {
            throw new \InvalidArgumentException("Unknown register");
        }
        $this->registers[$register] = $value;
    }

    public function getAll()
    {
        return $this->registers;
    }
}
