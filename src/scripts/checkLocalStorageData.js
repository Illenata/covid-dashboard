import getCovidDataFromAPI from './getCovidDataFromAPI';
import getFlagAPI from './getFlagAPI';
import getPopulationAPI from './getPopulationAPI';

export default function ckeckLocalStorageData() {
  const fullDate = new Date();
  const currentDay = fullDate.toLocaleDateString();
  const storageDay = localStorage.getItem('dayStorage');

  const covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
  const flag = JSON.parse(localStorage.getItem('countryFlag'));
  const population = JSON.parse(localStorage.getItem('countryPopulation'));
  // console.log(currentDay, storageDay);

  if (covidData === null || storageDay === null || storageDay !== currentDay) {
    localStorage.setItem('dayStorage', currentDay);
    // console.log('update storage from API');
    getCovidDataFromAPI();
  }

  if (flag === null) {
    getFlagAPI();
  }

  if (population === null) {
    getPopulationAPI();
  }
}
