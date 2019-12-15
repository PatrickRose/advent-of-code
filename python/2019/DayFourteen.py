import sys
import math
import collections

puzzle_input = sys.stdin.readlines()

reactions = {}

for line in puzzle_input:
    ins, out = line.split(' => ')

    out = out.split()

    requirements = [(x[1], int(x[0])) for x in [y.split() for y in ins.split(', ')]]

    reactions[out[1]] = (int(out[0]), requirements)


def factory(fuel_amount):
    ore_made = 0
    
    leftovers = collections.defaultdict(lambda: 0)

    to_make = {"FUEL": fuel_amount}

    while to_make:
        element, amount = next(iter(to_make.items()))
        del to_make[element]
        current_have = leftovers[element]
        yet_to_make = amount - current_have

        if yet_to_make >= 0:
            makes, requirements = reactions[element]
            time_to_do = (yet_to_make+makes-1) // makes
            leftovers[element] += time_to_do * makes - yet_to_make
            for new_element, new_amount in requirements:
                new_amount *= time_to_do
                if new_element == 'ORE':
                    ore_made += new_amount
                    continue

                if new_element in leftovers:
                    if leftovers[new_element] > new_amount:
                        leftovers[new_element] -= new_amount
                    else:
                        to_make[new_element] = to_make.get(new_element, 0) + (new_amount - leftovers[new_element])
                        leftovers[new_element] = 0
                else:
                    to_make[new_element] = to_make.get(new_element, 0) + new_amount
        else:
            leftovers[element] -= yet_to_make
    return ore_made
        
print ("Part one", factory(1))

min, max = 1, 1000000000000

while min + 1 != max:
    next_check = (min + max) // 2

    if next_check == min:
        next_check += 1

    ore_required = factory(next_check)

    if ore_required == 1000000000000:
        min = max = next_check
    elif ore_required < 1000000000000:
        min = next_check
    else:
        max = next_check
        
print("Part two:", min)
