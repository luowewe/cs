const target = document.getElementById('target');

const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;

const randomPosition = (w, h) => {
  return {
    x: w + Math.random() * (width - 2 * w),
    y: h + Math.random() * (height - 2 * h),
  };
};

target.onclick = (e) => {
  const { x, y } = randomPosition(target.clientWidth, target.clientHeight);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
};
