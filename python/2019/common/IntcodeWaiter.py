import collections
import queue


class Intcode:
    relative_base = 0

    opcode_human = {
        1: 'add',
        2: 'multiply',
        3: 'input',
        4: 'output',
        5: 'jump_if_true',
        6: 'jump_if_false',
        7: 'less_than',
        8: 'equals',
        9: 'relative',
        99: 'end'
    }

    def __init__(self, version, input=queue.Queue(), output=queue.Queue()):
        self.version = version
        self.input = input
        self.output = output

    def run_program(self, memory):
        self.position = 0
        self.memory = collections.defaultdict(lambda: 0, enumerate(memory))
        return self.resume()

    def resume(self):
        self.waiting = False
        while True:
            unparsed_opcode = "%05d" % int(self.memory[self.position])

            opcode = int(unparsed_opcode[-2:])

            modes = [int(x) for x in unparsed_opcode[:-2]]

            if opcode == 1:
                self.add(modes)
            elif opcode == 2:
                self.multiply(modes)
            elif (opcode == 3 and self.version >= 5):
                if not self.do_input(modes):
                    self.waiting = True
                    break
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
            elif (opcode == 9 and self.version >= 9):
                self.relative(modes)
            else:
                print(opcode)
                assert opcode == 99
                break

        if self.version == 2:
            return self.memory[0]
        else:
            return self.output

    def get_memory_at(self, position):
        assert position in self.memory or self.version >= 9

        return self.memory[position]

    def put_memory_at(self, position, to_set):
        assert position in self.memory or self.version >= 9

        self.memory[position] = to_set

    def parse_args(self, positions, modes):
        to_return = []
        for position in positions:
            value = self.get_memory_at(position)
            this_mode = modes.pop()
            if this_mode == 0:
                value = self.get_memory_at(value)
            elif this_mode == 2:
                assert self.version >= 9
                value = self.get_memory_at(self.relative_base + value)

            to_return.append(value)

        return to_return

    def relative(self, modes):
        arg1 = self.parse_args([self.position + 1], modes)[0]
        self.relative_base += arg1
        self.position += 2

    def add(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position + 1,
                self.position + 2,
            ],
            modes
        )
        output = (self.relative_base + self.get_memory_at(
            self.position + 3)) if modes.pop() == 2 else self.get_memory_at(self.position + 3)

        self.put_memory_at(output, arg1 + arg2)
        self.position += 4

    def multiply(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position + 1,
                self.position + 2,
            ],
            modes
        )
        output = (self.relative_base + self.get_memory_at(
            self.position + 3)) if modes.pop() == 2 else self.get_memory_at(self.position + 3)

        self.put_memory_at(output, arg1 * arg2)
        self.position += 4

    def do_input(self, modes):
        try:
            val = self.input.get_nowait()
        except queue.Empty:
            return False

        output = (self.relative_base + self.get_memory_at(
            self.position + 1)) if modes.pop() == 2 else self.get_memory_at(self.position + 1)
        self.put_memory_at(output, val)
        self.position += 2

        return True

    def do_output(self, modes):
        output = self.parse_args([self.position + 1], modes)[0]

        self.output.put(output)
        self.position += 2

    def jump_if_true(self, modes):
        test, jump_to = self.parse_args(
            [
                self.position + 1, self.position + 2
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
                self.position + 1, self.position + 2
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
                self.position + 1, self.position + 2
            ],
            modes
        )

        output = (self.relative_base + self.get_memory_at(
            self.position + 3)) if modes.pop() == 2 else self.get_memory_at(self.position + 3)

        if arg1 < arg2:
            to_place = 1
        else:
            to_place = 0

        self.put_memory_at(output, to_place)
        self.position += 4

    def equals(self, modes):
        arg1, arg2 = self.parse_args(
            [
                self.position + 1, self.position + 2
            ],
            modes
        )

        output = (self.relative_base + self.get_memory_at(
            self.position + 3)) if modes.pop() == 2 else self.get_memory_at(self.position + 3)

        if arg1 == arg2:
            to_place = 1
        else:
            to_place = 0

        original = self.get_memory_at(output)
        self.put_memory_at(output, to_place)
        self.position += 4


class InputRequiredException(Exception):
    output = []

    def __init__(self, output):
        self.output = output
