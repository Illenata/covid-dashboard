import getCovidDataFromAPI from './getCovidDataFromAPI';
import getPopulationFlafAPI from './getPopulationFlagAPI';

export default function ckeckLocalStorageData() {
  const fullDate = new Date();
  const currentDay = fullDate.toLocaleDateString();
  const storageDay = localStorage.getItem('dayStorage');

  const covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
  const populationFlag = JSON.parse(localStorage.getItem('countryPopulationFlag'));
  // console.log(currentDay, storageDay);

  if (covidData === null || storageDay === null || storageDay !== currentDay) {
    localStorage.setItem('dayStorage', currentDay);
    // console.log('update storage from API');
    getCovidDataFromAPI();
  }

  if (populationFlag === null) {
    getPopulationFlafAPI();
  }
  // console.log(populationFlag[0].population);
}
