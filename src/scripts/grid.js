import img from '../assets/img/full.svg';

export default class Grid {
  constructor() {
    this.grid = null;
    this.section = null;
    this.list = 'list';
    this.table = 'table';
    this.graph = 'graph';
  }

  init() {
    this.grid = document.createElement('div');
    this.grid.classList.add('grid');
    document.body.prepend(this.grid);
    for (let i = 1; i <= 4; i += 1) {
      if (i === 1) {
        this.createSections('head');
        this.section.innerHTML = 'COVID-19 DASHBOARD';
      }
      if (i === 2) {
        this.createSections('left', `${this.list}`);
        this.addEvent('left');
      }
      if (i === 3) {
        this.createSections('center');
        this.addEvent('center');
      }
      if (i === 4) {
        this.createSections('right', `${this.table}`, `${this.graph}`);
        this.addEvent(`${this.graph}`);
      }
    }
  }

  addEvent(x) {
    this.section = document.querySelectorAll(`.${x}`);
    this.section.forEach((el) => {
      el.addEventListener('mouseover', () => {
        document.querySelector(`.${x}_`).classList.add('show');
      });
      el.addEventListener('mouseout', () => {
        document.querySelector(`.${x}_`).classList.remove('show');
      });
    });
  }

  createSections(name, firstElement, secondElement) {
    this.section = document.createElement('div');
    const first = document.createElement('div');
    const second = document.createElement('div');
    this.grid.append(this.section);
    this.section.classList.add(`${name}`);
    if (secondElement) {
      first.id = `${firstElement}`;
      second.id = `${secondElement}`;
      first.classList.add(`${firstElement}`);
      second.classList.add(`${secondElement}`);
      this.section.append(first, second);
      this.addBtns(`${secondElement}`);
    } else if (firstElement) {
      first.id = `${firstElement}`;
      first.classList.add(`${firstElement}`);
      this.section.append(first);
    }
    if (!secondElement) {
      this.addBtns(`${name}`);
    }
  }

  addBtns(x) {
    const btn = document.createElement('button');
    btn.classList.add('button', `${x}_`);
    btn.style.background = `no-repeat url(${img})`;
    document.querySelector(`.${x}`).append(btn);
    btn.addEventListener('click', () => {
      this.makeOnfullscreen(x);
    });
  }

  makeOnfullscreen(x) {
    this.section = document.querySelector(`.${x}`);
    this.section.classList.toggle(`${x}_full`);
  }
}
