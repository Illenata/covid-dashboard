// export default class createMarkers {
//   constructor() {
//     this.covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
//     this.populationCoordsData = JSON.parse(localStorage.getItem('countryPopulation'));

//     this.country = [];

//     this.unitMarkerSize = 0;

//     this.casesMarkersGroup = [];
//     this.recoveredMarkersGroup = [];
//     this.deathsMarkersGroup = [];

//     this.absoluteElem = document.querySelector('.value-absolute');
//     this.coefElem = document.querySelector('.value-coefficient');
//     this.allTimeElem = document.querySelector('.time-all');
//     this.lastDayElem = document.querySelector('.time-last-day');
//   }
//   // console.log(countryBorder.features[2]);

//   getUnitForRadiusOfMarkerSize() {
//     const maxSize = 50;
//     const totalCasesArr = [];

//     for (let i = 0; i < this.covidData.Countries.length; i += 1) {
//       totalCasesArr.push(this.covidData.Countries[i].TotalConfirmed);
//     }

//     const maxNum = (arr) => arr.reduce((a, b) => (a > b ? a : b));

//     this.unitMarkerSize = maxSize / maxNum(totalCasesArr);
//   }

//   addMarkers(colorCircle, type, arrayCircles, name, i, j) {
//     const minSize = 3;
//     const circle = L.circleMarker([this.populationCoordsData[j].latlng[0],
//       this.populationCoordsData[j].latlng[1]], {
//       color: colorCircle,
//       fillColor: colorCircle,
//       fillOpacity: 0.5,
//       radius: minSize + (type * this.unitMarkerSize),
//     });
//     circle.bindPopup(`<b>${this.covidData.Countries[i].Country}</b>
//       <br>${name}: ${type}`);

//     circle.on('mouseover', () => {
//       circle.openPopup();
//     });
//     circle.on('mouseout', () => {
//       circle.closePopup();
//     });

//     arrayCircles.push(circle);
//   }

//   createMarkers() {
//     for (let i = 0; i < this.covidData.Countries.length; i += 1) {
//       for (let j = 0; j < this.populationCoordsData.length; j += 1) {
//         for (let k = 0; k < this.country[k].length; k += 1) {
//           // this.geojson.eachLayer((layer) => {
//           if (this.covidData.Countries[i].CountryCode === this.populationCoordsData[j].alpha2Code
//             && this.covidData.Countries[i].CountryCode === this.country[k].feature.properties.wb_a2) {
//             // this.addMarkers('red', this.covidData.Countries[i].TotalConfirmed, this.casesMarkersGroup, 'Cases', i, j);
//             // this.addMarkers('green', this.covidData.Countries[i].TotalRecovered, this.recoveredMarkersGroup, 'Recovered', i, j);
//             // this.addMarkers('black', this.covidData.Countries[i].TotalDeaths, this.deathsMarkersGroup, 'Deaths', i, j);
  
//             const people = this.populationCoordsData[j].population;
//             const controlElem = document.querySelector('.control-layers');
  
//             const country = this.covidData.Countries[i].Country;
//             const totalCases = this.covidData.Countries[i].TotalConfirmed;
//             const dailyCases = this.covidData.Countries[i].NewConfirmed;
//             const totalRecovered = this.covidData.Countries[i].TotalRecovered;
//             const dailyRecovered = this.covidData.Countries[i].NewRecovered;
//             const totalDeaths = this.covidData.Countries[i].TotalDeaths;
//             const dailyDeaths = this.covidData.Countries[i].NewDeaths;
  
//             const minSize = 3;
//             const calculateRer100k = (data) => Math.round((data / people) * 100000);
//             const calcRadius = (data) => minSize + (data * this.unitMarkerSize);
  
//             controlElem.addEventListener('click', () => {
//               if (this.absoluteElem.checked && this.allTimeElem.checked) {
//                 this.casesMarkersGroup[i].setRadius(calcRadius(totalCases));
  
//                 this.casesMarkersGroup[i].setPopupContent(`<b>${country}</b>
//                   <br>Cases: ${totalCases}`);
//                 // layer.setPopupContent(`<b>${country}</b>
//                 //   <br>Cases: ${totalCases}`);
  
//                 this.recoveredMarkersGroup[i].setRadius(calcRadius(totalRecovered));
  
//                 this.recoveredMarkersGroup[i].setPopupContent(`<b>${country}</b>
//                   <br>Recovered: ${totalRecovered}`);
  
//                 this.deathsMarkersGroup[i].setRadius(calcRadius(totalDeaths));
  
//                 this.deathsMarkersGroup[i].setPopupContent(`<b>${country}</b>
//                       <br>Deaths: ${totalDeaths}`);
//               } else if (this.absoluteElem.checked && this.lastDayElem.checked) {
//                 this.casesMarkersGroup[i].setRadius(calcRadius(dailyCases));
  
//                 this.casesMarkersGroup[i].setPopupContent(`<b>${country}</b>
//                   <br>Daily cases: ${dailyCases}`);
  
//                 this.recoveredMarkersGroup[i].setRadius(calcRadius(dailyRecovered));
  
//                 this.recoveredMarkersGroup[i].setPopupContent(`<b>${country}</b>
//                   <br>Daily recovered: ${dailyRecovered}`);
  
//                 this.deathsMarkersGroup[i].setRadius(calcRadius(dailyDeaths));
  
//                 this.deathsMarkersGroup[i].setPopupContent(`<b>${country}</b>
//                   <br>Daily deaths: ${dailyDeaths}`);
//               } else if (this.coefElem.checked && this.allTimeElem.checked) {
//                 this.casesMarkersGroup[i].setRadius(calcRadius(calculateRer100k(totalCases)));
  
//                 this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
//                   <br>Cases per 100k: ${calculateRer100k(totalCases)}`);
  
//                 this.recoveredMarkersGroup[i].setRadius(minSize
//                   + ((this.covidData.Countries[i].TotalRecovered / people) * 100000)
//                   * this.unitMarkerSize);
  
//                 this.recoveredMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
//                   <br>Recovered per 100k: ${(this.covidData.Countries[i].TotalRecovered / people) * 100000}`);
  
//                 this.deathsMarkersGroup[i].setRadius(minSize
//                   + ((this.covidData.Countries[i].TotalDeaths / people) * 100000)
//                   * this.unitMarkerSize);
  
//                 this.deathsMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
//                   <br>Deaths per 100k: ${(this.covidData.Countries[i].TotalDeaths / people) * 100000}`);
//               } else {
//                 this.casesMarkersGroup[i].setRadius(minSize
//                   + ((this.covidData.Countries[i].NewConfirmed / people) * 100000)
//                   * this.unitMarkerSize);
  
//                 this.casesMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
//                   <br>Daily cases per 100k: ${(this.covidData.Countries[i].NewConfirmed / people) * 100000}`);
  
//                 this.recoveredMarkersGroup[i].setRadius(minSize
//                   + ((this.covidData.Countries[i].NewRecovered / people) * 100000)
//                   * this.unitMarkerSize);
  
//                 this.recoveredMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
//                   <br>Daily recovered per 100k: ${(this.covidData.Countries[i].NewRecovered / people) * 100000}`);
  
//                 this.deathsMarkersGroup[i].setRadius(minSize
//                   + ((this.covidData.Countries[i].NewDeaths / people) * 100000)
//                   * this.unitMarkerSize);
  
//                 this.deathsMarkersGroup[i].setPopupContent(`<b>${this.covidData.Countries[i].Country}</b>
//                   <br>Daily death per 100k: ${(this.covidData.Countries[i].NewDeaths / people) * 100000}`);
//               }
//             });
//           }
//         }
//       }
//     }  
//   }
// }
