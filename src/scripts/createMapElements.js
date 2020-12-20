export default class MapElements {
  constructor() {
    this.mapElem = null;
  }

  init() {
    const wrapper = this.createElement('div', 'map-wrapper', document.body);
    this.createElement('div', 'world-map', wrapper, 'mapid');
    const radioButtons = this.createElement('form', 'control-layers', wrapper);
    const groupValue = this.createElement('div', 'group-value', radioButtons);
    const groupTime = this.createElement('div', 'group-time', radioButtons);

    for (let i = 0; i < 4; i += 1) {
      if (i < 2) {
        const btn = this.createElement('div', 'btn', groupValue);

        if (i === 0) {
          const radioBtn = this.createElement('input', 'value-absolute', btn, null, 'radio', 'absolute', 'value');
          radioBtn.checked = true;

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'absolute';
          label.innerText = 'Abcolute value';
        } else {
          this.createElement('input', 'value-coefficient', btn, null, 'radio', 'coefficient', 'value');

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'coefficient';
          label.innerText = 'Per 100k population';
        }
      } else {
        const btn = this.createElement('div', 'btn', groupTime);

        if (i === 2) {
          const radioBtn = this.createElement('input', 'time-all', btn, null, 'radio', 'all-time', 'time');
          radioBtn.checked = true;

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'all-time';
          label.innerText = 'All time';
        } else {
          this.createElement('input', 'time-last-day', btn, null, 'radio', 'last-day', 'time');

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'last-day';
          label.innerText = 'Last day';
        }
      }
    }
  }

  createElement(type, className, parentElem, idName, typeName, valueName, nameName) {
    const elem = document.createElement(type);
    elem.classList.add(className);
    parentElem.append(elem);

    if (idName) {
      elem.id = idName;
      this.mapElem = elem;
    }

    if (typeName && valueName && nameName) {
      elem.type = typeName;
      elem.value = valueName;
      elem.name = nameName;
    }

    return elem;
  }
}
