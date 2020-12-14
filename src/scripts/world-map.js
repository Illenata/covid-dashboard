// import Counties from './countries.json';

const mymap = L.map('mapid').setView([40, 8], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiaWxsZW5hdGEiLCJhIjoiY2tpbHlheTNvMG1kejJzbGJ3d2MwZnJvdiJ9.VwLkkDFOzY09RruFl0u9dQ',
}).addTo(mymap);

async function getCounties() {
  const url = 'https://api.covid19api.com/summary';
  const response = await fetch(url, {
    // mode: 'no-cors',
  });
  const data = await response.json();
  // console.log(data.Countries);
  const covidData = data.Countries;

  localStorage.setItem('covidDataStorage', JSON.stringify(covidData));
  console.log('дергаю API');
}

// console.log(`covid data
// = ${JSON.parse(localStorage.getItem('covidDataStorage'))[0].TotalConfirmed}`);

function getCovidData() {
  let covidData = '';
  if (localStorage.getItem('covidDataStorage') !== null) {
    console.log('данные в сторейдж есть');
    covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
  } else {
    console.log('упс, данных нема, придется дергать API');
    getCounties();
    covidData = JSON.parse(localStorage.getItem('covidDataStorage'));
  }
  console.log(`локалсторейдж данные ковид ${covidData}`);
}

function checkDay() {
  const fullDate = new Date();
  const currentDay = fullDate.toLocaleDateString();
  const someDay = localStorage.getItem('dayStorage');
  console.log(currentDay, someDay);

  if (someDay === null || someDay !== currentDay) {
    localStorage.setItem('dayStorage', currentDay);
    console.log('update');
    getCovidData();
  } else if (someDay === currentDay) {
    console.log('current date');
    getCovidData();
  }
}

// console.log(Counties);
checkDay();
