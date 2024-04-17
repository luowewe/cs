const getX = (obj) => obj.x;

const point = (x, y) => ({ x, y });

const emptyObject = () => ({});

const distance = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

const midpoint = (p1, p2) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2
});

const sumSalaries = (objs) => objs.reduce((acc, o) => acc + o.salary, 0);

const newHighScore = (high, ps) => ps.reduce((h, p) => Math.max(h, p.score), high);

const summarizeBooks = (books) => ({
  titles: books.map((b) => b.title),
  pages: books.reduce((tot, b) => tot + b.pages, 0)
});