export default async function getCovidDataFromAPI() {
  const url = 'https://api.covid19api.com/summary';
  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem('covidDataStorage', JSON.stringify(data));
  // console.log('дергаю API');
}
