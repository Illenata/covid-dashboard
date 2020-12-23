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
    const arr = Object.values(res.cases);
    const month = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Нояб', 'Дек'];
    let array = Object.keys(res.cases);
    array = array.map((el) => {
      if (el === '1/1/20') {
        return month[0];
      }
      if (el === '2/1/20') {
        return month[1];
      }
      if (el === '3/1/20') {
        return month[2];
      }
      if (el === '4/1/20') {
        return month[3];
      }
      if (el === '5/1/20') {
        return month[4];
      }
      if (el === '6/1/20') {
        return month[5];
      }
      if (el === '7/1/20') {
        return month[6];
      }
      if (el === '8/1/20') {
        return month[7];
      }
      if (el === '9/1/20') {
        return month[8];
      }
      if (el === '10/1/20') {
        return month[9];
      }
      if (el === '11/1/20') {
        return month[10];
      }
      if (el === '12/1/20') {
        return month[11];
      }
      return el;
    });
    const shedule = new Shedule(arr, array);
    shedule.init();
  }));
