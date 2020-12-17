export default async function getFlagAPI() {
  const url = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag';
  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem('countryPopulationFlag', JSON.stringify(data));
  // console.log('API population');
}
