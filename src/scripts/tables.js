/* eslint-disable no-restricted-syntax */
export default class Tables {
  constructor() {
    this.data = null;
    this.chosenCountry = null;
  }

  async init() {
    this.fetchDataFromAPI().then(() => {
      // console.log(this.data);
      this.renderList();
      this.renderTable(0);
    });
  }

  async fetchDataFromAPI() {
    console.log('Fetch data from API started');
    const response = await fetch('https://api.covid19api.com/summary');
    const fetchedData = await response.json();
    const fetchedDataToString = await JSON.stringify(fetchedData);
    this.data = await JSON.parse(fetchedDataToString);
    console.log(this.data);
  }

  renderList() {
    const list = document.querySelector('.list');

    // Container with parameter selects and total numbers
    const selectBlock = document.createElement('div');
    selectBlock.classList.add('select-block');

    const select = document.createElement('select');
    select.classList.add('select');

    let totalNumber = document.createElement('p');
    totalNumber.classList.add('total-number');
    totalNumber.innerText = this.data.Global.TotalConfirmed;

    const createOption = (val, inner) => {
      const option = document.createElement('option');
      option.value = val;
      option.innerText = inner;
      return option;
    };

    select.append(
      createOption('TotalConfirmed', 'Total Confirmed'),
      createOption('TotalDeaths', 'Total Deaths'),
      createOption('TotalRecovered', 'Total Recovered'),
      createOption('NewConfirmed', 'New Confirmed'),
      createOption('NewDeaths', 'New Deaths'),
      createOption('NewRecovered', 'New Recovered'),
    );

    // Container with cases/deaths/recovered numbers by country
    const casesByCountry = document.createElement('div');
    casesByCountry.innerHTML = `
      <h1>Cases by country</h1>
    `;
    casesByCountry.classList.add('cases-by-country');

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

    const changeList = (parameter) => {
      // ПЕРИОДИЧЕСКИ БАГАЕТСЯ
      const dataSorted = this.data.Countries.sort((a, b) => b[parameter] - a[parameter]);
      dataSorted.forEach((item, index) => {
        const casesByCountryItem = document.createElement('div');
        casesByCountryItem.classList.add('cases-by-country__item');
        casesByCountryItem.innerHTML = `
          <span>${item[parameter]}</span>
          <span>${item.Country}</span>
        `;
        casesByCountryItem.addEventListener('click', (event) => {
          console.log('clicked!', item[parameter], item.Country);
          this.chosenCountry = index;
          console.log(this.chosenCountry);
          this.clearTable();
          this.renderTable(index);
        });
        casesByCountryList.append(casesByCountryItem);
      });

      casesByCountry.append(casesByCountryList);
    };

    select.addEventListener('change', (event) => {
      clearList();
      changeList(event.target.value);
      totalNumber = document.querySelector('.total-number');
      totalNumber.innerText = this.data.Global[event.target.value];
      this.clearTable();
      this.renderTable(0);
    });

    selectBlock.append(select, totalNumber);

    // Fitting every element created above into the HTML
    list.append(selectBlock, casesByCountry, updateDate);
    changeList('TotalConfirmed');
  }

  renderTable(index) {
    const table = document.querySelector('#table');
    // const inner = document.createElement('div');
    table.innerHTML = `
      <div class="country-name">${this.data.Countries[index].Country}</div>
      <table>
        <tr>
          <td>TotalConfirmed</td>
          <td class="td-confirmed">${this.data.Countries[index].TotalConfirmed}</td>
        </tr>
        <tr>
          <td>TotalDeaths</td>
          <td class="td-deaths">${this.data.Countries[index].TotalDeaths}</td>
        </tr>
        <tr>
          <td>TotalRecovered</td>
          <td class="td-recovered">${this.data.Countries[index].TotalRecovered}</td>
        </tr>
        <tr>
          <td>NewConfirmed</td>
          <td class="td-confirmed">${this.data.Countries[index].NewConfirmed}</td>
        </tr>
        <tr>
          <td>NewDeaths</td>
          <td class="td-deaths">${this.data.Countries[index].NewDeaths}</td>
        </tr>
        <tr>
          <td>NewRecovered</td>
          <td class="td-recovered">${this.data.Countries[index].NewRecovered}</td>
        </tr>
      </table>
    `;
    // table.append(div);
  }

  clearTable() {
    const table = document.querySelector('#table');
    table.innerHTML = ``;
  }
}
