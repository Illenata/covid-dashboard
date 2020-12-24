/* eslint-disable func-names */
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
          pointRadius: 1,
          showLine: true,
          label: '# Cases ',
          data: x,
          borderWidth: 3,
          backgroundColor: function () {
            return 'rgba(255, 0, 0, 0.3)';
          },
          fill: 1,
          borderColor: 'rgba(255, 0, 0, 0.3)',
        },
        {
          minBarLength: 2,
          pointRadius: 1,
          showLine: true,
          label: '# recovered ',
          data: a,
          borderWidth: 3,
          backgroundColor: function () {
            return 'rgba(0, 255, 0, 0.3)';
          },
          fill: 2,
          borderColor: 'rgba(0, 255, 0, 0.3)',
        },
        {
          minBarLength: 2,
          pointRadius: 1,
          label: '# deaths ',
          data: b,
          borderWidth: 3,
          backgroundColor: function () {
            return 'rgba(0, 0, 0, 1)';
          },
          fill: 'origin',
          borderColor: 'rgba(0, 0, 0, 1)',
        }],
      },
      options: {
        aspectRatio: 2,
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
