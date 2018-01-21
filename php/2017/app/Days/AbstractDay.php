<?php

namespace PatrickRose\AdventOfCode\Days;

use Symfony\Component\Console\Input\Input;
use Symfony\Component\Console\Output\Output;

abstract class AbstractDay
{

    /**
     * @var Output
     */
    protected $output;

    /**
     * @var Input
     */
    protected $inputInterface;

    public function __construct(Output $output)
    {
        $this->output = $output;
    }

    /**
     * @param mixed $input
     */
    public function setInput(Input $input)
    {
        $this->inputInterface = $input;
    }

    abstract protected function getPuzzleInput(): string;

    abstract public function getAnswer(bool $partTwo): string;

}
