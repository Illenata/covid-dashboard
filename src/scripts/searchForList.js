export default class Search {
  constructor() {
    this.list = document.querySelector('.list');
  }

  init() {
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('input-search');
    input.placeholder = 'Search';
    this.list.prepend(input);

    input.oninput = function () {
      const content = document.querySelectorAll('.cases-by-country__item');
      const value = this.value.trim().toLowerCase();

      if (value) {
        content.forEach((elem) => {
          if (elem.innerText.toLowerCase().search(value) === -1) {
            elem.classList.add('hide');
          }
        });
      } else {
        content.forEach((elem) => {
          elem.classList.remove('hide');
        });
      }
    };
  }

  // startSearch() {
  //   const
  //   document.querySelector('.input-search')
  // }
}
