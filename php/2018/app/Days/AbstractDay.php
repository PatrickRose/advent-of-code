<?php

namespace PatrickRose\AdventOfCode\Days;

use Symfony\Component\Console\Input\Input;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\Output;
use Symfony\Component\Console\Output\OutputInterface;

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

    public function __construct(OutputInterface $output)
    {
        $this->output = $output;
    }

    /**
     * @param InputInterface $input
     */
    public function setInput(InputInterface $input)
    {
        $this->inputInterface = $input;
    }

    abstract protected function getPuzzleInput(): string;

    abstract public function getAnswer(\bool $partTwo): string;

}
