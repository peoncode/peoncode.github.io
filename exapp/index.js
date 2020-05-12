/*
req:
  1) workTime, restTime, reps
  2) code cleanup
  3) automation (repeated code instead of hardcode)
  */
 let BODY_STYLE, CLOCK, MSG, START_BUTTON, BEEP3_AUDIO, BEEP5_AUDIO, FANFARE_AUDIO;
 
 function domReady() {
   console.log('dom is ready');
   START_BUTTON = document.getElementById('start'); 
   START_BUTTON.focus();
   BUTTONS = document.getElementById('button-group');
   BODY_STYLE = document.getElementById('body').style;
   CLOCK = document.getElementById('clock');
   MSG = document.getElementById('msg');
   BEEP3_AUDIO = document.getElementById('beep3Audio');
   BEEP5_AUDIO = document.getElementById('beep5Audio');
   FANFARE_AUDIO = document.getElementById('fanfareAudio');
   const popup = document.getElementById('popup');
}

function hidePopup() {
  popup.style.display = 'none';
}

function showPopup() {
  gtag('event', 'change_routine', {
    'event_category' : 'configuration',
    'event_label' : 'button_pressed'
  });
  popup.style.display = 'block';
}

function removeTask(e) {
  console.log('removed task');
  e.remove();
}

function addInterval() {
  const type = document.querySelector('input[name="type"]:checked').value;
  const time = document.querySelector('input[id="time"]').value

  const trashIcon = document.createElement("img"); //<img src='trash-alt-solid.png'>
  trashIcon.setAttribute("src", "trash-alt-solid.png");
  const li = document.createElement("li");
  li.addEventListener('click', (me) => {
    removeTask(me.target);
  })
  li.setAttribute('type', type);
  li.setAttribute('time', time);
  li.appendChild(document.createTextNode(`${type.toUpperCase()} for ${time}s`));
  li.appendChild(trashIcon);
  document.getElementById("routine").appendChild(li);
}

function getRoutineFromConfig() {
  const intervals = [{
      name: '0',
      type: 'countdown',
      time: 3
    }];

  const ul = document.getElementById("routine");
  const items = ul.getElementsByTagName("li");
  for (let i=0; i<items.length; i++) {
    console.log(`Inserting `, {name: (i+1).toString(), type: items[i].getAttribute('type'), time: items[i].getAttribute('time')});
    intervals.push({name: (i+1).toString(), type: items[i].getAttribute('type'), time: items[i].getAttribute('time')});
  }

  return intervals;
}

async function startRoutine() {
  gtag('event', 'start_routine', {
    'event_category' : 'engagement',
    'event_label' : 'button_pressed'
  });  
  document.getElementById('titles').style.display = 'none';
  BUTTONS.style.display = 'none';
  MSG.innerHTML = '';
  CLOCK.innerHTML = '';

  const routines = getRoutineFromConfig();

  for (let i=0; i<routines.length; i++) {
    const routine = routines[i];
    // console.log(`Routine ${routine.name} starts...`);
    await runChunk(routine);
  };
  
  FANFARE_AUDIO.play();
  BUTTONS.style.display = 'block';
  BODY_STYLE['background-color'] = '#A9DDD9';
  MSG.innerHTML = 'done!';
  START_BUTTON.focus();
}

/**
 * Runs a routine given the routine
 * @param {Object} routine - The routine object to run.
 * @param {string} routine.type - The type of interval.
 * @param {number} routine.time - The number of seconds to run.
 */
function runChunk(routine) {
  return new Promise((resolve) => {
    let counter = routine.time;
    
    if (routine.type === 'work') {
      BODY_STYLE['animation'] = routine.name === '1' ? 'blackred 1s' : 'bluered 1s';
      BODY_STYLE['background-color'] = '#E3493B';
      CLOCK.style['color'] = '#3A3A3C';
      MSG.style['color'] = '#3A3A3C';
      MSG.innerHTML = routine.type.toUpperCase();
      // console.log(`transition to red`);
    } else if (routine.type === 'rest') {
      BODY_STYLE['animation'] = 'redblue 1s';
      BODY_STYLE['background-color'] = '#23B5AF'
      CLOCK.style['color'] = '#3A3A3C';
      MSG.style['color'] = '#3A3A3C';
      MSG.innerHTML = routine.type.toUpperCase();
      // console.log(`transition to blue`);
    } else if (routine.type === 'countdown') {
      BEEP3_AUDIO.play();
      BODY_STYLE['background-color'] = '#3A3A3C';
      MSG.style['color'] = '#FFFAFA';
      MSG.innerHTML = 'Get Ready!';
      CLOCK.style['color'] = '#FFFAFA';
    }
    updateClock(counter, routine.type);

    const s = setInterval(function() {
      counter--;
      updateClock(counter, routine.type);
      // console.log(`${routine.type}(${routine.name}) - ${counter}`);

      if (counter === 5 && (routine.type === 'work' || routine.type === 'rest')) {
        BEEP5_AUDIO.play();
      }

      if (counter === 0) {
        clearInterval(s);
        resolve();
      }
    }, 1000);
  });
}

function updateClock(counter, type) {
  let minutes = Math.floor(counter / 60);
  let seconds = Math.floor(counter % 60);

  CLOCK.innerHTML = type === "countdown" ? counter : `${minutes}:${String(seconds).padStart(2, '0')}`;
}