'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let events = [];
if(localStorage.getItem('events')){
  events = console.parse(localStorage.getItem('events'));
  events.forEach((el)=>{
    markLocation(el.event);
  })
}
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputTask = document.querySelector('.form__input--task');
const inputLocation = document.querySelector('.form__input--location');
const inputDuration = document.querySelector('.form__input--duration');
const inputTiming = document.querySelector('.form__input--timing');
const formBtn = document.querySelector('.form__btn');
const workouts = document.querySelector('.workouts');

let map,mapEvent;

if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(function(position){
  const{latitude} = position.coords;
  const {longitude} = position.coords;
  const coords = [latitude,longitude]
  map = L.map('map').setView(coords, 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

  map.on('click',function(ev){
  form.classList.toggle('hidden');
  inputTask.focus();
  mapEvent = ev;
  })  

},function(){
  alert('Could not get your position!');
})

function clearFormField(){
   inputTask.value = '';
    inputLocation.value = '';
    inputDuration.value = '';
    inputTiming.value = '';
    console.log(events);
}


form.addEventListener("submit",function(e){
  e.preventDefault();
  if(inputTiming.value){
    markLocation(mapEvent);
    let eventsObj = {
        task : inputTask.value,
        location : inputLocation.value,
        duration : inputDuration.value,
        timing : inputTiming.value,
        event : mapEvent,
    }
      events.push(eventsObj);
      form.classList.toggle('hidden');
      clearFormField();
      addField(eventsObj);
      localStorage.setItem('events',CircularJSON.stringify(events));
  }else{
    alert('enter complete details')
  }
 
})

function markLocation(mapEvent){
  L.marker([mapEvent.latlng.lat,mapEvent.latlng.lng]).addTo(map)
    .bindPopup(L.popup({
      maxWidth : 300,
      minWidth : 200,
      autoClose : false,
      closeOnClick : false,
      closeButton : false,
      className : 'running-popup'
    }).setContent(`${inputTask.value} at ${inputTiming.value}`))
    .openPopup();
}

function addField(eventsObj){
  workouts.insertAdjacentHTML('beforeend',`<li class="workout workout--running" data-id="1234567890">
  <h2 class="workout__title">${eventsObj.task} at exact ${eventsObj.timing}</h2>
  <div class="workout__details">
    <span class="workout__icon">🗺 </span>
    <span class="workout__value">${eventsObj.location}</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${eventsObj.timing}</span>
    <span class="workout__unit">AM</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⏱</span>
    <span class="workout__value">${eventsObj.duration}</span>
    <span class="workout__unit">min</span>
  </div>
</li>`)
}
