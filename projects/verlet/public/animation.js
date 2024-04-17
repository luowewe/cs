/*
 * Animate the passed in function by calling it on every animation frame,
 * passing in the time elapsed since the last call and the raw time value.
 */
const animate = (drawFrame) => {
  let previous = performance.now();
  const step = (t) => {
    if (t > previous) {
      drawFrame(t - previous, t);
      previous = t;
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

export { animate };
