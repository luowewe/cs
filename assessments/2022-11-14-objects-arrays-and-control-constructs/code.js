// Advanced solutions using various features I've shown some of you (plus maybe even a couple that )

const area = (rect) => {
  return rect.width * rect.height;
};

const higherPaid = (e1, e2) => {
  if (e1.salary > e2.salary) {
    return e1;
  } else {
    return e2;
  }
};

const isSamePoint = (p1, p2) => {
  return p1.x === p2.x && p1.y == p2.y;
};

const totalWithTip = (bill, tipPercent) => {
  return {
    subtotal: bill.subtotal,
    tip: bill.subtotal * tipPercent,
    total: bill.subtotal + bill.subtotal * tipPercent,
  };
}

const sums = (n) => {
  let result = []
  for (let x = 0; x < n + 1; x++) {
    result.push(x + (x === 0 ? 0 : result[x - 1]));
  }
  return result;
};