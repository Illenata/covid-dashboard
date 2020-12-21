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
    const groupType = this.createElement('div', 'group-type', wrapper);

    for (let i = 0; i < 7; i += 1) {
      if (i < 2) {
        const btn = this.createElement('div', 'btn', groupValue);

        if (i === 0) {
          const radioBtn = this.createElement('input', 'value-absolute', btn, 'absolute-id', 'radio', 'absolute', 'value');
          radioBtn.checked = true;

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'absolute-id';
          label.innerText = 'Abcolute value';
        } else {
          this.createElement('input', 'value-coefficient', btn, 'coefficient-id', 'radio', 'coefficient', 'value');

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'coefficient-id';
          label.innerText = 'Per 100k population';
        }
      } else if (i < 4) {
        const btn = this.createElement('div', 'btn', groupTime);

        if (i === 2) {
          const radioBtn = this.createElement('input', 'time-all', btn, 'all-time-id', 'radio', 'all-time', 'time');
          radioBtn.checked = true;

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'all-time-id';
          label.innerText = 'All time';
        } else {
          this.createElement('input', 'time-last-day', btn, 'last-day-id', 'radio', 'last-day', 'time');

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'last-day-id';
          label.innerText = 'Last day';
        }
      } else {
        const btn = this.createElement('div', 'btn', groupType);

        if (i === 4) {
          const radioBtn = this.createElement('input', 'cases', btn, 'cases-id', 'radio', 'cases', 'type');
          radioBtn.checked = true;

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'cases-id';
          label.innerText = 'Cases';
        } else if (i === 5) {
          this.createElement('input', 'recovered', btn, 'recovered-id', 'radio', 'recovered', 'type');

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'recovered-id';
          label.innerText = 'Recovered';
        } else {
          this.createElement('input', 'deaths', btn, 'deaths-id', 'radio', 'deaths', 'type');

          const label = this.createElement('label', null, btn);
          label.htmlFor = 'deaths-id';
          label.innerText = 'Deaths';
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
