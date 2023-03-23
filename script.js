'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputTask = document.querySelector('.form__input--task');
const inputLocation = document.querySelector('.form__input--location');
const inputDuration = document.querySelector('.form__input--duration');
const inputTiming = document.querySelector('.form__input--timing');

if(navigator.geolocation)
navigator.geolocation.getCurrentPosition(function(position){
  const{latitude} = position.coords;
  const {longitude} = position.coords;
  const coords = [latitude,longitude]
  var map = L.map('map').setView(coords, 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

  map.on('click',function(ev){
    L.marker([ev.latlng.lat,ev.latlng.lng]).addTo(map)
    .bindPopup(L.popup({
      maxWidth : 300,
      minWidth : 200,
      autoClose : false,
      closeOnClick : false,
      closeButton : false,
      className : 'running-popup'
    }).setContent('Hello World'))
    .openPopup();
  })




},function(){
  alert('Could not get your position!');
})

