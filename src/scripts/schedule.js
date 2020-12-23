import Chart from 'chart.js';

export default class Shedule {
  constructor(x, y) {
    this.sheduleConfig = {
      type: 'bar',
      data: {
        labels: y,
        datasets: [{
          minBarLength: 10,
          pointRadius: 10,
          label: '# Cases ',
          data: x,
          backgroundColor: [
            'rgba(200, 0, 0, 1)',
          ],
          borderColor: [
            'rgba(0, 255, 100, 1)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        tooltips: {
          bodyFontSize: 12,
        },
        scales: {
          xAxes: [{
            ticks: {
              min: 'Май',
              maxTicksLimit: 6,
              stepSize: 30,
              fontSize: 10,
            },
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
              fontSize: 10,
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
