// import getCovidDataFromAPI from './getCovidDataFromAPI';
// import getFlagAPI from './getFlagAPI';
// import getPopulationAPI from './getPopulationAPI';
// import WorldMap from './world-map';

export default class ckeckLocalStorageData {
  constructor() {
    this.loadCovidData = false;
    this.loadFlag = false;
    this.loadPopulation = false;

    this.covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
    this.flag = JSON.parse(localStorage.getItem('countryFlag'));
    this.population = JSON.parse(localStorage.getItem('countryPopulation'));
  }

  init() {
    const fullDate = new Date();
    const currentDay = fullDate.toLocaleDateString();
    const storageDay = localStorage.getItem('dayStorage');

    if (this.covidData === null || storageDay === null || storageDay !== currentDay) {
      localStorage.setItem('dayStorage', currentDay);
      // console.log('update storage from API');
      this.loadCovidData = false;
      // getCovidDataFromAPI();
    } else {
      this.loadCovidData = true;
    }

    if (this.flag === null) {
      this.loadFlag = false;
      // getFlagAPI();
    } else {
      this.loadFlag = true;
    }

    if (this.population === null) {
      this.loadPopulation = false;
      // getPopulationAPI();
    } else {
      this.loadPopulation = true;
    }
    // console.log(currentDay, storageDay);

    // const map = new WorldMap();

  // function markers() {
  //   map.init;
  // }
  }
}
