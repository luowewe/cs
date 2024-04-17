let counter = 0;

document.querySelector('p').onclick = (e) => {
  const p = e.target;
  counter++;
  if (counter === 1) {
    p.innerHTML = 'I have been clicked <span id="counter"></span> time<span id="s"></span>.';
  }
  if (counter === 2) {
    p.querySelector('#s').textContent = 's';
  }
  p.querySelector('#counter').textContent = `${counter}`;
};
