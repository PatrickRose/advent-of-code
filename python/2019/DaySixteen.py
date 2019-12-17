import sys

def calculate_fft(value, offset = 0, num_times = 100):
    length = len(value)

    for j in range(num_times):
        fft = value[:offset]

        last_value = None
    
        for i in range(offset, length):
            if i > length // 2:
                if last_value is None:
                    last_value = sum(value[i:])
                else:
                    last_value -= value[i-1]
                fft.append(last_value % 10)
                continue
            
            up_to = i
            type = [1,0,-1,0]
            position = 0
            char = 0

            adds = []
            minuses = []

            while up_to < length:
                limit = up_to + i + 1
                if position % 2 == 0:
                    to_handle = value[up_to:limit]
                    to_add = [x for x in to_handle]
                    if position == 0:
                        adds += to_add
                    else:
                        minuses += to_add
                up_to = limit
                position = (position + 1) % 4

            char = sum(adds) - sum(minuses)
                
            fft.append(abs(char) % 10)

        value = fft
    return value

puzzle_input = sys.stdin.readlines()[0].strip()

value = [int(x) for x in puzzle_input]

print ("Part 1", ''.join([str(x) for x in calculate_fft(value)[:8]]))
value = [int(x) for x in puzzle_input] * 10000

offset = int(''.join([str(x) for x in value[:7]]))

new_value = calculate_fft(value, offset)

print ("Part 2", ''.join([str(x) for x in new_value[offset:offset+8]]))
