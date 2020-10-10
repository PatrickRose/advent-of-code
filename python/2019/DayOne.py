import math
import sys


def calculate_fuel(value):
    return math.floor(value / 3) - 2


input = sys.stdin.readlines()
values = [];

for line in input:
    values.append(calculate_fuel(int(line.strip())))

print("Part 1: " + str(sum(values)))

fuels = [];


def calculate_module_fuel(value):
    fuel_for_value = calculate_fuel(value)

    if fuel_for_value <= 0:
        return 0

    return fuel_for_value + calculate_module_fuel(fuel_for_value)


print("Part 2: " + str(sum(map(lambda x: x + calculate_module_fuel(x), values))))
