/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import './styles/styles.scss';
import CheckLocalStorageData from './scripts/checkLocalStorageData';
import WorldMap from './scripts/world-map';
import Grid from './scripts/grid';
import Shedule from './scripts/schedule';
import Tables from './scripts/tables';
import MapElements from './scripts/createMapElements';
import Observable from './scripts/allButtons';
import clickMapToTable from './scripts/clickMapToTable';

const grid = new Grid();
grid.init();

const area = document.querySelector('.graph');
const mapElements = new MapElements();
mapElements.init();

const checkLocalStorageData = new CheckLocalStorageData();
checkLocalStorageData.init();

if (checkLocalStorageData.loadCovidData && checkLocalStorageData.loadPopulation
  && checkLocalStorageData.flag) {
  const worldMap = new WorldMap(checkLocalStorageData.covidData,
    checkLocalStorageData.population);
  worldMap.init();
} else {
  // console.log('map fetch API');
  Promise.all([
    fetch('https://api.covid19api.com/summary'),
    fetch('https://restcountries-v1.p.rapidapi.com/all', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '9baf8e7bf7msh09f124bfdae5f8bp151f54jsn39d649d0f183',
        'x-rapidapi-host': 'restcountries-v1.p.rapidapi.com',
      },
    }),
    fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code'),
  ]).then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((data) => {
      const worldMap = new WorldMap(data[0], data[1]);
      worldMap.init();
      worldMap.geojson.eachLayer((layer) => {
        layer.on('click', () => {
          clickMapToTable(layer.feature.properties.wb_a2); // перерисовка страницы по клику на карте
        });
      });
      // document.addEventListener('DOMContentLoaded', () => {
      //   const option = document.querySelector('option');
      //   option.value = worldMap.typeData;
      // });
      localStorage.setItem('covidDataStorage', JSON.stringify(data[0]));
      localStorage.setItem('countryPopulation', JSON.stringify(data[1]));
      localStorage.setItem('countryPopulationFlag', JSON.stringify(data[2]));
    });
}

// if (checkLocalStorageData.loadFlag === false) { // эту часть можно переделывать или удалить
//   getFlagAPI(); // если модуль getFlagAPI не нужен - можно удалять его
// }

const tables = new Tables();
tables.init();

document.addEventListener('DOMContentLoaded', () => {
  const typeDataMap = document.querySelector('.map-data-type');
  const select = document.querySelector('.select');
  const option = document.querySelector('option');
  const mapwrapper = document.querySelector('.map-wrapper');

  console.log(typeDataMap.textContent, option.textContent);

  const headingsObserver = new Observable();

  headingsObserver.subscribe(typeDataMap.textContent);
  headingsObserver.subscribe(option.textContent);

  document.body.addEventListener('click', (e) => {
    let data = '';
    if (e.target === select) {
      data = option.textContent;
    } else if (e.target === mapwrapper) {
      data = typeDataMap.textContent;
    }
    headingsObserver.notify(data);
  });
});

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
