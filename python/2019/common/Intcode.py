import queue

class Intcode:

    input = []

    def __init__(self, version, input = queue.Queue(), output = queue.Queue()):
        self.version = version
        self.input = input
        self.output = output

    def run_program(self, memory):
        self.position = 0
        self.memory = memory
        while True:
            unparsed_opcode = "%05d" % int(self.memory[self.position])

            opcode = int(unparsed_opcode[-2:])

            modes = [int(x) for x in unparsed_opcode[:-2]]

            if opcode == 1:
                self.add(modes)
            elif opcode == 2:
                self.multiply(modes)
            elif (opcode == 3 and self.version >= 5):
                self.do_input(modes)
            elif (opcode == 4 and self.version >= 5):
                self.do_output(modes)
            elif (opcode == 5 and self.version >= 5):
                self.jump_if_true(modes)
            elif (opcode == 6 and self.version >= 5):
                self.jump_if_false(modes)
            elif (opcode == 7 and self.version >= 5):
                self.less_than(modes)
            elif (opcode == 8 and self.version >= 5):
                self.equals(modes)
            else:
                assert opcode == 99
                break

        if self.version == 2:
            return self.memory[0]
        else:
            return self.output

    def parse_args(self, positions, modes):
        to_return = []
        for position in positions:
            value = self.memory[position]
            if modes.pop() == 0:
                value = self.memory[value]

            to_return.append(value)

        return to_return

    def add(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position + 1,
                self.position + 2,
            ],
            modes
        )
        output = self.memory[self.position+3]
        
        self.memory[output] = arg1 + arg2
        self.position += 4

    def multiply(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position + 1,
                self.position + 2,
            ],
            modes
        )
        output = self.memory[self.position+3]
        
        self.memory[output] = arg1 * arg2
        self.position += 4

    def do_input(self, modes):
        output = self.memory[self.position+1]
        self.memory[output] = self.input.get()
        self.position += 2

    def do_output(self, modes):
        output = self.memory[self.position+1]

        self.output.put(self.memory[output])
        self.position += 2

    def jump_if_true(self, modes):
        test, jump_to = self.parse_args(
            [
                self.position+1, self.position+2
            ],
            modes
        )

        if test == 0:
            self.position += 3
        else:
            self.position = jump_to

    def jump_if_false(self, modes):
        test, jump_to = self.parse_args(
            [
                self.position+1, self.position+2
            ],
            modes
        )

        if test != 0:
            self.position += 3
        else:
            self.position = jump_to

    def less_than(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position+1, self.position+2
            ],
            modes
        )

        output = self.memory[self.position+3]

        if arg1 < arg2:
            to_place = 1
        else:
            to_place = 0

        self.memory[output] = to_place
        self.position += 4

    def equals(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position+1, self.position+2
            ],
            modes
        )

        output = self.memory[self.position+3]

        if arg1 == arg2:
            to_place = 1
        else:
            to_place = 0

        self.memory[output] = to_place
        self.position += 4

class InputRequiredException(Exception):

    output = []
    
    def __init__(self, output):
        self.output = output
