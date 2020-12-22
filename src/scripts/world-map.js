import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import countryBorder from './custom.geo.json';

export default class WorldMap {
  constructor(covidData, populationCoordsData) {
    this.mymap = L.map('mapid').setView([40, 8], 2);
    this.covidData = covidData;
    this.populationCoordsData = populationCoordsData;

    this.unitMarkerSize = 0;

    this.casesMarkersGroup = [];

    this.popapContent = new Map();

    this.wrapper = document.querySelector('.map-wrapper');
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
    this.customLayersNav();
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

    circle.addTo(this.mymap);

    this.popapContent.set(this.covidData.Countries[i].CountryCode,
      `<b>${this.covidData.Countries[i].Country}</b>
    <br>${name}: ${type}`);

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

  customLayersNav() {
    L.Control.CustomControl = L.Control.extend({
      onAdd() {
        const controlLayersElem = document.querySelector('.group-type');
        return controlLayersElem;
      },
      onRemove() {
        // Nothing to do here
      },
    });
    L.control.customControl = function createControl(opts) {
      return new L.Control.CustomControl(opts);
    };
    L.control.customControl({ position: 'topright' }).addTo(this.mymap);
  }

  createMarkers() {
    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      for (let j = 0; j < this.populationCoordsData.length; j += 1) {
        if (this.covidData.Countries[i].CountryCode === this.populationCoordsData[j].alpha2Code) {
          this.addMarkers('red', this.covidData.Countries[i].TotalConfirmed, this.casesMarkersGroup, 'Cases', i, j);

          const people = this.populationCoordsData[j].population;
          const absoluteElem = document.querySelector('.value-absolute');
          const coefElem = document.querySelector('.value-coefficient');
          const allTimeElem = document.querySelector('.time-all');
          const lastDayElem = document.querySelector('.time-last-day');
          const casesElem = document.querySelector('.cases');
          const recoveredElem = document.querySelector('.recovered');
          const deathsElem = document.querySelector('.deaths');

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
          const changeMarker = (markers, data, name, popapContent, setColor) => {
            markers[i].setRadius(calcRadius(data));

            markers[i].setPopupContent(`<b>${country}</b>
                <br>${name}: ${data}`);

            markers[i].setStyle({
              color: setColor,
              fillColor: setColor,
            });

            popapContent.set(this.covidData.Countries[i].CountryCode,
              `<b>${country}</b>
            <br>${name}: ${data}`);
          };

          this.wrapper.addEventListener('click', () => {
            if (casesElem.checked) {
              if (absoluteElem.checked && allTimeElem.checked) {
                changeMarker(this.casesMarkersGroup, totalCases, 'Cases', this.popapContent, 'red');
              } else if (absoluteElem.checked && lastDayElem.checked) {
                changeMarker(this.casesMarkersGroup, dailyCases, 'Daily cases', this.popapContent, 'red');
              } else if (coefElem.checked && allTimeElem.checked) {
                changeMarker(this.casesMarkersGroup, calculateRer100k(totalCases), 'Cases per 100k', this.popapContent, 'red');
              } else {
                changeMarker(this.casesMarkersGroup, calculateRer100k(dailyCases), 'Daily cases per 100k', this.popapContent, 'red');
              }
            } if (recoveredElem.checked) {
              if (absoluteElem.checked && allTimeElem.checked) {
                changeMarker(this.casesMarkersGroup, totalRecovered, 'Recovered', this.popapContent, 'green');
              } else if (absoluteElem.checked && lastDayElem.checked) {
                changeMarker(this.casesMarkersGroup, dailyRecovered, 'Daily recovered', this.popapContent, 'green');
              } else if (coefElem.checked && allTimeElem.checked) {
                changeMarker(this.casesMarkersGroup, calculateRer100k(totalRecovered), 'Recovered per 100k', this.popapContent, 'green');
              } else {
                changeMarker(this.casesMarkersGroup, calculateRer100k(dailyRecovered), 'Daily recovered per 100k', this.popapContent, 'green');
              }
            } if (deathsElem.checked) {
              if (absoluteElem.checked && allTimeElem.checked) {
                changeMarker(this.casesMarkersGroup, totalDeaths, 'Deaths', this.popapContent, 'black');
              } else if (absoluteElem.checked && lastDayElem.checked) {
                changeMarker(this.casesMarkersGroup, dailyDeaths, 'Daily deaths', this.popapContent, 'black');
              } else if (coefElem.checked && allTimeElem.checked) {
                changeMarker(this.casesMarkersGroup, calculateRer100k(totalDeaths), 'Recovered per 100k', this.popapContent, 'black');
              } else {
                changeMarker(this.casesMarkersGroup, calculateRer100k(dailyDeaths), 'Daily deaths per 100k', this.popapContent, 'black');
              }
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
        this.covidData.Countries.forEach((countryCovid) => {
          this.populationCoordsData.forEach((country) => {
            if (countryCovid.CountryCode === layer.feature.properties.wb_a2
              && layer.feature.properties.wb_a2 === country.alpha2Code) {
              new L.Popup()
                .setLatLng(country.latlng)
                .setContent(this.popapContent.get(layer.feature.properties.wb_a2))
                .openOn(this.mymap);
            }
          });
        });
        layer.openPopup();
        layer.setStyle({
          fillColor: 'rgb(235, 253, 133)',
        });
      });
      layer.on('mouseout', () => {
        layer.closePopup();
        geojson.resetStyle(layer);
      });
    });

    this.mymap.fitBounds(geojson.getBounds());
  }
}
