<?php


namespace PatrickRose\AdventOfCode;

use PatrickRose\AdventOfCode\Days\AbstractDay;
use PatrickRose\AdventOfCode\Days\CheckSums;
use PatrickRose\AdventOfCode\Days\Debugger;
use PatrickRose\AdventOfCode\Days\DigitSums;
use PatrickRose\AdventOfCode\Days\Maze;
use PatrickRose\AdventOfCode\Days\Passphrases;
use PatrickRose\AdventOfCode\Days\SpiralMemory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\Output;
use Symfony\Component\Console\Output\OutputInterface;

class AdventOfCode extends Command
{
    protected function configure()
    {
        $this->addArgument('day', InputArgument::REQUIRED, 'The day to generate');
        $this->addOption('part-two', 'p', InputOption::VALUE_NONE, 'Whether to do part two');
        parent::configure();
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $day = $this->getDay($input->getArgument('day'), $output);

        $output->writeln($day->getAnswer($input->getOption('part-two')));
    }

    private function getDay($day, Output $output): AbstractDay
    {
        switch ($day)
        {
            case 1:
                return new DigitSums($output);
            case 2:
                return new CheckSums($output);
            case 3:
                return new SpiralMemory($output);
            case 4:
                return new Passphrases($output);
            case 5:
                return new Maze($output);
            case 6:
                return new Debugger($output);
        }

        throw new \InvalidArgumentException("Unknown day $day");
    }
}
