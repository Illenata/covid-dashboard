/* eslint-disable no-nested-ternary */
/* eslint-disable object-shorthand */
import Chart from 'chart.js';

export default class Shedule {
  constructor(x, y) {
    this.sheduleConfig = {
      type: 'bar',
      data: {
        labels: y,
        datasets: [{
          minBarLength: 2,
          pointRadius: 10,
          label: '# Cases ',
          data: x,
          borderWidth: 3,
          backgroundColor: function () {
            return 'red';
          },
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
              labelString: 'Cases',
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
