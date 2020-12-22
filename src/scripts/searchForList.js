export default class Search {
  constructor() {
    this.list = document.querySelector('.list');
    this.content = document.querySelector('.cases-by-country');
  }

  init() {
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('input');
    input.placeholder = 'Search';
    this.list.prepend(input);
  }
}
