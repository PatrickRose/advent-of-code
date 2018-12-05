<?php


namespace PatrickRose\AdventOfCode;

use PatrickRose\AdventOfCode\Days\AbstractDay;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
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

    private function getDay($day, OutputInterface $output): AbstractDay
    {
        switch ($day)
        {
            case 1:
                return new Days\ChronalCalibration($output);
            case 2:
                return new Days\InventoryManagementSystem($output);
            case 3:
                return new Days\NoMatterHowYouSliceIt($output);
            case 4:
                return new Days\ReposeRecord($output);
            case 5:
                return new Days\AlchemicalReduction($output);
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
        }

        throw new \InvalidArgumentException("Unknown day $day");
    }
}
