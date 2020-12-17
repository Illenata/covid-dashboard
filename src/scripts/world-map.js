import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../node_modules/leaflet-toolbar/dist/leaflet.toolbar.css';
// import CountriesCoord from './coordinates-countries.json';
import checkLocalStorageData from './checkLocalStorageData';

export default class WorldMap {
  constructor() {
    this.mymap = L.map('mapid').setView([40, 8], 2);
    this.covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
    this.populationCoordsData = JSON.parse(localStorage.getItem('countryPopulation'));

    this.unitMarkerSize = 0;

    this.casesMarkersGroup = [];
    this.recoveredMarkersGroup = [];
    this.deathsMarkersGroup = [];

    this.absoluteElem = document.querySelector('.value-absolute');
    this.coefElem = document.querySelector('.value-coefficient');
    this.allTimeElem = document.querySelector('.time-all');
    this.lastDayElem = document.querySelector('.time-last-day');
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

    checkLocalStorageData();
    this.checkLoadCovidData();
    // this.getUnitForRadiusOfMarkerSize();
    // this.createMarkers();
    this.createLegend();
    this.createNavLayers();
  }

  checkLoadCovidData() {
    if (this.covidData !== null) {
      this.getUnitForRadiusOfMarkerSize();
      this.createMarkers();
    }
  }

  getUnitForRadiusOfMarkerSize() {
    const maxSize = 50;
    const totalCasesArr = [];

    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      totalCasesArr.push(this.covidData.Countries[i].TotalConfirmed);
    }

    const maxNum = (arr) => arr.reduce((a, b) => (a > b ? a : b));

    this.unitMarkerSize = maxSize / maxNum(totalCasesArr);
  }

  addMarkers(colorCircle, type, arrayCircles, name, i, j) {
    const minSize = 3;
    const circle = L.circleMarker([this.populationCoordsData[j].latlng[0],
      this.populationCoordsData[j].latlng[1]], {
      color: colorCircle,
      fillColor: colorCircle,
      fillOpacity: 0.5,
      radius: minSize + (type * this.unitMarkerSize),
    });
    circle.bindPopup(`<b>${this.covidData.Countries[i].Country}</b>
      <br>${name}: ${type}`);

    circle.on('mouseover', () => {
      circle.openPopup();
    });
    circle.on('mouseout', () => {
      circle.closePopup();
    });

    arrayCircles.push(circle);
  }

  createMarkers() {
    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      for (let j = 0; j < this.populationCoordsData.length; j += 1) {
        if (this.covidData.Countries[i].CountryCode === this.populationCoordsData[j].alpha2Code) {
          this.addMarkers('red', this.covidData.Countries[i].TotalConfirmed, this.casesMarkersGroup, 'Cases', i, j);
          this.addMarkers('green', this.covidData.Countries[i].TotalRecovered, this.recoveredMarkersGroup, 'Recovered', i, j);
          this.addMarkers('black', this.covidData.Countries[i].TotalDeaths, this.deathsMarkersGroup, 'Deaths', i, j);

          const people = this.populationCoordsData[j].population;
          const controlElem = document.querySelector('.control-layers');

          controlElem.addEventListener('click', () => {
            const minSize = 3;

            if (this.absoluteElem.checked && this.allTimeElem.checked) {
              this.casesMarkersGroup[i].setRadius(minSize
                + (this.covidData.Countries[i].TotalConfirmed) * this.unitMarkerSize);

              this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Cases: ${this.covidData.Countries[i].TotalConfirmed}`);

              this.recoveredMarkersGroup[i].setRadius(minSize
                + (this.covidData.Countries[i].TotalRecovered) * this.unitMarkerSize);

              this.recoveredMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Recovered: ${this.covidData.Countries[i].TotalRecovered}`);

              this.deathsMarkersGroup[i].setRadius(minSize
                + (this.covidData.Countries[i].TotalDeaths) * this.unitMarkerSize);

              this.deathsMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                    <br>Deaths: ${this.covidData.Countries[i].TotalDeaths}`);
            } else if (this.absoluteElem.checked && this.lastDayElem.checked) {
              this.casesMarkersGroup[i].setRadius(minSize
                + (this.covidData.Countries[i].NewConfirmed) * this.unitMarkerSize);

              this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Daily cases: ${this.covidData.Countries[i].NewConfirmed}`);

              this.recoveredMarkersGroup[i].setRadius(minSize
                + (this.covidData.Countries[i].NewRecovered) * this.unitMarkerSize);

              this.recoveredMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Daily recovered: ${this.covidData.Countries[i].NewRecovered}`);

              this.deathsMarkersGroup[i].setRadius(minSize
                + (this.covidData.Countries[i].NewDeaths) * this.unitMarkerSize);

              this.deathsMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Daily deaths: ${this.covidData.Countries[i].NewDeaths}`);
            } else if (this.coefElem.checked && this.allTimeElem.checked) {
              this.casesMarkersGroup[i].setRadius(minSize
                + ((this.covidData.Countries[i].TotalConfirmed / people) * 100000)
                * this.unitMarkerSize);

              this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Cases per 100k: ${(this.covidData.Countries[i].TotalConfirmed / people) * 100000}`);

              this.recoveredMarkersGroup[i].setRadius(minSize
                + ((this.covidData.Countries[i].TotalRecovered / people) * 100000)
                * this.unitMarkerSize);

              this.recoveredMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Recovered per 100k: ${(this.covidData.Countries[i].TotalRecovered / people) * 100000}`);

              this.deathsMarkersGroup[i].setRadius(minSize
                + ((this.covidData.Countries[i].TotalDeaths / people) * 100000)
                * this.unitMarkerSize);

              this.deathsMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Deaths per 100k: ${(this.covidData.Countries[i].TotalDeaths / people) * 100000}`);
            } else {
              this.casesMarkersGroup[i].setRadius(minSize
                + ((this.covidData.Countries[i].NewConfirmed / people) * 100000)
                * this.unitMarkerSize);

              this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Daily cases per 100k: ${(this.covidData.Countries[i].NewConfirmed / people) * 100000}`);

              this.recoveredMarkersGroup[i].setRadius(minSize
                + ((this.covidData.Countries[i].NewRecovered / people) * 100000)
                * this.unitMarkerSize);

              this.recoveredMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Daily recovered per 100k: ${(this.covidData.Countries[i].NewRecovered / people) * 100000}`);

              this.deathsMarkersGroup[i].setRadius(minSize
                + ((this.covidData.Countries[i].NewDeaths / people) * 100000)
                * this.unitMarkerSize);

              this.deathsMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                <br>Daily death per 100k: ${(this.covidData.Countries[i].NewDeaths / people) * 100000}`);
            }
          });
        }
      }
    }
  }

  createLegend() {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');
      const items = ['Cases', 'Recovered', 'Deaths'];

      for (let i = 0; i < items.length; i += 1) {
        const stringWrapper = document.createElement('div');
        stringWrapper.classList.add('string-wrapper');
        div.append(stringWrapper);

        const markerColor = document.createElement('i');
        markerColor.classList.add(items[i].toLowerCase());
        stringWrapper.append(markerColor);

        const p = document.createElement('p');
        stringWrapper.append(p);
        p.innerText = items[i];
      }

      return div;
    };

    legend.addTo(this.mymap);
  }

  createNavLayers() {
    const casesLayer = L.layerGroup(this.casesMarkersGroup);
    const recoveredLayer = L.layerGroup(this.recoveredMarkersGroup);
    const deathsLayer = L.layerGroup(this.deathsMarkersGroup);
    casesLayer.addTo(this.mymap);

    const overlayMaps = {
      Cases: casesLayer,
      Recovered: recoveredLayer,
      Deaths: deathsLayer,
    };

    L.control.layers(overlayMaps, null, { collapsed: false }).addTo(this.mymap);
  }
}
