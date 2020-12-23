/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import './styles/styles.scss';
import CheckLocalStorageData from './scripts/checkLocalStorageData';
import getFlagAPI from './scripts/getFlagAPI';
import WorldMap from './scripts/world-map';
import Grid from './scripts/grid';
import Shedule from './scripts/schedule';
import Tables from './scripts/tables';
import MapElements from './scripts/createMapElements';

const grid = new Grid();
grid.init();

const mapElements = new MapElements();
mapElements.init();
const checkLocalStorageData = new CheckLocalStorageData();
checkLocalStorageData.init();
if (checkLocalStorageData.loadCovidData && checkLocalStorageData.loadPopulation) {
  const worldMap = new WorldMap(checkLocalStorageData.covidData,
    checkLocalStorageData.population);
  worldMap.init();
} else {
  console.log('map fetch API');
  Promise.all([
    fetch('https://api.covid19api.com/summary'),
    fetch('https://restcountries-v1.p.rapidapi.com/all', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '9baf8e7bf7msh09f124bfdae5f8bp151f54jsn39d649d0f183',
        'x-rapidapi-host': 'restcountries-v1.p.rapidapi.com',
      },
    }),
  ]).then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((data) => {
      const worldMap = new WorldMap(data[0], data[1]);
      worldMap.init();
      localStorage.setItem('covidDataStorage', JSON.stringify(data[0]));
      localStorage.setItem('countryPopulation', JSON.stringify(data[1]));
    });
}

if (checkLocalStorageData.loadFlag === false) { // эту часть можно переделывать или удалить
  getFlagAPI(); // если модуль getFlagAPI не нужен - можно удалять его
}

const tables = new Tables();
tables.init();

fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
  .then((response) => response.json().then((res) => console.log(res)));
fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
  .then((response) => response.json().then((res) => {
    let x = Object.values(res.cases);
    let y = Object.keys(res.cases);
    let a = Object.values(res.recovered);
    let b = Object.values(res.deaths);
    const cases = new Shedule(x, y, a, b);
    cases.init();
    /* arr = Object.values(res.recovered);
    array = Object.keys(res.recovered);
    const reserved = new Shedule(arr, array);
    reserved.init(); */
  }));
