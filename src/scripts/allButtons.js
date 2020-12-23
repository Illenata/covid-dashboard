// document.addEventListener('DOMContentLoaded', () => {
//   const select = document.querySelector('.select');
//   const absoluteElem = document.querySelector('.value-absolute');
//   const coefElem = document.querySelector('.value-coefficient');
//   const allTimeElem = document.querySelector('.time-all');
//   const lastDayElem = document.querySelector('.time-last-day');
//   const casesElem = document.querySelector('.cases');
//   const recoveredElem = document.querySelector('.recovered');
//   const deathsElem = document.querySelector('.deaths');

//   select.addEventListener('change', () => {
//     console.log(select.value);
//     switch (select.value) {
//       case 'TotalConfirmed':
//         casesElem.checked = true;
//         absoluteElem.checked = true;
//         allTimeElem.checked = true;
//         break;
//       case 'TotalDeaths':
//         deathsElem.checked = true;
//         absoluteElem.checked = true;
//         allTimeElem.checked = true;
//         break;
//       case 'TotalRecovered':
//         recoveredElem.checked = true;
//         absoluteElem.checked = true;
//         allTimeElem.checked = true;
//         break;
//       case 'TotalConfirmedPer100k':
//         casesElem.checked = true;
//         coefElem.checked = true;
//         allTimeElem.checked = true;
//         break;
//       case 'TotalDeathsPer100k':
//         deathsElem.checked = true;
//         coefElem.checked = true;
//         allTimeElem.checked = true;
//         break;
//       case 'TotalRecoveredPer100k':
//         recoveredElem.checked = true;
//         coefElem.checked = true;
//         allTimeElem.checked = true;
//         break;
//       case 'NewConfirmed':
//         casesElem.checked = true;
//         absoluteElem.checked = true;
//         lastDayElem.checked = true;
//         break;
//       case 'NewDeaths':
//         deathsElem.checked = true;
//         absoluteElem.checked = true;
//         lastDayElem.checked = true;
//         break;
//       case 'NewRecovered':
//         recoveredElem.checked = true;
//         absoluteElem.checked = true;
//         lastDayElem.checked = true;
//         break;
//       case 'NewConfirmedPer100k':
//         casesElem.checked = true;
//         coefElem.checked = true;
//         lastDayElem.checked = true;
//         break;
//       case 'NewDeathsPer100k':
//         deathsElem.checked = true;
//         coefElem.checked = true;
//         lastDayElem.checked = true;
//         break;
//       case 'NewRecoveredPer100k':
//         recoveredElem.checked = true;
//         coefElem.checked = true;
//         lastDayElem.checked = true;
//         break;
//       default:
//         casesElem.checked = true;
//         absoluteElem.checked = true;
//         allTimeElem.checked = true;
//     }
//   });
// });

export default class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(f) {
    this.observers.push(f);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}
