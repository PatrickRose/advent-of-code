import sys

from common.Intcode import Intcode

## Input should only be one line
input = sys.stdin.readlines()[0].strip()

opcodes = [int(x) for x in input.split(',')]

program = Intcode(2)

print ("Part One: " + str(program.run_program(opcodes.copy(), 12, 2)))

for i in range(100):
    for j in range(100):
        value = program.run_program(opcodes.copy(), i, j)
        if value == 19690720:
            print ("Part two: " + str((100 * i + j)))
            exit(0)

print("Didn't find a value...")
exit(1) 
