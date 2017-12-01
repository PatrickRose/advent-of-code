<?php

require_once 'vendor/autoload.php';
ini_set('memory_limit', '-1');
foreach ($argv as $arg) {
    if (strpos($arg, 'run.php') !== false) {
        continue;
    }

    switch ($arg) {
        case '5.1':
            $class = new \PatrickRose\DayFive\NaughtyOrNice();
            echo 'Answer to day 5 part 1 is ' . $class->getAnswer();
            break;
        case '5.2':
            $class = new \PatrickRose\DayFive\NewNaughtyOrNice();
            echo 'Answer to day 5 part 2 is ' . $class->getAnswer();
            break;
        case '6.1':
            $class = new \PatrickRose\DaySix\Lights();
            echo 'Answer to day 6 part 1 is ' . $class->getAnswer();
            break;
        case '6.2':
            $class = new \PatrickRose\DaySix\NewLights();
            echo 'Answer to day 6 part 2 is ' . $class->getAnswer();
            break;
        case '7.1':
            $class = new \PatrickRose\DaySeven\BitWise();
            echo 'Answer to day 7 part 1 is ' . $class->getAnswer();
            break;
        case '7.2':
            $class = new \PatrickRose\DaySeven\NewBitWise();
            echo 'Answer to day 7 part 2 is ' . $class->getAnswer();
            break;
        case '8.1':
            $class = new PatrickRose\DayEight\StringLength();
            echo 'Answer to day 8 part 1 is ' . $class->getAnswer();
            break;
        case '8.2':
            $class = new PatrickRose\DayEight\NewStringLength();
            echo 'Answer to day 8 part 2 is ' . $class->getAnswer();
            break;
        case '9.1':
            $class = new PatrickRose\DayNine\ShortestRoute();
            echo 'Answer to day 9 part 1 is ' . $class->getAnswer();
            break;
        case '9.2':
            $class = new PatrickRose\DayEight\NewStringLength();
            echo 'Answer to day 8 part 2 is ' . $class->getAnswer();
            break;
    }
}