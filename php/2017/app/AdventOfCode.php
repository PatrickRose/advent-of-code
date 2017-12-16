<?php


namespace PatrickRose\AdventOfCode;

use PatrickRose\AdventOfCode\Days\AbstractDay;
use PatrickRose\AdventOfCode\Days\CheckSums;
use PatrickRose\AdventOfCode\Days\CommunicationPipes;
use PatrickRose\AdventOfCode\Days\Debugger;
use PatrickRose\AdventOfCode\Days\DigitSums;
use PatrickRose\AdventOfCode\Days\GridMaps;
use PatrickRose\AdventOfCode\Days\KnotHashing;
use PatrickRose\AdventOfCode\Days\Maze;
use PatrickRose\AdventOfCode\Days\Passphrases;
use PatrickRose\AdventOfCode\Days\RecursiveTree;
use PatrickRose\AdventOfCode\Days\RegisterInstructions;
use PatrickRose\AdventOfCode\Days\SpiralMemory;
use PatrickRose\AdventOfCode\Days\StreamProcessing;
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
            case 7:
                return new RecursiveTree($output);
            case 8:
                return new RegisterInstructions($output);
            case 9:
                return new StreamProcessing($output);
            case 10:
                return new KnotHashing($output);
            case 11:
                return new GridMaps($output);
            case 12:
                return new CommunicationPipes($output);
        }

        throw new \InvalidArgumentException("Unknown day $day");
    }
}
