<?php

namespace PatrickRose\AdventOfCode\Days;

use Symfony\Component\Console\Output\Output;

abstract class AbstractDay
{

    /**
     * @var Output
     */
    private $output;

    public function __construct(Output $output)
    {
        $this->output = $output;
    }

    abstract protected function getPuzzleInput(): string;

    abstract public function getAnswer(bool $partTwo): string;

}
