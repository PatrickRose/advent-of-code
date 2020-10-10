import sys


def create_wire(input):
    to_return = {}

    x = 0
    y = 0
    num_steps = 0

    for part in input.split(','):
        direction = part[:1]
        value = int(part[1:])

        while value > 0:
            if direction == 'U':
                y += 1
            elif direction == 'R':
                x += 1
            elif direction == 'D':
                y -= 1
            elif direction == 'L':
                x -= 1

            value -= 1
            num_steps += 1
            key = str(x) + "," + str(y)
            if key not in to_return:
                to_return[key] = num_steps

    return to_return


input = sys.stdin.readlines()

wire_one = create_wire(input[0])
wire_two = create_wire(input[1])

manhattens = []

intersections = wire_one.keys() & wire_two.keys()

for intersection in intersections:
    value = sum([abs(int(x)) for x in intersection.split(',')])
    manhattens.append(value)

print("Part one: " + str(min(manhattens)))

delay = []

for intersection in intersections:
    value = sum([wire_one[intersection], wire_two[intersection]])
    delay.append(value)

print("Part two: " + str(min(delay)))
