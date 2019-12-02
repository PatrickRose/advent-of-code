import sys

## Input should only be one line
input = sys.stdin.readlines()[0].strip()

opcodes = list(map(int, input.split(',')))

def run_program(opcodes, input1, input2):
    position = 0
    opcodes[1] = input1
    opcodes[2] = input2

    while True:
        opcode = opcodes[position]
        p1,p2,storage = opcodes[position+1],opcodes[position+2],opcodes[position+3]

        arg1,arg2 = opcodes[p1], opcodes[p2]
        if opcode == 1:
            value = arg1 + arg2
        elif opcode == 2:
            value = arg1 * arg2
        else:
            assert opcode == 99
            break

        opcodes[storage] = value
        position += 4

    return opcodes[0]

print ("Part One: " + str(run_program(opcodes.copy(), 12, 2)))

for i in range(100):
    for j in range(100):
        value = run_program(opcodes.copy(), i, j)
        if value == 19690720:
            print ("Part two: " + str((100 * i + j)))
            exit(0)

print("Didn't find a value...")
exit(1) 
