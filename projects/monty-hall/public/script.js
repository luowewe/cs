const doors = document.querySelectorAll("#doors div");
const results = document.querySelector("#results");

const prizes = [0, 0, 0];

const SPEED = 0;

let round = 0;
let revealed = undefined;
let firstChoice = undefined;
let switchedTimes = 0;
let switchedWon = 0;
let stayedTimes = 0;
let stayedWon = 0;

const choose = (n) => {
  if (firstChoice === undefined) {
    doors[n].classList.add('selected');
    revealed = pickDoorToShow(n);
    openDoor(revealed);
    firstChoice = n;
  } else {
    doors[firstChoice].classList.remove('selected');
    doors[n].classList.add('selected');
    openDoor(n);
    result(prizes[n] > 0, n !== firstChoice);
  }
};

const pickDoorToShow = (n) => {
  const canShow = [];
  for (let i = 0; i < prizes.length; i++) {
    if (i !== n && prizes[i] === 0) {
      canShow.push(i);
    }
  }
  return canShow[Math.floor(Math.random() * canShow.length)];
};

const openDoor = (n) => {
  if (prizes[n] > 0) {
    console.log('You win!');
  }
  doors[n].innerText = `$${prizes[n]}`;
};

const result = (won, switched) => {
  let spans;
  if (switched) {
    switchedTimes++;
    if (won) switchedWon++;
    let spans = document.querySelectorAll('#switched span');
    spans[0].innerText = switchedTimes;
    spans[1].innerText = (100 * (switchedWon / switchedTimes)).toFixed(1);
  } else {
    stayedTimes++;
    if (won) stayedWon++;
    let spans = document.querySelectorAll('#stayed span');
    spans[0].innerText = stayedTimes;
    spans[1].innerText = (100 * (stayedWon / stayedTimes)).toFixed(1);
  }
};

const span = (content) => {
  const s = document.createElement('span');
  s.append(content);
  return s;
};

const setup = () => {
  for (let i = 0; i < doors.length; i++) {
    doors[i].onclick = () => choose(i);
  }
  document.querySelector('#play').onclick = reset;
  document.querySelector('#automatic').onclick = automatic;
};

const reset = () => {
  round++;

  prizes.fill(0);
  firstChoice = undefined;
  revealed = undefined;

  prizes[Math.floor(Math.random() * doors.length)] = 1000;
  for (let i = 0; i < doors.length; i++) {
    doors[i].innerText = '';
    doors[i].classList.remove('selected');
  }
};

const automatic = () => {
  reset();
  setTimeout(autoPlayFirst, SPEED);
};

const autoPlayFirst = () => {
  choose(Math.floor(Math.random() * doors.length));
  setTimeout(autoPlaySecond, SPEED);
};

const autoPlaySecond = () => {
  if (Math.random() < 0.5) {
    for (let i = 0; i < doors.length; i++) {
      if (i !== firstChoice && i !== revealed) {
        choose(i);
        break;
      }
    }
  } else {
    choose(firstChoice);
  }
  setTimeout(automatic, SPEED);
};


setup();
reset();
