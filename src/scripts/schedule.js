/* eslint-disable no-nested-ternary */
/* eslint-disable object-shorthand */
import Chart from 'chart.js';

export default class Shedule {
  constructor(x, y, a, b) {
    this.sheduleConfig = {
      type: 'line',
      data: {
        labels: y,
        datasets: [{
          minBarLength: 2,
          pointRadius: 3,
          label: '# Cases ',
          data: x,
          borderWidth: 1,
          backgroundColor: function () {
            return 'red';
          },
          fill: false,
        },
        {
          minBarLength: 2,
          pointRadius: 3,
          label: '# reserved ',
          data: a,
          borderWidth: 1,
          backgroundColor: function () {
            return 'green';
          },
          fill: false,

        },
        {
          minBarLength: 2,
          pointRadius: 3,
          label: '# deaths ',
          data: b,
          borderWidth: 1,
          backgroundColor: function () {
            return 'black';
          },
          fill: false,
        }],
      },
      options: {
        aspectRatio: 2.35,
        tooltips: {
          bodyFontSize: 12,
        },
        scales: {
          xAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Date',
              fontSize: 15,
            },
          }],
          yAxes: [{
            gridLines: {
              lineWidth: 1,
              tickMarkLength: 1,
            },
            scaleLabel: {
              display: true,
              labelString: 'counts',
              fontSize: 15,
            },
            type: 'linear',
            ticks: {
              max: 80000000,
              maxTicksLimit: 10,
              fontSize: 12,
              beginAtZero: true,
            },
          }],
        },
      },
    };
    this.pic = document.createElement('canvas');
  }

  init() {
    const area = document.querySelector('.graph');
    area.append(this.pic);
    // eslint-disable-next-line no-unused-vars
    const a = new Chart(this.pic, this.sheduleConfig);
    a.update();
  }
}
