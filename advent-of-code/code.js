////////////////////////////////////////////////////////////////
// Utility functions

const lines = (s) => s.trimEnd().split('\n');

const numbers = (s) => lines(s).map(t => Number.parseInt(t));

const groups = (xs, n) => {
  let r = [];
  for (let i = 0; i < xs.length / n; i++) {
    r.push(xs.slice(i * n, (i + 1) * n));
  }
  return r;
};

const intersection = (...args) => {
  return args.reduce((acc, xs, i) => {
    return i === 0
      ? new Set(xs)
      : new Set([...xs].filter(x => acc.has(x)))
  }, null);
};

const indices = (rows, cols) =>
  Array(rows).fill().flatMap((_, i) => Array(cols).fill().map((_, j) => [i, j]));

const show = (s) => s;

////////////////////////////////////////////////////////////////
// Daily code

const day1 = () => {

  const elves = (s) => {
    const elves = [];
    let elf = 0;
    numbers(s).forEach((n) => {
      if (Number.isNaN(n)) {
        elves.push(elf);
        elf = 0;
      } else {
        elf += n;
      }
    });
    elves.push(elf);
    return elves.sort((a, b) => b - a);
  }

  const part1 = (s) => elves(s)[0];

  const part2 = (s) => elves(s).slice(0, 3).reduce((acc, n) => acc + n, 0);

  return { part1, part2 };
};

const day2 = () => {

  // Order: Rock, Paper, Scissors

  const score = (them, me) => (((me - them) + 4) % 3) * 3 + (me + 1);

  const outcome = (them, goal) => score(them, (them + goal + 2) % 3);

  const moves = (r) => ['ABC'.indexOf(r[0]), 'XYZ'.indexOf(r[2])];

  const part1 = (s) => lines(s).reduce((acc, r) => acc + score(...moves(r)), 0);

  const part2 = (s) => lines(s).reduce((acc, r) => acc + outcome(...moves(r)), 0);

  return { part1, part2 };
};

const day3 = () => {

  const lowerBase = 'a'.codePointAt(0) - 1;
  const upperBase = 'A'.codePointAt(0) - 1;

  const compartments = (s) =>
    lines(s).map(t => [t.substring(0, t.length / 2), t.substring(t.length / 2)]);

  const priority = (c) => {
    const cp = c.codePointAt(0);
    return cp > lowerBase ? cp - lowerBase : 26 + cp - upperBase;
  };

  const part1 = (s) => {
    let sum = 0;
    for (const [a, b] of compartments(s)) {
      for (const c of intersection(a, b)) {
        sum += priority(c);
      }
    }
    return sum;
  };

  const part2 = (s) => {
    let sum = 0;
    for (const g of groups(lines(s), 3)) {
      for (const c of intersection(...g)) {
        sum += priority(c);
      }
    }
    return sum;
  }

  return { part1, part2 };
};

const day4 = () => {

  const parsePair = (line) => line.split(',').map((x) => x.split('-').map(Number));

  const pairs = (s) => lines(s).map(parsePair);

  const subset = (a, b) => a[0] >= b[0] && a[1] <= b[1];

  const disjoint = (a, b) => a[1] < b[0] || b[1] < a[0];

  const part1 = (s) =>
    pairs(s)
      .reduce((acc, [a, b]) => acc + (subset(a, b) || subset(b, a) ? 1 : 0), 0);

  const part2 = (s) =>
    pairs(s).reduce((acc, [a, b]) => acc + (!disjoint(a, b) ? 1 : 0), 0);

  return { part1, part2 };

};

const day5 = () => {
  const stackPat = /^\s*(?:\[[A-Z]\]\s*)*$/;
  const numPat = /^(?:\s*\d+\s*)+$/;
  const movePat = /^move (\d+) from (\d+) to (\d+)$/;
  const rowPat = /(?: {4}|\[([A-Z])\] ?)/g;

  const parseRow = (line) => [...line.matchAll(rowPat)].map(x => x[1]);

  const crateMover9000 = (num, from, to, stacks) => {
    for (let i = 0; i < num; i++) {
      stacks[to - 1].push(stacks[from - 1].pop());
    }
  };

  const crateMover9001 = (num, from, to, stacks) => {
    const source = stacks[from - 1];
    const dest = stacks[to - 1];
    dest.splice(dest.length, 0, ...source.slice(source.length - num));
    source.splice(source.length - num, num);
  };

  const move = (s, move) => {
    const stacks = [];
    for (const line of lines(s)) {
      if (line.trim() === '' || line.match(numPat)) continue;

      if (line.match(stackPat)) {
        parseRow(line).forEach((e, i) => {
          if (e) {
            if (!stacks[i]) stacks[i] = [];
            stacks[i].unshift(e);
          }
        });
      } else {
        let m;
        if (m = line.match(movePat)) {
          const [_, num, from, to] = m;
          move(Number(num), Number(from), Number(to), stacks);
        }
      }
    }
    return stacks.map(s => s[s.length - 1]).join('');
  };

  const part1 = (s) => move(s, crateMover9000);
  const part2 = (s) => move(s, crateMover9001);

  return { part1, part2 };

};

const day6 = () => {

  const findMarker = (s, length) => {
    for (let i = length; i < s.length; i++) {
      if (new Set(s.substring(i - length, i)).size === length) {
        return i;
      }
    }
  };

  const part1 = (s) => findMarker(s, 4);

  const part2 = (s) => findMarker(s, 14);

  return { part1, part2 };

};

const day7 = () => {

  const FS_SIZE = 70_000_000;
  const NEEDED = 30_000_000;

  const dir = (name, parent) => ({ name, dirs: {}, files: {}, parent });

  const file = (size, name) => ({ name, size });

  const doLine = (line, current, root) => {
    let m;
    if (line === '$ cd /') {
      return root;
    } else if (line === '$ cd ..') {
      return current.parent;
    } else if (m = line.match(/^\$ cd (.*)$/)) {
      return current.dirs[m[1]];
    } else {
      if (m = line.match(/^dir (.*)$/)) {
        const name = m[1];
        if (!(name in current.dirs)) {
          current.dirs[name] = dir(name, current);
        }
      } else if (m = line.match(/^(\d+) (.*)$/)) {
        const [size, name] = [Number(m[1]), m[2]];
        if (!(name in current.files)) {
          current.files[name] = file(size, name);
        }
      }
      return current;
    }
  };

  const sized = (dir) => {
    if (!('size' in dir)) {
      dir.size = Object.values(dir.files).reduce((acc, f) => acc + f.size, 0);
      Object.values(dir.dirs).forEach((d) => {
        dir.size += sized(d).size;
      });
    }
    return dir;
  };

  const loadFS = (s) => {
    const root = dir("/", null);
    lines(s).reduce((current, line) => doLine(line, current, root), root);
    return sized(root);
  };

  const sumAtMost100k = (d) => {
    const below = Object.values(d.dirs).reduce((acc, d) => acc + sumAtMost100k(d), 0);
    return below + (d.size <= 100_000 ? d.size : 0);
  };

  const smallestAbove = (d, minimum) => {
    return Object.values(d.dirs).reduce((best, x) => {
      if (x.size >= minimum) {
        const b = smallestAbove(x, minimum);
        return b.size < best.size ? b : best;
      } else {
        return best;
      }
    }, d);
  };

  const part1 = (s) => sumAtMost100k(loadFS(s));

  const part2 = (s) => {
    const root = loadFS(s);
    return smallestAbove(root, NEEDED - (FS_SIZE - root.size)).size;
  };

  return { part1, part2 };
};

const day8 = () => {

  const forest = (s) => lines(s).map(line => line.split('').map(Number));

  const range = (start, end) => {
    const len = Math.abs(end - start);
    const sign = Math.sign(end - start);
    return Array(len).fill().map((_, x) => start + x * sign);
  }

  const row = (i, start, end) => range(start, end).map(j => [i, j]);

  const col = (j, start, end) => range(start, end).map(i => [i, j]);

  const visibility = (trees) => {
    const visible = trees.map((row) => Array(row.length).fill(false));
    updateRows(trees, visible);
    updateColumns(trees, visible);
    return visible;
  };

  const updateRows = (trees, visible) => {
    for (let i = 0; i < trees.length; i++) {
      updateLine(trees, visible, row(i, 0, trees[i].length));
      updateLine(trees, visible, row(i, trees[i].length - 1, -1));
    }
  };

  const updateColumns = (trees, visible) => {
    for (let j = 0; j < trees[0].length; j++) {
      updateLine(trees, visible, col(j, 0, trees.length));
      updateLine(trees, visible, col(j, trees.length - 1, -1));
    }
  };

  const updateLine = (trees, visible, indices) => {
    let tallest = -1;
    indices.forEach(([i, j]) => {
      if (trees[i][j] > tallest) {
        tallest = trees[i][j];
        visible[i][j] = true;
      }
    });
  };

  const look = (trees, line) => {
    const [r, c] = line[0];
    const rest = line.slice(1);
    const h = trees[r][c];
    let count = 0;
    for (const [r, c] of rest) {
      count++;
      if (trees[r][c] >= h) break;
    }
    return count;
  };

  const north = (trees, i, j) => look(trees, col(j, i, -1));

  const south = (trees, i, j) => look(trees, col(j, i, trees.length));

  const west = (trees, i, j) => look(trees, row(i, j, -1));

  const east = (trees, i, j) => look(trees, row(i, j, trees[i].length));

  const scenic = (trees, i, j) =>
    [north, south, east, west].reduce((acc, f) => acc * f(trees, i, j), 1);

  const part1 = (s) =>
    visibility(forest(s)).reduce((a1, row) => a1 + row.reduce((a2, v) => a2 + (v ? 1 : 0), 0), 0);

  const part2 = (s) => {
    const trees = forest(s);
    return indices(trees.length, trees[0].length).reduce((max, [i, j]) =>
      Math.max(max, scenic(trees, i, j)), 0);
  };

  return { part1, part2 };
};

const day9 = () => {

  const movers = {
    L: (knot) => { knot.x--; },
    R: (knot) => { knot.x++; },
    U: (knot) => { knot.y++; },
    D: (knot) => { knot.y--; },
  };

  const follow = (k1, k2) => {
    const dx = k1.x - k2.x;
    const dy = k1.y - k2.y;
    if (Math.abs(dx) === 2) {
      k2.x += Math.sign(dx);
      if (Math.abs(dy) > 0) {
        k2.y += Math.sign(dy);
      }
    } else if (Math.abs(dy) === 2) {
      k2.y += Math.sign(dy);
      if (Math.abs(dx) > 0) {
        k2.x += Math.sign(dx);
      }
    }
  };

  const parseLine = (line) => {
    const m = line.match(/^([LRUD]) (\d+)$/);
    return [movers[m[1]], Number(m[2])];
  };

  const execute = (s, n) => {
    const knots = Array(n).fill().map(() => ({ x: 0, y: 0 }));
    const tail = knots[knots.length - 1];

    const visited = new Set(['0,0']);
    lines(s).map(parseLine).forEach(([mover, steps]) => {
      for (let i = 0; i < steps; i++) {
        knots.forEach((k, i) => {
          if (i === 0) {
            mover(k);
          } else {
            follow(knots[i - 1], k);
          }
        });
        visited.add(`${tail.x},${tail.y}`);
      }
    });
    return visited.size;
  };

  const part1 = (s) => execute(s, 2);
  const part2 = (s) => execute(s, 10);

  return { part1, part2 };
};

const day10 = () => {

  const part2output = `
###..#....####.####.####.#.....##..####.
#..#.#....#.......#.#....#....#..#.#....
#..#.#....###....#..###..#....#....###..
###..#....#.....#...#....#....#.##.#....
#.#..#....#....#....#....#....#..#.#....
#..#.####.####.####.#....####..###.####.
`.trimStart();

  const ops = {
    noop: (state, probe) => {
      cycles(state, probe, 1);
    },
    addx: (state, probe, n) => {
      cycles(state, probe, 2);
      state.x += n;
    },
  };

  const cycles = (state, probe, n) => {
    for (let i = 0; i < n; i++) {
      probe(state);
      state.cycle++;
    }
  };

  const op = (line, state, probe) => {
    let m = line.match(/^(noop|addx)(?: (-?\d+))?$/);
    ops[m[1]](state, probe, Number(m[2]));
    return state;
  };

  const run = (s, probe, answer) => {
    const init = { cycle: 1, x: 1, answer };
    return lines(s).reduce((state, l) => op(l, state, probe), init).answer;
  };

  const signalStrength = (state) => {
    if ((state.cycle - 20) % 40 === 0) {
      state.answer += state.cycle * state.x;
    }
  };

  const crt = (state) => {
    state.answer += Math.abs(state.x - ((state.cycle - 1) % 40)) < 2 ? '#' : '.';
    if (state.cycle % 40 === 0) state.answer += '\n';
  };

  const part1 = (s) => run(s, signalStrength, 0);
  const part2 = (s) => run(s, crt, '');

  return { part1, part2, part2output };
};

const day11 = () => {

  // Part 1

  const evaluate = (s, old) => s === 'old' ? old : Number(s);

  const ops1 = {
    '+': (old, a, b) => evaluate(a, old) + evaluate(b, old),
    '*': (old, a, b) => evaluate(a, old) * evaluate(b, old),
  };

  const makeOp1 = (op, arg1, arg2) => {
    const fn = ops1[op];
    return (old, monkeys) => Math.floor(fn(old, arg1, arg2) / 3);
  };

  const isDivisible1 = (level, monkey) => level % monkey.divisibleBy === 0;

  // Part 2

  const ops2 = {
    '+': (old, a, b, monkeys) => {
      return old.map((r, i) => {
        const mod = monkeys[i].divisibleBy;
        return (evaluate(a, r) + evaluate(b, r)) % mod;
      });
    },
    '*': (old, a, b, monkeys) => {
      return old.map((r, i) => {
        const mod = monkeys[i].divisibleBy;
        return (evaluate(a, r) * evaluate(b, r)) % mod;
      });
    },
  };

  const makeOp2 = (op, arg1, arg2) => {
    const fn = ops2[op];
    return (old, mods) => fn(old, arg1, arg2, mods);
  };

  const isDivisible2 = (level, monkey) => level[monkey.idx] === 0;

  // Generic

  const monkeys = (s, makeOp) => {
    const ms = [];
    let monkey = null;
    lines(s).forEach((line) => {
      let m;
      if (m = line.match(/^Monkey \d+:$/)) {
        monkey = { items: [], inspected: 0, idx: ms.length };
        ms.push(monkey);

      } else if (m = line.match(/^\s+Starting items: (.*)$/)) {
        monkey.items = m[1].match(/(\d+)/g).map(Number);

      } else if (m = line.match(/^\s+Operation: new = (\w+) ([+*]) (\w+)$/)) {
        const [arg1, op, arg2] = [...m].slice(1);
        monkey.op = makeOp(op, arg1, arg2);

      } else if (m = line.match(/^\s+Test: divisible by (\d+)/)) {
        monkey.divisibleBy = Number(m[1]);

      } else if (m = line.match(/^\s+If (true|false): throw to monkey (\d+)$/)) {
        monkey[m[1]] = Number(m[2]);

      }
    });
    ms.mod = ms.reduce((p, m) => p * m.divisibleBy, 1);
    return ms;
  };

  const monkeySeeMonkeyDo = (monkey, monkeys, extra, isDivisible) => {
    monkey.inspected += monkey.items.length;
    while (monkey.items.length > 0) {
      const item = monkey.items.shift();
      const level = monkey.op(item, monkeys);
      const next = String(isDivisible(level, monkey));
      monkeys[monkey[next]].items.push(level);
    }
  };

  const fixForPart2 = (monkeys) => {
    const mods = monkeys.map(m => m.divisibleBy);
    monkeys.forEach((m) => m.items = m.items.map(n => mods.map((m) => n % m)));
  }

  const run = (s, iters, makeOp, fixMonkeys, isDivisible) => {
    const ms = monkeys(s, makeOp);
    const extra = fixMonkeys(ms);
    for (let i = 0; i < iters; i++) {
      ms.forEach((m) => monkeySeeMonkeyDo(m, ms, extra, isDivisible));
    }
    const busy = ms.map(m => m.inspected).sort((a, b) => b - a);
    return busy[0] * busy[1];
  };

  const part1 = (s) => run(s, 20, makeOp1, (x) => { }, isDivisible1);
  const part2 = (s) => run(s, 10_000, makeOp2, fixForPart2, isDivisible2);

  return { part1, part2 };
};

const day12 = () => {

  const grid = (s) => {
    const g = lines(s).map(line => line.split(''));
    g.forEach((row, i) => {
      row.forEach((c, j) => {
        if (g[i][j].match(/[SE]/)) {
          g[g[i][j]] = [i, j];
        }
      });
    });
    return g;
  }

  const bfs = (grid, queue) => {
    while (queue) {
      const [i, j] = queue.pop();
      // push unvisited neighbors.

      
    }
  }

  const part1 = (s) => {
    const g = grid(s);
    bfs(g, [g.S]);

    return JSON.stringify(g);
  }

  return { part1 };

};

// N.B. These won't necessarily output in order due to async fetch.
if (false) {
  run('day_01.problem', day1().part1, 74394);
  run('day_01.problem', day1().part2, 212836);
  run('day_02.problem', day2().part1, 9241);
  run('day_02.problem', day2().part2, 14610);
  run('day_03.problem', day3().part1, 8185);
  run('day_03.problem', day3().part2, 2817);
  run('day_04.problem', day4().part1, 657);
  run('day_04.problem', day4().part2, 938);
  run('day_05.problem', day5().part1, 'QNHWJVJZW');
  run('day_05.problem', day5().part2, 'BPCZJLFJW');
  run('day_06.problem', day6().part1, 1578);
  run('day_06.problem', day6().part2, 2178);
  run('day_07.problem', day7().part1, 2061777);
  run('day_07.problem', day7().part2, 4473403);
  run('day_08.problem', day8().part1, 1690);
  run('day_08.problem', day8().part2, 535680);
  run('day_09.problem', day9().part1, 6563);
  run('day_09.problem', day9().part2, 2653);
  run('day_10.problem', day10().part1, 17020);
  run('day_10.problem', day10().part2, day10().part2output);
  run('day_11.problem', day11().part1, 102399);
  run('day_11.problem', day11().part2, 23641658401);
}

run('day_12.test', day12().part1);
