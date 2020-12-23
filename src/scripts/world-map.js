import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import countryBorder from './custom.geo.json';

export default class WorldMap {
  constructor(covidData, populationCoordsData) {
    this.mymap = L.map('mapid', {
      zoomSnap: 0.1,
      worldCopyJump: true,
      maxBounds: [[-85, -180.0], [85, 180.0]],
    }).setView([20, -20], 1.6)
      .setMinZoom(1.5)
      .setMaxZoom(4);
    this.covidData = covidData;
    this.populationCoordsData = populationCoordsData;

    this.unitMarkerSize = 0;
    this.markersGroup = [];
    this.popapContent = new Map();
    this.wrapper = document.querySelector('.map-wrapper');
    this.buttonFullScreen = document.querySelector('.center_');
    this.isFullScreen = false;
  }

  init() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 4,
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

    this.buttonFullScreen.addEventListener('click', () => {
      this.isFullScreen = !this.isFullScreen;

      if (this.isFullScreen === true) {
        this.mymap
          .invalidateSize()
          .setView([50, -80], 2);
      } else {
        this.mymap
          .invalidateSize()
          .setView([20, -20], 1.6);
      }
    });
  }

  getUnitForRadiusOfMarkerSize() {
    const maxSize = 40;
    const totalCasesArr = [];

    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      totalCasesArr.push(this.covidData.Countries[i].TotalConfirmed);
    }

    const maxNum = (arr) => arr.reduce((a, b) => (a > b ? a : b));
    this.unitMarkerSize = maxSize / maxNum(totalCasesArr);
  }

  addMarkers(colorCircle, type, name, i, j) {
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

    circle.bindPopup(this.popapContent.get(this.covidData.Countries[i].CountryCode));

    circle.on('mouseover', () => {
      circle.openPopup();
    });
    circle.on('mouseout', () => {
      circle.closePopup();
    });

    this.markersGroup.push(circle);
  }

  customLayersNav() {
    L.Control.CustomControl = L.Control.extend({
      onAdd() {
        const controlLayersElem = document.querySelector('.group-type');
        return controlLayersElem;
      },
      // onRemove() {
      // },
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
          this.addMarkers('red', this.covidData.Countries[i].TotalConfirmed, 'Cases', i, j);

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
          const changeMarker = (data, name, setColor) => {
            this.markersGroup[i].setRadius(calcRadius(data));

            this.markersGroup[i].setPopupContent(`<b>${country}</b>
                <br>${name}: ${data}`);

            this.markersGroup[i].setStyle({
              color: setColor,
              fillColor: setColor,
            });

            this.popapContent.set(this.covidData.Countries[i].CountryCode,
              `<b>${country}</b>
            <br>${name}: ${data}`);
          };

          this.wrapper.addEventListener('click', () => {
            if (casesElem.checked) {
              if (absoluteElem.checked && allTimeElem.checked) {
                changeMarker(totalCases, 'Cases', 'red');
              } else if (absoluteElem.checked && lastDayElem.checked) {
                changeMarker(dailyCases, 'Daily cases', 'red');
              } else if (coefElem.checked && allTimeElem.checked) {
                changeMarker(calculateRer100k(totalCases), 'Cases per 100k', 'red');
              } else {
                changeMarker(calculateRer100k(dailyCases), 'Daily cases per 100k', 'red');
              }
            } if (recoveredElem.checked) {
              if (absoluteElem.checked && allTimeElem.checked) {
                changeMarker(totalRecovered, 'Recovered', 'green');
              } else if (absoluteElem.checked && lastDayElem.checked) {
                changeMarker(dailyRecovered, 'Daily recovered', 'green');
              } else if (coefElem.checked && allTimeElem.checked) {
                changeMarker(calculateRer100k(totalRecovered), 'Recovered per 100k', 'green');
              } else {
                changeMarker(calculateRer100k(dailyRecovered), 'Daily recovered per 100k', 'green');
              }
            } if (deathsElem.checked) {
              if (absoluteElem.checked && allTimeElem.checked) {
                changeMarker(totalDeaths, 'Deaths', 'black');
              } else if (absoluteElem.checked && lastDayElem.checked) {
                changeMarker(dailyDeaths, 'Daily deaths', 'black');
              } else if (coefElem.checked && allTimeElem.checked) {
                changeMarker(calculateRer100k(totalDeaths), 'Deaths per 100k', 'black');
              } else {
                changeMarker(calculateRer100k(dailyDeaths), 'Daily deaths per 100k', 'black');
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

    // this.mymap.fitBounds(geojson.getBounds());
  }
}
