export default class Tables {
  constructor() {
    this.data = null;
  }

  async init() {
    this.fetchDataFromAPI().then(() => {
      // console.log(this.data);
      this.renderList();
    });
  }

  async fetchDataFromAPI() {
    console.log('Fetch data from API started');
    const response = await fetch('https://api.covid19api.com/summary');
    const fetchedData = await response.json();
    const fetchedDataToString = await JSON.stringify(fetchedData);
    this.data = await JSON.parse(fetchedDataToString);
  }

  renderList() {
    const list = document.querySelector('#list');

    // Container with parameter selects and total numbers
    const selectBlock = document.createElement('div');
    selectBlock.classList.add('select-block');

    const select = document.createElement('select');
    select.classList.add('select');

    const totalNumber = document.createElement('p');
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

    select.addEventListener('change', (event) => {
      clearList();
      changeList(event.target.value);
      const totalNumber = document.querySelector('.total-number');
      totalNumber.innerText = this.data.Global[event.target.value];
      totalNumber.style = '';
    });

    selectBlock.append(select, totalNumber);

    // Container with cases/deaths/recovered numbers by country
    const casesByCountry = document.createElement('div');
    casesByCountry.innerHTML = `
      <h1>Cases by country</h1>
    `;
    casesByCountry.classList.add('cases-by-country');

    const casesByCountryList = document.createElement('div');
    casesByCountryList.classList.add('cases-by-country__list');

    const clearList = () => {
      const removingNode = document.querySelectorAll('.cases-by-country__item');
      removingNode.forEach((item) => {
        item.remove();
      });
    };

    const changeList = (parameter) => {
      const dataSorted = this.data.Countries.sort((a, b) => b[parameter] - a[parameter]);
      for (const item of dataSorted) {
        const casesByCountryItem = document.createElement('div');
        casesByCountryItem.classList.add('cases-by-country__item');
        casesByCountryItem.innerHTML = `
          <span>${item[parameter]}</span>
          <span>${item.Country}</span>
        `;
        casesByCountryItem.addEventListener('click', () => {
          console.log('clicked!', item[parameter], item.Country);
        });
        casesByCountryList.append(casesByCountryItem);
      }

      casesByCountry.append(casesByCountryList);
    };

    // Container with date of last update in the API
    const updateDate = document.createElement('div');
    const date = new Date(this.data.Date).toString().slice(3, 24);
    updateDate.classList.add('update-date');
    updateDate.innerHTML = `
      <div>Last Updated</div>
      <div>${date}</div>
    `;

    // Fitting every element created above into the HTML
    list.append(selectBlock, casesByCountry, updateDate);
    changeList('TotalConfirmed');
  }
}
