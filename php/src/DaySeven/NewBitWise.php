<?php

namespace PatrickRose\DaySeven;


class NewBitWise extends BitWise
{
    protected function getRequiredValue()
    {
        $this->parseInputString('3176 -> b');
        $this->calculateAnswers();

        return $this->getValue('a');
    }

}