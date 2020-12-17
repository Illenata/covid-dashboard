export default async function getPopulationAPI() {
  const url = 'https://restcountries-v1.p.rapidapi.com/all';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '9baf8e7bf7msh09f124bfdae5f8bp151f54jsn39d649d0f183',
      'x-rapidapi-host': 'restcountries-v1.p.rapidapi.com',
    },
  })
  // .then((response) => {
  //   console.log(response);
  // })
    .catch((err) => {
      console.error(err);
    });

  const data = await response.json();

  localStorage.setItem('countryPopulation', JSON.stringify(data));
  // console.log('API population');
}
