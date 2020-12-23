export default async function clickMapToTable(countryCode) {
  const covidResponse = await localStorage.getItem('covidDataStorage');
  const populationResponse = await localStorage.getItem('countryPopulation');
  const flagResponse = await localStorage.getItem('countryPopulationFlag');

  const flagObj = {};
  await JSON.parse(flagResponse).forEach((item) => {
    flagObj[item.alpha2Code] = item.flag;
  });

  const populationObj = {};
  await JSON.parse(populationResponse).forEach((item) => {
    populationObj[item.alpha2Code] = item.population;
  });

  function calculatePer100k(population, casesValue) {
    return Math.ceil(casesValue / (population / 100000));
  }

  const data = await JSON.parse(covidResponse);
  const dataPrepared = {};
  data.Countries.forEach((item) => {
    /* eslint-disable no-param-reassign */
    const population = populationObj[item.CountryCode];
    item.Population = population;
    item.NewConfirmedPer100k = calculatePer100k(population, item.NewConfirmed);
    item.NewDeathsPer100k = calculatePer100k(population, item.NewDeaths);
    item.NewRecoveredPer100k = calculatePer100k(population, item.NewRecovered);
    item.TotalConfirmedPer100k = calculatePer100k(population, item.TotalConfirmed);
    item.TotalDeathsPer100k = calculatePer100k(population, item.TotalDeaths);
    item.TotalRecoveredPer100k = calculatePer100k(population, item.TotalRecovered);
    item.Flag = flagObj[item.CountryCode];

    dataPrepared[item.CountryCode] = item;
  });

  const clearTable = () => {
    const table = document.querySelector('#table');
    table.innerHTML = '';
  };

  const renderTable = (index) => {
    const table = document.querySelector('#table');
    table.innerHTML = `
      <div class="country-name">
        <span>
          <img src="${dataPrepared[index].Flag}" alt="${dataPrepared[index].Country}">
        </span>
        <span>${dataPrepared[index].Country}</span>
      </div>
      <table>
        <tr>
          <td></td>
          <td>Total</td>
          <td>per 100k</td>
        </tr>
        <tr>
          <td>Cases</td>
          <td class="color-cases bold">${dataPrepared[index].TotalConfirmed}</td>
          <td class="color-cases bold">${dataPrepared[index].TotalConfirmedPer100k}</td>
        </tr>
        <tr>
          <td>Deaths</td>
          <td class="color-deaths bold">${dataPrepared[index].TotalDeaths}</td>
          <td class="color-deaths bold">${dataPrepared[index].TotalDeathsPer100k}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td class="color-recovered bold">${dataPrepared[index].TotalRecovered}</td>
          <td class="color-recovered bold">${dataPrepared[index].TotalRecoveredPer100k}</td>
        </tr>
        <tr>
          <td></td>
          <td>Last day</td>
          <td>per 100k</td>
        </tr>
        <tr>
          <td>Cases</td>
          <td class="color-cases bold">${dataPrepared[index].NewConfirmed}</td>
          <td class="color-cases bold">${dataPrepared[index].NewConfirmedPer100k}</td>
        </tr>
        <tr>
          <td>Deaths</td>
          <td class="color-deaths bold">${dataPrepared[index].NewDeaths}</td>
          <td class="color-deaths bold">${dataPrepared[index].NewDeathsPer100k}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td class="color-recovered bold">${dataPrepared[index].NewRecovered}</td>
          <td class="color-recovered bold">${dataPrepared[index].NewRecoveredPer100k}</td>
        </tr>
      </table>
    `;
  };

  clearTable();
  renderTable(countryCode);
}
