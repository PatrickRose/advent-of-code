import sys
from common.Intcode import Intcode
import common.Queue
import queue


puzzle_input = [int(x) for x in sys.stdin.readlines()[0].split(',')]
q1 = queue.Queue()
q1.put(1)

intcode = Intcode(9, q1)

part_one = common.Queue.queue_to_list(intcode.run_program(puzzle_input.copy()))

if len(part_one) != 1:
    print ("Got more than one output", part_one)
    exit(1)

print ("Part one:", part_one)

q2 = queue.Queue()
q2.put(2)

intcode = Intcode(9, q2)

part_two = common.Queue.queue_to_list(intcode.run_program(puzzle_input.copy()))

print ("Part two:", part_two)
