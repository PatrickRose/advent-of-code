import queue
import sys

from common.Intcode import Intcode

puzzle = [int(x) for x in sys.stdin.readlines()[0].split(',')]

q1 = queue.Queue()
q1.put(1)

intcode = Intcode(5, q1)

o1 = intcode.run_program(puzzle.copy())
part1 = []

while True:
    try:
        part1.append(o1.get_nowait())
    except queue.Empty:
        break

print("Part 1: " + str(part1))

q2 = queue.Queue()
q2.put(5)
intcode = Intcode(5, q2)

intcode.run_program(puzzle.copy())
part2 = []

while True:
    try:
        part2.append(o1.get_nowait())
    except queue.Empty:
        break

print("Part 2: " + str(part2))
