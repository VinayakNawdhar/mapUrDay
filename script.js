'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + ' ').slice(-10);
  constructor(task, location, duration, timing, event) {
    this.task = task;
    this.location = location;
    this.duration = duration;
    this.timing = timing;
    this.event = event;
  }
}

let events = [];

if (localStorage.getItem('events')) {
  events = console.parse(localStorage.getItem('events'));
  events.forEach(el => {
    markLocation(el.event);
  });
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
    this.#map = L.map('map').setView(coords, 12);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(ev) {
    form.classList.toggle('hidden');
    inputTask.focus();
    this.#mapEvent = ev;
  }

  _newWorkout(e) {
    e.preventDefault();
    if (inputTiming.value && +inputDuration.value > 0 && inputLocation) {
      let eventsObj = new Workout(
        inputTask.value,
        inputLocation.value,
        +inputDuration.value,
        inputTiming.value,
        this.#mapEvent
      );
      this._renderWorkoutMarker(eventsObj);
      events.push(eventsObj);
      form.classList.toggle('hidden');
      clearFormField();
      this._addField(eventsObj);
      workouts.addEventListener('click', this._setViewFunction.bind(this));
    } else {
      alert('enter complete and correct details');
    }
  }

  _renderWorkoutMarker(eventsObj) {
    L.marker([eventsObj.event.latlng.lat, eventsObj.event.latlng.lng])
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
          `${inputTask.value.toUpperCase()} at ${inputTiming.value}`
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
    const targetedWorkout = events.find(el => el.id === id);
    const { lat, lng } = targetedWorkout.event.latlng;
    this.#map.flyTo([lat, lng], 12);
  }
}

const app = new App();

function clearFormField() {
  inputTask.value = '';
  inputLocation.value = '';
  inputDuration.value = '';
  inputTiming.value = '';
  console.log(events);
}
