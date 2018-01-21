<?php


namespace PatrickRose\AdventOfCode;

use PatrickRose\AdventOfCode\Days\AbstractDay;
use PatrickRose\AdventOfCode\Days\CheckSums;
use PatrickRose\AdventOfCode\Days\CommunicationPipes;
use PatrickRose\AdventOfCode\Days\Coprocessor;
use PatrickRose\AdventOfCode\Days\DancingCode;
use PatrickRose\AdventOfCode\Days\Debugger;
use PatrickRose\AdventOfCode\Days\Defragmentation;
use PatrickRose\AdventOfCode\Days\DigitSums;
use PatrickRose\AdventOfCode\Days\DuelingGenerators;
use PatrickRose\AdventOfCode\Days\Duet;
use PatrickRose\AdventOfCode\Days\ElectromagneticMoat;
use PatrickRose\AdventOfCode\Days\Firewall;
use PatrickRose\AdventOfCode\Days\FractalArt;
use PatrickRose\AdventOfCode\Days\GridMaps;
use PatrickRose\AdventOfCode\Days\HaltingProblem;
use PatrickRose\AdventOfCode\Days\KnotHashing;
use PatrickRose\AdventOfCode\Days\Maze;
use PatrickRose\AdventOfCode\Days\ParticleSwarm;
use PatrickRose\AdventOfCode\Days\Passphrases;
use PatrickRose\AdventOfCode\Days\RecursiveTree;
use PatrickRose\AdventOfCode\Days\RegisterInstructions;
use PatrickRose\AdventOfCode\Days\SeriesOfTubes;
use PatrickRose\AdventOfCode\Days\Spinlock;
use PatrickRose\AdventOfCode\Days\SpiralMemory;
use PatrickRose\AdventOfCode\Days\SporificaVirus;
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
        $day->setInput($input);

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
            case 13:
                return new Firewall($output);
            case 14:
                return new Defragmentation($output);
            case 15:
                return new DuelingGenerators($output);
            case 16:
                return new DancingCode($output);
            case 17:
                return new Spinlock($output);
            case 18:
                return new Duet($output);
            case 19:
                return new SeriesOfTubes($output);
            case 20:
                return new ParticleSwarm($output);
            case 21:
                return new FractalArt($output);
            case 22:
                return new SporificaVirus($output);
            case 23:
                return new Coprocessor($output);
            case 24:
                return new ElectromagneticMoat($output);
            case 25:
                return new HaltingProblem($output);
        }

        throw new \InvalidArgumentException("Unknown day $day");
    }
}
