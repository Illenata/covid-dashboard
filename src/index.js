import './styles/styles.scss';
import CheckLocalStorageData from './scripts/checkLocalStorageData';
import WorldMap from './scripts/world-map';
import Grid from './scripts/grid';
import pic from './scripts/schedule';
import Tables from './scripts/tables';
import MapElements from './scripts/createMapElements';
import Observable from './scripts/observer';

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

  Observable.subscribe(worldMap);

  worldMap.geojson.eachLayer((layer) => {
    layer.on('click', () => {
      console.log(layer.feature.properties.wb_a2);
    });
  });
} else {
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

      Observable.subscribe(worldMap);

      worldMap.geojson.eachLayer((layer) => {
        layer.on('click', () => {
          console.log(layer.feature.properties.wb_a2);
        });
      });

      localStorage.setItem('covidDataStorage', JSON.stringify(data[0]));
      localStorage.setItem('countryPopulation', JSON.stringify(data[1]));
      localStorage.setItem('countryPopulationFlag', JSON.stringify(data[2]));
    });
}

const tables = new Tables();
tables.init();
area.append(pic);
