<?php

namespace PatrickRose\AdventOfCode\Util\Instructions;

use PatrickRose\AdventOfCode\Util\Registers;

abstract class AbstractInstruction
{

    public const INSTRUCTIONS = [
        Addi::class,
        Addr::class,
        Bani::class,
        Banr::class,
        Bori::class,
        Borr::class,
        Eqir::class,
        Eqri::class,
        Eqrr::class,
        Gtir::class,
        Gtri::class,
        Gtrr::class,
        Muli::class,
        Mulr::class,
        Seti::class,
        Setr::class,
    ];

    /**
     * @var Registers
     */
    protected $registers;

    public function __construct(Registers $registers)
    {
        $this->registers = $registers;
    }

    public static function matches($before, $instruction, $after): bool
    {
        $registers = new Registers();

        foreach ($before as $i => $value) {
            $registers->setValueOf($i, $value);
        }

        $test = new static($registers);

        // Perform the instruction
        $test->performInstruction($instruction[1], $instruction[2], $instruction[3]);

        return $after == $registers->getAll();
    }

    public function performInstruction(int $a, int $b, int $c)
    {
        $a = $this->getAValue($a);
        $b = $this->getBValue($b);

        $value = $this->performAction($a, $b);

        $this->registers->setValueOf($c, $value);
    }

    abstract protected function getAValue(int $a): int;

    abstract protected function getBValue(int $b): int;

    abstract protected function performAction(int $a, int $b): int;

}
