import CountriesCoord from './countries.json';

export default class WorldMap {
  constructor() {
    this.mymap = L.map('mapid').setView([40, 8], 2);
    this.covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
    this.unitForRadiusOfMarkerSize = 0;
  }

  init() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiaWxsZW5hdGEiLCJhIjoiY2tpbHlheTNvMG1kejJzbGJ3d2MwZnJvdiJ9.VwLkkDFOzY09RruFl0u9dQ',
    }).addTo(this.mymap);

    this.checkDay();
    this.getUnitForRadiusOfMarkerSize();
    this.getCoordinates();
  }

  checkDay() {
    const fullDate = new Date();
    const currentDay = fullDate.toLocaleDateString();
    const someDay = localStorage.getItem('dayStorage');
    console.log(currentDay, someDay);

    if (someDay === null || someDay !== currentDay) {
      localStorage.setItem('dayStorage', currentDay);
      console.log('update');
      this.getCovidData();
    } else if (someDay === currentDay) {
      console.log('current date');
      this.getCovidData();
    }
  }

  getCovidData() {
    if (this.covidData !== null) {
      console.log('данные в сторейдж есть');
    } else {
      console.log('упс, данных нема, придется дергать API');
      this.getCountries();
    }
    // console.log(`локалсторейдж данные ковид ${covidData}`);
  }

  async getCountries() {
    const url = 'https://api.covid19api.com/summary';
    const response = await fetch(url);
    const data = await response.json();

    localStorage.setItem('covidDataStorage', JSON.stringify(data));
    console.log('дергаю API');
  }

  getUnitForRadiusOfMarkerSize() {
    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      const maxSize = 1500000;
      if (this.covidData.Countries[i].CountryCode === 'US') {
        this.unitForRadiusOfMarkerSize = maxSize / this.covidData.Countries[i].TotalConfirmed;
      }
    }
  }

  getCoordinates() {
    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      const sizeOfRadius = this.covidData.Countries[i].TotalConfirmed
      * this.unitForRadiusOfMarkerSize;

      for (let j = 0; j < CountriesCoord.length; j += 1) {
        if (this.covidData.Countries[i].CountryCode === CountriesCoord[j].CountryCode) {
          const circle = L.circle([CountriesCoord[j].Lat, CountriesCoord[j].Lon], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: sizeOfRadius,
          });
          circle.addTo(this.mymap);
        }
      }
    }
  }
}
