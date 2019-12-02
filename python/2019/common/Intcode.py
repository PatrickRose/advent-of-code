class Intcode:

    def __init__(self, version):
        self.version = version

    def run_program(self, opcodes, input1, input2):
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
