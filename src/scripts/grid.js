export default class Grid {
  constructor(map) {
    this.map = map;
    this.grid = null;
    this.section = null;
  }

  init() {
    this.grid = document.createElement('div');
    this.grid.classlist.add('grid');
    document.body.append(this.grid);
    for (let i = 1; i <= 4; i += 1) {
      if (i === 1) this.createSections('map');
      if (i === 1) this.createSections('table');
      if (i === 1) this.createSections('list');
      if (i === 1) this.createSections('graph');
    }
  }

  createSections(x) {
    this.section = document.createElement('div');
    this.section.classList.add(`${x}`);
  }
}
