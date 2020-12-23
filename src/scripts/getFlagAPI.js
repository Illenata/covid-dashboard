export default async function getFlagAPI() {
  const url = 'https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code';
  const response = await fetch(url);
  const data = await response.json();

  localStorage.setItem('countryPopulationFlag', JSON.stringify(data));
}
