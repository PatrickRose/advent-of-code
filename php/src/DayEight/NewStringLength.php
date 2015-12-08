<?php

namespace PatrickRose\DayEight;


class NewStringLength extends StringLength
{
    public function getStringLength($input)
    {
        return strlen(str_replace(['\\', '"'], '\\\\', $input)) + 2;

    }

    public function getActualLength($input)
    {
        return strlen($input);
    }

}