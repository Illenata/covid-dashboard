import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../node_modules/leaflet-toolbar/dist/leaflet.toolbar.css';
import CountriesCoord from './coordinates-countries.json';
import checkLocalStorageData from './checkLocalStorageData';

export default class WorldMap {
  constructor() {
    this.mymap = L.map('mapid').setView([40, 8], 2);
    this.covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
    this.unitForRadiusOfMarkerSize = 0;
    this.casesMarkersGroup = [];
    this.recoveredMarkersGroup = [];
    this.deathsMarkersGroup = [];
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
    this.getUnitForRadiusOfMarkerSize();
    this.createMarkers();
    this.createLegend();
    this.createNavLayers();
  }

  getUnitForRadiusOfMarkerSize() {
    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      const maxSize = 1500000;
      if (this.covidData.Countries[i].CountryCode === 'US') {
        this.unitForRadiusOfMarkerSize = maxSize / this.covidData.Countries[i].TotalConfirmed;
        break;
      }
    }
  }

  createMarkers() {
    for (let i = 0; i < this.covidData.Countries.length; i += 1) {
      for (let j = 0; j < CountriesCoord.length; j += 1) {
        if (this.covidData.Countries[i].CountryCode === CountriesCoord[j].CountryCode) {
          const addMarkers = (colorCircle, type, arrayCircles, name) => {
            const circle = L.circle([CountriesCoord[j].Lat, CountriesCoord[j].Lon], {
              color: colorCircle,
              fillColor: colorCircle,
              fillOpacity: 0.5,
              radius: type * this.unitForRadiusOfMarkerSize,
            });
            circle.addTo(this.mymap);
            circle.bindTooltip(`<b>${this.covidData.Countries[i].Country}</b>
              <br>${name}: ${type}`);
            arrayCircles.push(circle);
          };

          addMarkers('red', this.covidData.Countries[i].TotalConfirmed, this.casesMarkersGroup, 'Cases');
          addMarkers('green', this.covidData.Countries[i].TotalRecovered, this.recoveredMarkersGroup, 'Recovered');
          addMarkers('black', this.covidData.Countries[i].TotalDeaths, this.deathsMarkersGroup, 'Deaths');
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
    recoveredLayer.addTo(this.mymap);
    deathsLayer.addTo(this.mymap);

    const overlayMaps = {
      Cases: casesLayer,
      Recovered: recoveredLayer,
      Deaths: deathsLayer,
    };

    L.control.layers(null, overlayMaps).addTo(this.mymap);
  }
}
