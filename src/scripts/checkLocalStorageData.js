import getDataFromAPI from './getDataFromAPI';

export default function ckeckLocalStorageData() {
  const fullDate = new Date();
  const currentDay = fullDate.toLocaleDateString();
  const storageDay = localStorage.getItem('dayStorage');
  const covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
  // console.log(currentDay, storageDay);

  if (covidData === null || storageDay === null || storageDay !== currentDay) {
    localStorage.setItem('dayStorage', currentDay);
    // console.log('update storage from API');
    getDataFromAPI();
  }

  return covidData;
}
