// Add a div to every fieldset for logging input events.
document.querySelectorAll('fieldset').forEach(fs => fs.append(document.createElement('div')));

const record = (element, text) => {
  const p = document.createElement('p');
  p.innerText = text;
  element.closest('fieldset').querySelector('div').append(p);
}

const addOnChange = (element) => {
  element.onchange = (e) => {
    if (e.target.getAttribute('type') === 'checkbox') {
      record(e.target, `${e.target.value} is checked: ${e.target.checked}`);
    } else {
      record(e.target, e.target.value);
    }
  }
};

document.querySelectorAll('button').forEach(el => el.onclick = (e) => record(e.target, 'Clicked!'));
document.querySelectorAll('input, textarea, select').forEach(addOnChange);
