import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import countryBorder from './custom.geo.json';
import MapElements from './createMapElements';

const mapElements = new MapElements();
mapElements.init();

export default class WorldMap {
  constructor(covidData, populationCoordsData) {
    this.mymap = L.map('mapid').setView([40, 8], 2);
    this.covidData = covidData;
    this.populationCoordsData = populationCoordsData;

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

    this.createPanesCountries();
    this.getUnitForRadiusOfMarkerSize();
    this.createMarkers();
    this.createLegend();
    this.createNavLayers();
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
        if (this.covidData.Countries[i].CountryCode === this.populationCoordsData[j].alpha2Code
            && this.covidData.Countries[i].CountryCode) {
          this.addMarkers('red', this.covidData.Countries[i].TotalConfirmed, this.casesMarkersGroup, 'Cases', i, j);
          this.addMarkers('green', this.covidData.Countries[i].TotalRecovered, this.recoveredMarkersGroup, 'Recovered', i, j);
          this.addMarkers('black', this.covidData.Countries[i].TotalDeaths, this.deathsMarkersGroup, 'Deaths', i, j);

          const people = this.populationCoordsData[j].population;
          const controlElem = document.querySelector('.control-layers');

          const country = this.covidData.Countries[i].Country;
          const totalCases = this.covidData.Countries[i].TotalConfirmed;
          const dailyCases = this.covidData.Countries[i].NewConfirmed;
          const totalRecovered = this.covidData.Countries[i].TotalRecovered;
          const dailyRecovered = this.covidData.Countries[i].NewRecovered;
          const totalDeaths = this.covidData.Countries[i].TotalDeaths;
          const dailyDeaths = this.covidData.Countries[i].NewDeaths;

          const minSize = 3;
          const calculateRer100k = (data) => Math.round((data / people) * 100000);
          const calcRadius = (data) => minSize + (data * this.unitMarkerSize);
          const changeMarker = (markers, data, name) => {
            markers[i].setRadius(calcRadius(data));

            markers[i].setPopupContent(`<b>${country}</b>
                <br>${name}: ${data}`);
          };

          controlElem.addEventListener('click', () => {
            if (this.absoluteElem.checked && this.allTimeElem.checked) {
              changeMarker(this.casesMarkersGroup, totalCases, 'Cases');
              changeMarker(this.recoveredMarkersGroup, totalRecovered, 'Recovered');
              changeMarker(this.deathsMarkersGroup, totalDeaths, 'Deaths');
            } else if (this.absoluteElem.checked && this.lastDayElem.checked) {
              changeMarker(this.casesMarkersGroup, dailyCases, 'Daily cases');
              changeMarker(this.recoveredMarkersGroup, dailyRecovered, 'Daily recovered');
              changeMarker(this.deathsMarkersGroup, dailyDeaths, 'Daily deaths');
            } else if (this.coefElem.checked && this.allTimeElem.checked) {
              changeMarker(this.casesMarkersGroup, calculateRer100k(totalCases), 'Cases per 100k');
              changeMarker(this.recoveredMarkersGroup, calculateRer100k(totalRecovered), 'Recovered per 100k');
              changeMarker(this.deathsMarkersGroup, calculateRer100k(totalDeaths), 'Deaths per 100k');
            } else {
              changeMarker(this.casesMarkersGroup, calculateRer100k(dailyCases), 'Daily cases per 100k');
              changeMarker(this.recoveredMarkersGroup, calculateRer100k(dailyRecovered), 'Daily recovered per 100k');
              changeMarker(this.deathsMarkersGroup, calculateRer100k(dailyDeaths), 'Daily death per 100k');
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

  createPanesCountries() {
    this.mymap.createPane('labels');
    this.mymap.getPane('labels').style.zIndex = 650;
    this.mymap.getPane('labels').style.pointerEvents = 'none';

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '©OpenStreetMap, ©CartoDB',
    }).addTo(this.mymap);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      attribution: '©OpenStreetMap, ©CartoDB',
      pane: 'labels',
    }).addTo(this.mymap);

    const myCustomStyle = {
      stroke: true,
      fill: true,
      color: '#555',
      fillColor: '#fff',
      fillOpacity: 1,
    };

    const geojson = L.geoJson(countryBorder, {
      style: myCustomStyle,
    }).addTo(this.mymap);

    geojson.id = 'countries';
    geojson.eachLayer((layer) => {
      layer.on('mouseover', () => {
        layer.setStyle({
          fillColor: 'rgb(235, 253, 133)',
        });
      });
      layer.on('mouseout', () => {
        geojson.resetStyle(layer);
      });
    });

    this.mymap.fitBounds(geojson.getBounds());
  }
}
