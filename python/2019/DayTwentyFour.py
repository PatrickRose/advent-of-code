import sys

puzzle_input = [x.strip("\n") for x in sys.stdin.readlines()]

BUG = '#'
EMPTY = '.'


def num_adjacent(x, y, grid):
    count = 0
    for x1, y1 in [(x, y + 1), (x, y - 1), (x + 1, y), (x - 1, y)]:
        if 0 <= x1 < 5 and 0 <= y1 < 5:
            count += 1 if grid[y1][x1] == BUG else 0

    return count


grid = puzzle_input.copy()
seen_grids = {"\n".join(grid): True}

while True:
    new_grid = []

    for y, row in enumerate(grid):
        new_row = ""
        for x, char in enumerate(row):
            if char == BUG:
                new_row += BUG if num_adjacent(x, y, grid) == 1 else EMPTY
            elif char == EMPTY:
                new_row += BUG if 1 <= num_adjacent(x, y, grid) <= 2 else EMPTY

        new_grid.append(new_row)

    grid = new_grid
    text_version = "\n".join(grid)

    if text_version in seen_grids:
        break

    seen_grids[text_version] = True

bio_point_value = 0
bio_points = 0

for row in grid:
    for char in row:
        if char == BUG:
            bio_points += (2 ** bio_point_value)
        bio_point_value += 1

print(text_version, "\nValue is", bio_points)

# Now restart for the recursive iteration
levels = {0: puzzle_input.copy()}
empty = [EMPTY * 5] * 5

for i in range(200):
    new_levels = {}
    min_key = min(levels)
    max_key = max(levels)

    # Add something at the beginning and end
    levels[min_key - 1] = empty.copy()
    levels[max_key + 1] = empty.copy()
    for level in levels:
        grid = levels[level]
        new_grid = []

        for y, row in enumerate(grid):
            new_row = ""
            for x, char in enumerate(row):
                if (y, x) == (2, 2):
                    new_row += EMPTY
                    continue

                adjacent = 0

                # Up
                if y - 1 < 0:
                    # Check the level below us and see if it's a bug
                    if level - 1 in levels:
                        adjacent += 1 if levels[level - 1][1][2] == BUG else 0
                elif (y - 1, x) == (2, 2):
                    # Check the level above us
                    if level + 1 in levels:
                        adjacent += levels[level + 1][4].count(BUG)
                else:
                    adjacent += 1 if grid[y - 1][x] == BUG else 0

                # Down
                if y + 1 >= 5:
                    # Check the level below us and see if it's a bug
                    if level - 1 in levels:
                        adjacent += 1 if levels[level - 1][3][2] == BUG else 0
                elif (y + 1, x) == (2, 2):
                    # Check the level above us
                    if level + 1 in levels:
                        adjacent += levels[level + 1][0].count(BUG)
                else:
                    adjacent += 1 if grid[y + 1][x] == BUG else 0

                # Left
                if x - 1 < 0:
                    # Check the level below us and see if it's a bug
                    if level - 1 in levels:
                        adjacent += 1 if levels[level - 1][2][1] == BUG else 0
                elif (y, x - 1) == (2, 2):
                    # Check the level above us
                    if level + 1 in levels:
                        s = [row[-1] for row in levels[level + 1]]
                        adjacent += s.count(BUG)
                else:
                    adjacent += 1 if grid[y][x - 1] == BUG else 0

                # Right
                if x + 1 >= 5:
                    # Check the level below us and see if it's a bug
                    if level - 1 in levels:
                        adjacent += 1 if levels[level - 1][2][3] == BUG else 0
                elif (y, x + 1) == (2, 2):
                    # Check the level above us
                    if level + 1 in levels:
                        s = [row[0] for row in levels[level + 1]]
                        adjacent += s.count(BUG)
                else:
                    adjacent += 1 if grid[y][x + 1] == BUG else 0

                if char == BUG:
                    new_row += BUG if adjacent == 1 else EMPTY
                elif char == EMPTY:
                    new_row += BUG if 1 <= adjacent <= 2 else EMPTY

            new_grid.append(new_row)

        new_levels[level] = new_grid

    levels = new_levels
    if levels[min_key - 1] == empty:
        del levels[min_key - 1]
    if levels[max_key + 1] == empty:
        del levels[max_key + 1]

num_bugs = sum(sum([row.count(BUG) for row in levels[level]]) for level in levels)

print(num_bugs)
