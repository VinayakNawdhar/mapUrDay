'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + ' ').slice(-10);
  constructor(task, location, duration, timing, event,description) {
    this.task = task;
    this.location = location;
    this.duration = duration;
    this.timing = timing;
    this.event = event;
    this.description = description;
  }
}


const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputTask = document.querySelector('.form__input--task');
const inputLocation = document.querySelector('.form__input--location');
const inputDuration = document.querySelector('.form__input--duration');
const inputTiming = document.querySelector('.form__input--timing');
const formBtn = document.querySelector('.form__btn');
const workouts = document.querySelector('.workouts');

class App {
  #map;
  #mapEvent;
  #events = [];

  constructor() {
    this._getposition();
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getposition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position!');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
    this._getLocalStorage();
    workouts.addEventListener('click', this._setViewFunction.bind(this));
  }

  _showForm(ev) {
    form.classList.toggle('hidden');
    inputTask.focus();
    this.#mapEvent = ev;
    // console.log(ev);
  }

  _newWorkout(e) {
    e.preventDefault();
    if (inputTiming.value && +inputDuration.value > 0 && inputLocation) {
      let eventsObj = new Workout(
        inputTask.value,
        inputLocation.value,
        +inputDuration.value,
        inputTiming.value,
        this.#mapEvent.latlng,
        `${inputTask.value.toUpperCase()} at ${inputTiming.value}`
      );
      // console.log(eventsObj);
      this._renderWorkoutMarker(eventsObj);
      this.#events.push(eventsObj);
      form.classList.toggle('hidden');
      clearFormField();
      this._addField(eventsObj);
      this._setLocalStorage();
    } else {
      alert('enter complete and correct details');
    }
  }

  _renderWorkoutMarker(eventsObj) {
    L.marker([eventsObj.event.lat, eventsObj.event.lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 200,
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          className: 'running-popup',
        }).setContent(
          eventsObj.description
        )
      )
      .openPopup();
  }

  _addField(eventsObj) {
    const time = eventsObj.timing.slice(0, 2);
    const leftPart = eventsObj.timing.slice(2);
    let timeToBePrinted;
    let ampm;
    if (+time >= 0 && +time <= 12) {
      timeToBePrinted = time;
      ampm = 'AM';
    } else {
      timeToBePrinted = time - 12;
      ampm = 'PM';
    }
    form.insertAdjacentHTML(
      'afterend',
      `<li class="workout workout--running" data-id="${eventsObj.id}">
    <h2 class="workout__title">${eventsObj.task} at exact ${
        eventsObj.timing
      }</h2>
    <div class="workout__details">
      <span class="workout__icon">🗺 </span>
      <span class="workout__value">${eventsObj.location}</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${timeToBePrinted + leftPart}</span>
      <span class="workout__unit">${ampm}</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${eventsObj.duration}</span>
      <span class="workout__unit">min</span>
    </div>
  </li>`
    );
  }
  _setViewFunction(e) {
    const targetEl = e.target.closest('.workout');
    const id = targetEl.getAttribute('data-id');
    const targetedWorkout = this.#events.find(el => el.id === id);
    const { lat, lng } = targetedWorkout.event;
    this.#map.flyTo([lat, lng], 14);
  }
_setLocalStorage(){
  localStorage.setItem('vinayak',JSON.stringify(this.#events));
}
_getLocalStorage(){
  if (localStorage.getItem('vinayak')) {
    this.#events = JSON.parse(localStorage.getItem('vinayak'));
    console.log(this.#events);
    for(let i=0;i<this.#events.length;i++){
      this._addField(this.#events[i]);
      this._renderWorkoutMarker(this.#events[i]);
    }
  }
}
reset(){
  localStorage.clear();
  location.reload();
}

}

const app = new App();

function clearFormField() {
  inputTask.value = '';
  inputLocation.value = '';
  inputDuration.value = '';
  inputTiming.value = '';
  // console.log(this.#events);
}

document.querySelector('.reset button').addEventListener('click',function(e){
  e.preventDefault();
  app.reset();
})