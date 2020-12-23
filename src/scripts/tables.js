/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
import Search from './searchForList';

export default class Tables {
  constructor() {
    this.data = null;
    this.chosenCountry = null;
  }

  async init() {
    this.getData().then(() => {
      this.renderList();
      this.renderTable(0).then(() => {
        const searchForList = new Search();
        searchForList.init();
      });
    });
  }

  async getData() {
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

    function calculateGlobalPer100k(casesValue) {
      return Math.ceil(casesValue / (7594000000 / 100000));
    }

    this.data = await JSON.parse(covidResponse);
    this.data.Countries.forEach((item) => {
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
    });
    const info = this.data;
    info.Global.NewDeathsPer100k = calculateGlobalPer100k(info.Global.NewDeaths);
    info.Global.NewRecoveredPer100k = calculateGlobalPer100k(info.Global.NewRecovered);
    info.Global.NewConfirmedPer100k = calculateGlobalPer100k(info.Global.NewConfirmed);
    info.Global.TotalConfirmedPer100k = calculateGlobalPer100k(info.Global.TotalConfirmed);
    info.Global.TotalDeathsPer100k = calculateGlobalPer100k(info.Global.TotalDeaths);
    info.Global.TotalRecoveredPer100k = calculateGlobalPer100k(info.Global.TotalRecovered);
  }

  renderList() {
    const list = document.querySelector('.list');

    // Container with parameter selects and total numbers
    const selectBlock = document.createElement('div');
    selectBlock.classList.add('select-block');

    const select = document.createElement('select');
    select.classList.add('select');

    let totalNumber = document.createElement('div');
    totalNumber.classList.add('total-number');
    totalNumber.innerHTML = `
      <p class="color-cases">
        ${this.data.Global.TotalConfirmed}
      </p>
    `;

    const createOption = (val, inner) => {
      const option = document.createElement('option');
      option.value = val;
      option.innerText = inner;
      return option;
    };

    select.append(
      createOption('TotalConfirmed', 'Total Cases'),
      createOption('TotalDeaths', 'Total Deaths'),
      createOption('TotalRecovered', 'Total Recovered'),
      createOption('TotalConfirmedPer100k', 'Total Cases per 100k'),
      createOption('TotalDeathsPer100k', 'Total Deaths per 100k'),
      createOption('TotalRecoveredPer100k', 'Total Recovered per 100k'),
      createOption('NewConfirmed', 'Last Day Cases'),
      createOption('NewDeaths', 'Last Day Deaths'),
      createOption('NewRecovered', 'Last Day Recovered'),
      createOption('NewConfirmedPer100k', 'Last Day Cases per 100k'),
      createOption('NewDeathsPer100k', 'Last Day Deaths per 100k'),
      createOption('NewRecoveredPer100k', 'Last Day Recovered per 100k'),
    );

    // Container with cases/deaths/recovered numbers by country
    const casesByCountry = document.createElement('div');
    const casesByCountryHeader = document.createElement('div');

    casesByCountry.classList.add('cases-by-country');
    casesByCountryHeader.innerHTML = `
      <h1>Cases by country</h1>
    `;
    casesByCountryHeader.classList.add('cases-by-country__header');

    const casesByCountryList = document.createElement('div');
    casesByCountryList.classList.add('cases-by-country__list');

    // Container with date of last update in the API
    const updateDate = document.createElement('div');
    const date = new Date(this.data.Date).toString().slice(3, 24);
    updateDate.classList.add('update-date');
    updateDate.innerHTML = `
      <div>Last Updated</div>
      <div>${date}</div>
    `;

    const clearList = () => {
      const removingNode = document.querySelectorAll('.cases-by-country__item');
      removingNode.forEach((item) => {
        item.remove();
      });
    };

    const clearTable = () => {
      const table = document.querySelector('#table');
      table.replaceWith();
    };

    const defineColor = (str) => {
      if (str.toLowerCase().includes('confirmed')) { return 'color-cases'; }
      if (str.toLowerCase().includes('deaths')) { return 'color-deaths'; }
      if (str.toLowerCase().includes('recovered')) { return 'color-recovered'; }
      return '';
    };

    const changeList = (parameter) => {
      const dataSorted = this.data.Countries.sort((a, b) => b[parameter] - a[parameter]);
      dataSorted.forEach((item, index) => {
        const casesByCountryItem = document.createElement('div');
        casesByCountryItem.classList.add('cases-by-country__item');
        casesByCountryItem.innerHTML = `
          <span class="${defineColor(parameter)}">${item[parameter]}</span>
          <span>
            <img src="${item.Flag}" alt="${item.Country}">
          </span>
          <span>${item.Country}</span>
        `;
        casesByCountryItem.addEventListener('click', () => {
          this.chosenCountry = index;
          clearTable();
          this.renderTable(index);
        });
        casesByCountryList.append(casesByCountryItem);
      });

      casesByCountry.append(casesByCountryHeader, casesByCountryList);
    };

    select.addEventListener('change', (event) => {
      clearList();
      changeList(event.target.value);
      totalNumber = document.querySelector('.total-number');
      totalNumber.innerHTML = `
        <p class="${defineColor(event.target.value)}">
          ${this.data.Global[event.target.value]}
        </p>
      `;
      clearTable();
      this.renderTable(0);
    });

    selectBlock.append(select, totalNumber);

    // Fitting every element created above into the HTML
    list.append(selectBlock, casesByCountry, updateDate);
    changeList('TotalConfirmed');
  }

  async renderTable(index) {
    const container = document.querySelector('.table');
    const table = document.createElement('div');
    table.id = 'table';
    container.append(table);
    table.innerHTML = `
      <div class="country-name">
        <span>
          <img src="${this.data.Countries[index].Flag}" alt="${this.data.Countries[index].Country}">
        </span>
        <span>${this.data.Countries[index].Country}</span>
      </div>
      <table>
        <tr>
          <td></td>
          <td>Total</td>
          <td>per 100k</td>
        </tr>
        <tr>
          <td>Cases</td>
          <td class="color-cases bold">${this.data.Countries[index].TotalConfirmed}</td>
          <td class="color-cases bold">${this.data.Countries[index].TotalConfirmedPer100k}</td>
        </tr>
        <tr>
          <td>Deaths</td>
          <td class="color-deaths bold">${this.data.Countries[index].TotalDeaths}</td>
          <td class="color-deaths bold">${this.data.Countries[index].TotalDeathsPer100k}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td class="color-recovered bold">${this.data.Countries[index].TotalRecovered}</td>
          <td class="color-recovered bold">${this.data.Countries[index].TotalRecoveredPer100k}</td>
        </tr>
        <tr>
          <td></td>
          <td>Last day</td>
          <td>per 100k</td>
        </tr>
        <tr>
          <td>Cases</td>
          <td class="color-cases bold">${this.data.Countries[index].NewConfirmed}</td>
          <td class="color-cases bold">${this.data.Countries[index].NewConfirmedPer100k}</td>
        </tr>
        <tr>
          <td>Deaths</td>
          <td class="color-deaths bold">${this.data.Countries[index].NewDeaths}</td>
          <td class="color-deaths bold">${this.data.Countries[index].NewDeathsPer100k}</td>
        </tr>
        <tr>
          <td>Recovered</td>
          <td class="color-recovered bold">${this.data.Countries[index].NewRecovered}</td>
          <td class="color-recovered bold">${this.data.Countries[index].NewRecoveredPer100k}</td>
        </tr>
      </table>
    `;
  }
}
