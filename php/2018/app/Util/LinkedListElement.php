<?php

namespace PatrickRose\AdventOfCode\Util;

class LinkedListElement
{

    private $value;
    private $before;
    private $after;

    public function __construct($value, LinkedListElement $before = null, LinkedListElement $after = null)
    {
        $this->value = $value;

        if ($before === null) {
            $before = $this;
        }
        $this->before = $before;

        if ($after === null) {
            $after = $this;
        }
        $this->after = $after;
    }

    public function insertAfter($value): LinkedListElement
    {
        $toInsert = new LinkedListElement($value, $this, $this->after);
        $this->after->setBefore($toInsert);
        $this->after = $toInsert;

        return $toInsert;
    }

    public function remove(): LinkedListElement
    {
        $this->before->setAfter($this->after);
        $this->after->setBefore($this->before);

        return $this->after;
    }

    /**
     * @return LinkedListElement
     */
    public function getBefore(): LinkedListElement
    {
        return $this->before;
    }

    /**
     * @param LinkedListElement $before
     */
    public function setBefore(LinkedListElement $before): void
    {
        $this->before = $before;
    }

    /**
     * @return LinkedListElement
     */
    public function getAfter(): LinkedListElement
    {
        return $this->after;
    }

    /**
     * @param LinkedListElement $after
     */
    public function setAfter(LinkedListElement $after): void
    {
        $this->after = $after;
    }

    /**
     * @return mixed
     */
    public function getValue()
    {
        return $this->value;
    }
}
