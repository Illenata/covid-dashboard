import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import countryBorder from './custom.geo.json';

export default class WorldMap {
  constructor(covidData, populationCoordsData) {
    this.mymap = L.map('mapid').setView([40, 8], 2);
    this.covidData = covidData;
    this.populationCoordsData = populationCoordsData;

    this.geojson = L.geoJson(countryBorder, {
      style: this.mapStyle(),
    }).addTo(this.mymap);

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
        for (let k = 0; k < countryBorder.features.length; k += 1) {
          if (this.covidData.Countries[i].CountryCode === this.populationCoordsData[j].alpha2Code
            && this.covidData.Countries[i].CountryCode
            === countryBorder.features[k].properties.wb_a2) {
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

            controlElem.addEventListener('click', () => {
              if (this.absoluteElem.checked && this.allTimeElem.checked) {
                this.casesMarkersGroup[i].setRadius(calcRadius(totalCases));

                this.casesMarkersGroup[i].setPopupContent(`<b>${country}</b>
                  <br>Cases: ${totalCases}`);
                // this.geojson[k].setPopupContent(`<b>${country}</b>
                //   <br>Cases: ${totalCases}`);

                this.recoveredMarkersGroup[i].setRadius(calcRadius(totalRecovered));

                this.recoveredMarkersGroup[i].setPopupContent(`<b>${country}</b>
                  <br>Recovered: ${totalRecovered}`);

                this.deathsMarkersGroup[i].setRadius(calcRadius(totalDeaths));

                this.deathsMarkersGroup[i].setPopupContent(`<b>${country}</b>
                      <br>Deaths: ${totalDeaths}`);
              } else if (this.absoluteElem.checked && this.lastDayElem.checked) {
                this.casesMarkersGroup[i].setRadius(calcRadius(dailyCases));

                this.casesMarkersGroup[i].setPopupContent(`<b>${country}</b>
                  <br>Daily cases: ${dailyCases}`);

                this.recoveredMarkersGroup[i].setRadius(calcRadius(dailyRecovered));

                this.recoveredMarkersGroup[i].setPopupContent(`<b>${country}</b>
                  <br>Daily recovered: ${dailyRecovered}`);

                this.deathsMarkersGroup[i].setRadius(calcRadius(dailyDeaths));

                this.deathsMarkersGroup[i].setPopupContent(`<b>${country}</b>
                  <br>Daily deaths: ${dailyDeaths}`);
              } else if (this.coefElem.checked && this.allTimeElem.checked) {
                this.casesMarkersGroup[i].setRadius(calcRadius(calculateRer100k(totalCases)));

                this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
                  <br>Cases per 100k: ${calculateRer100k(totalCases)}`);

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

  mapStyle() {
    const myCustomStyle = {
      stroke: true,
      fill: true,
      color: '#555',
      fillColor: '#fff',
      fillOpacity: 1,
    };

    return myCustomStyle;
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

    this.geojson.eachLayer((layer) => {
      layer.bindPopup(layer.feature.properties.wb_a2);
      layer.on('mouseover', () => {
        layer.setStyle({
          fillColor: 'rgb(235, 253, 133)',
        });
        layer.openPopup();
      });
      layer.on('mouseout', () => {
        layer.closePopup();
        this.geojson.resetStyle(layer);
      });
    });

    this.mymap.fitBounds(this.geojson.getBounds());
  }
}
