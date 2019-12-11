import { isString } from './types';

export const makeArray = (ySize, xSize, fill) => {
  const arr = [];
  for (let y = 0; y < ySize; y++) {
    if (xSize) {
      arr.push([]);
      for (let x = 0; x < xSize; x++) {
        arr[y].push(fill);
      }
    } else {
      arr.push(fill);
    }
  }
  return arr;
};

export const output2dArray = arr => arr.map(line => line.join('')).join('\n');

export const fastMax = arr => arr.reduce((max, v) => (max >= v ? max : v), -Infinity);

export const fastMin = arr => arr.reduce((min, v) => (min <= v ? min : v), Infinity);

export class InfiniteGrid {
  constructor(fill) {
    this.fill = fill;
    this.grid = new Map();
  }

  get cells() {
    return [...this.grid.entries()]
      .map(([pos, value]) => [...pos.split(',').map(Number), value])
      .map(([x, y, value]) => ({ x, y, value }));
  }

  get bounds() {
    const cells = this.cells;
    return {
      min: {
        x: fastMin(cells.map(({ x }) => x)),
        y: fastMin(cells.map(({ y }) => y))
      },
      max: {
        x: fastMax(cells.map(({ x }) => x)),
        y: fastMax(cells.map(({ y }) => y))
      }
    };
  }

  toArray() {
    const { min, max } = this.bounds;
    const array = makeArray(max.y - min.y + 1, max.x - min.x + 1, this.fill);
    for (let y = min.y; y <= max.y; y++) {
      for (let x = min.x; x <= max.x; x++) {
        array[y - min.y][x - min.x] = this.get(x, y);
      }
    }
    return array;
  }

  key(x, y) {
    return `${x},${y}`;
  }

  set(x, y, value) {
    this.grid.set(this.key(x, y), value);
  }

  get(x, y) {
    return this.grid.has(this.key(x, y)) ? this.grid.get(this.key(x, y)) : this.fill;
  }
}

export const sum = (a, b) => a + b;

export const sortNum = (a, b) => a - b;

export const nTimes = (n, cb) => {
  for (let i = 0; i < n; i++) cb();
};

export const range = (start, stop) => {
  const result = [];
  const numOrCharCode = n => (isString(n) ? n.charCodeAt(0) : n);
  for (let i = numOrCharCode(start); i <= numOrCharCode(stop); i++) {
    result.push(isString(start) ? String.fromCharCode(i) : i);
  }
  return result;
};

export const maxBy = cb => (a, b) => (cb(b) > cb(a) ? b : a);

export const minBy = cb => (a, b) => (cb(b) < cb(a) ? b : a);

export const dijkstra = (graph, source) => {
  const nodes = new Set(Object.keys(graph));
  const dist = new Map();
  const prev = new Map();

  [...nodes].forEach(node => dist.set(node, Infinity));
  dist.set(source, 0);

  while (nodes.size) {
    const closest = [...nodes].reduce(minBy(n => dist.get(n)));
    nodes.delete(closest);
    graph[closest].forEach(neighbor => {
      const alt = dist.get(closest) + 1;
      if (alt < dist.get(neighbor)) {
        dist.set(neighbor, alt);
        prev.set(neighbor, closest);
      }
    });
  }

  return [dist, prev];
};

export const chunk = (arr, size = 1) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const gcd = (x, y) => {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};

export const sortBy = (...cbs) => (a, b) => {
  for (const cb of cbs) {
    const aa = cb(a);
    const bb = cb(b);
    const diff = cb.desc
      ? isString(aa)
        ? bb.localeCompare(aa)
        : bb - aa
      : isString(aa)
      ? aa.localeCompare(bb)
      : aa - bb;
    if (diff !== 0) return diff;
  }
  return 0;
};
export const desc = cb => ((cb.desc = true), cb);
