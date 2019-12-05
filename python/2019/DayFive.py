import sys

from common.Intcode import Intcode

intcode = Intcode(5)

puzzle = [int(x) for x in sys.stdin.readlines()[0].split(',')]

print("Part 1: " + str(intcode.run_program(puzzle.copy(), [1])))

print("Part 2: " + str(intcode.run_program(puzzle.copy(), [5])))
