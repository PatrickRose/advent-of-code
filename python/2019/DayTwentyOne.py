import sys

import common.Queue
import queue

from common.Intcode import Intcode

def print_output(value):
    msg = ""

    for x in value:
        try:
            msg += chr(x)
        except ValueError: # if it's out of the ascii range
            msg += str(x)

    print (msg)

puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]
q1 = queue.Queue()

PART_ONE_COMMAND = [
    "NOT C J",
    "AND D J",
    "NOT A T",
    "OR T J"
]

[q1.put(ord(x)) for x in "\n".join(PART_ONE_COMMAND + ["WALK"]) + "\n"]

intcode = Intcode(21, q1)
part_one = common.Queue.queue_to_list(intcode.run_program(puzzle_input.copy()))

print_output(part_one)

PART_TWO_COMMAND = [
    "OR  A T",
    "AND B T",
    "AND C T",
    "NOT T J",
    "OR  E T",
    "OR  H T",
    "AND T J",
    "AND D J",
    "RUN"
]


q2 = queue.Queue()
[q2.put(ord(x)) for x in "\n".join(PART_TWO_COMMAND + ["RUN"]) + "\n"]

intcode = Intcode(21, q2)
part_two = common.Queue.queue_to_list(intcode.run_program(puzzle_input.copy()))

print_output(part_two)

