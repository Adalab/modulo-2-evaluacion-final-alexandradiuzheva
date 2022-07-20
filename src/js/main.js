'use strict';

// HTML ELEMENTS

const userInput = document.querySelector('.js-userInput');
const searchButton = document.querySelector('.js-searchButton');
const resetButton = document.querySelector('.js-resetButton');
const listSeries = document.querySelector('.js-listSeries');
const listFav = document.querySelector('.js-listFav');
const resetFavButton = document.querySelector('.js-resetFavButton');
const logButton = document.querySelector('.js-logButton');

// ARRAYS
let series = [];
let favorites = [];

// FUNCTIONS

// API REQUEST
function getDataApi() {
  fetch(`https://api.jikan.moe/v4/anime?q=${userInput.value}`)
    .then((response) => response.json())
    .then((dataReturn) => {
      series = dataReturn.data;
      console.log(series);
      renderSeries();
    });
}

// RENDER SERIES

function renderSeries() {
  let html = '';
  for (const oneSerie of series) {
    html += `<li class="js-search-id" id="${oneSerie.mal_id}">`;

    let image2show = `<div><img src=${oneSerie.images.jpg.image_url}></div>`;
    const imageSource2replace =
      'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png';

    // If the image does not have a picture replace for default
    if (
      oneSerie.images.jpg.image_url === null ||
      oneSerie.images.jpg.image_url === imageSource2replace
    ) {
      image2show = `<div><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"></div>`;
    }

    html += image2show;
    html += `<h3>${oneSerie.title}</h3>`;
    html += `<h3>${oneSerie.episodes}</h3>`;
    html += `</li>`;
  }
  listSeries.innerHTML = html;
  handleClickFav();
}

// ADD TO FAVORITES
function add2FavList(ev) {
  const id = ev.currentTarget.id;
  const serie = findSerie(id, series);
  if (findSerie(id, favorites)) {
    ev.currentTarget.classList.remove('new-color');
    favorites.splice(favorites.indexOf(serie), 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } else {
    ev.currentTarget.classList.add('new-color');
    saveFavorite(serie);
  }
}

// FIND SERIE BY ID
function findSerie(id, series) {
  //THE ID IS A STRING, SO WE PARSEIN
  id = parseInt(id);
  return series.find((serie) => serie.mal_id === id);
}

// ADD TO ARRAY AND TO LOCAL STORAGE
function saveFavorite(serie) {
  favorites.push(serie);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// GET FROM LOCAL STORAGE

function getFromLocalStorage() {
  if (JSON.parse(localStorage.getItem('favorites'))) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
    renderFav(series);
  } else {
    listFav.innerHTML = '';
    localStorage.removeItem('favorites');
  }
}

getFromLocalStorage();

// RENDER FAVORITES
function renderFav() {
  let html = '';
  for (const oneSerie of favorites) {
    html += `<li class="js-search-id" id="${oneSerie.mal_id}">`;

    let image2show = `<div><img src=${oneSerie.images.jpg.image_url}></div>`;
    const imageSource2replace =
      'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png';

    // If the image does not have a picture replace for default
    if (
      oneSerie.images.jpg.image_url === null ||
      oneSerie.images.jpg.image_url === imageSource2replace
    ) {
      image2show = `<div><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"></div>`;
    }

    html += image2show;
    html += `<h3>${oneSerie.title}</h3>`;
    html += `<button type="button" class="js-clear-btn">X</button>`;
    html += `</li>`;
  }
  listFav.innerHTML = html;
  removeFromFavList();
}

// REMOVE FAVORITES ONE TO ONE
function removeFromList(ev) {
  const id = ev.currentTarget.parentElement.id;
  const serie = findSerie(id, favorites);
  favorites.splice(favorites.indexOf(serie), 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  listFav.removeChild(ev.currentTarget.parentElement);
  renderFav();
}

// REMOVE ALL FAVORITES
function resetFavlist() {
  listFav.innerHTML = '';
  favorites = [];
  localStorage.removeItem('favorites');
  getFromLocalStorage();
}

removeFromFavList();

// REMOVE SEARCH RESULTS

function resetSearchResults() {
  userInput.value = '';
  listSeries.innerHTML = '';
  series = [];
}

// EVENT FUNCTIONS

function handleClick(event) {
  event.preventDefault();
  getDataApi();
}

function resetClick(event) {
  event.preventDefault();
  resetSearchResults();
}

function resetFav(event) {
  event.preventDefault();
  resetFavlist();
}

function handleLog(event) {
  event.preventDefault();
  for (const oneSerie of series) {
    console.log(oneSerie.title);
  }
}

// EVENTS LISTENERS

searchButton.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetClick);
resetFavButton.addEventListener('click', resetFav);
logButton.addEventListener('click', handleLog);

function handleClickFav() {
  const fav = document.querySelectorAll('.js-search-id');
  for (const elem of fav) {
    elem.addEventListener('click', add2FavList);
    elem.addEventListener('click', renderFav);
  }
}

function removeFromFavList() {
  const resetFavSerie = document.querySelectorAll('.js-clear-btn');
  for (const elem of resetFavSerie) {
    elem.addEventListener('click', removeFromList);
  }
}
