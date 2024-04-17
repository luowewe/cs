/*
 * Animate the given function, returning the high performance timestamp of the
 * first frame.
 */
const animate = (frame) => {
  // Helper function to run animation function in (essentially) a loop.
  const step = (t) => {
    frame(t);
    requestAnimationFrame(step);
  };

  const start = performance.now();
  step(start);
  return start
}

export { animate };
