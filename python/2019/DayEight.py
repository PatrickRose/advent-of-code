import sys, math

puzzle_input = sys.stdin.readlines()[0].strip()

wide = 25
tall = 6

n = wide * tall

base_layers = [puzzle_input[start:start+n] for start in range(0, len(puzzle_input), n)]

## Can do part 1 now

num_zeros = math.inf
part1 = 0

for layer in base_layers:
    this_zeros = layer.count('0')
    if this_zeros < num_zeros:
        num_zeros = this_zeros
        part1 = layer.count('1') * layer.count('2')

print ("Part 1: " + str(part1))

## Now convert layers into actual layers

layers = []

for s in base_layers:
    layers.append([s[start:start+wide] for start in range(0, n, wide)])
    
message = ''

for i in range(0, tall):
    for j in range(0, wide):
        this_list = [x[i][j] for x in layers]
        this_list.reverse()
        this_char = this_list.pop()
        while this_char == '2':
            this_char = this_list.pop()

        if this_char == '1':
            message += '□'
        else:
            message += ' '
    message += "\n"

print ("Part two:\n" + message)

