export default class Search {
  constructor() {
    this.appendingPlace = null;
  }

  async init() {
    this.appendingPlace = await document.querySelector('.cases-by-country__header');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search';
    this.appendingPlace.append(input);

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
}
