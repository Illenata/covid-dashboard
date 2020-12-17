export default class Grid {
  constructor() {
    this.grid = null;
    this.section = null;
    this.global = 100000;
    this.map = 'Map';
    this.list = 'list';
    this.table = 'table';
    this.graph = 'graph';
  }

  init() {
    this.grid = document.createElement('div');
    this.grid.classList.add('grid');
    document.body.prepend(this.grid);
    for (let i = 1; i <= 4; i += 1) {
      if (i === 1) this.createSections('head');
      if (i === 2) this.createSections('left', `${this.list}`, `${this.global}`);
      if (i === 3) this.createSections('center', `${this.map}`);
      if (i === 4) this.createSections('right', `${this.table}`, `${this.graph}`);
      this.grid.append(this.section);
    }
  }

  createSections(section, firstElement, secondElement) {
    this.section = document.createElement('div');
    const first = document.createElement('div');
    const second = document.createElement('div');
    this.section.classList.add(`${section}`);
    if (secondElement) {
      first.innerHTML = `${firstElement}`;
      second.innerHTML = `${secondElement}`;
      first.classList.add(`${firstElement}`);
      second.classList.add(`${secondElement}`);
      this.section.append(first, second);
    } else if (firstElement) {
      this.section.append(firstElement);
    } else {
      this.section.innerHTML = 'COVID - 19 DASHBOARD';
    }
  }
}

// import map from
// import table from
// import list from
// import graph from
