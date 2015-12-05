<?php

require_once 'vendor/autoload.php';

foreach($argv as $arg)
{
    if (strpos($arg, 'run.php') !== false)
    {
        continue;
    }

    switch ($arg)
    {
        case '5.1':
            $class = new \PatrickRose\DayFive\NaughtyOrNice();
            echo 'Answer to day 5 part 1 is ' . $class->runPuzzleInput();
            break;
        case '5.2':
            $class = new \PatrickRose\DayFive\NewNaughtyOrNice();
            echo 'Answer to day 5 part 2 is ' . $class->runPuzzleInput();
            break;
    }
}