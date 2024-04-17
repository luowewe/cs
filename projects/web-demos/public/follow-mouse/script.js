const mouse = document.getElementById('mouse');

// Move the mouse DIV around to follow the mouse pointer.
document.documentElement.onmousemove = (e) => {
  mouse.style.left = `${e.x}px`;
  mouse.style.top = `${e.y}px`;
};

document.documentElement.onclick = (e) => {
  // Make a copy of the original mouse div.
  const m = mouse.cloneNode(true);

  // Remove the id attribute so when we add it the document it doesn't conflict
  // with the original.
  m.removeAttribute('id');

  // Add it to the body.
  document.querySelector('body').append(m);
};
