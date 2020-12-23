export default class ckeckLocalStorageData {
  constructor() {
    this.loadCovidData = false;
    this.loadFlag = false;
    this.loadPopulation = false;
    this.covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
    this.flag = JSON.parse(localStorage.getItem('countryPopulationFlag'));
    this.population = JSON.parse(localStorage.getItem('countryPopulation'));
  }

  init() {
    const fullDate = new Date();
    const currentDay = fullDate.toLocaleDateString();
    const storageDay = localStorage.getItem('dayStorage');

    if (this.covidData === null || storageDay === null || storageDay !== currentDay) {
      localStorage.setItem('dayStorage', currentDay);
      this.loadCovidData = false;
    } else {
      // console.log(`map last update ${storageDay}`);
      this.loadCovidData = true;
    }

    if (this.flag === null) {
      this.loadFlag = false;
    } else {
      this.loadFlag = true;
    }

    if (this.population === null) {
      this.loadPopulation = false;
    } else {
      this.loadPopulation = true;
    }
  }
}
