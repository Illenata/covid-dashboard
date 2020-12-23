export default {
  data() {
    return {
      arrPositive: [],
      positiveChartColors: {
        borderColor: '#077187',
        pointBorderColor: '#0E1428',
        pointBackgroundColor: '#AFD6AC',
        backgroundColor: '#74A57F',
      },
      arrHospitalized: [],
      hospitalizedChartColors: {
        borderColor: '#251F47',
        pointBorderColor: '#260F26',
        pointBackgroundColor: '#858EAB',
        backgroundColor: '#858EAB',
      },
      arrInIcu: [],
      inIcuColors: {
        borderColor: '#190B28',
        pointBorderColor: '#190B28',
        pointBackgroundColor: '#E55381',
        backgroundColor: '#E55381',
      },
      arrOnVentilators: [],
      onVentilatorsColors: {
        borderColor: '#784F41',
        pointBorderColor: '#784F41',
        pointBackgroundColor: '#BBE5ED',
        backgroundColor: '#BBE5ED',
      },
      arrRecovered: [],
      recoveredColors: {
        borderColor: '#4E5E66',
        pointBorderColor: '#4E5E66',
        pointBackgroundColor: '#31E981',
        backgroundColor: '#31E981',
      },
      arrDeaths: [],
      deathColors: {
        borderColor: '#E06D06',
        pointBorderColor: '#E06D06',
        pointBackgroundColor: '#402A2C',
        backgroundColor: '#402A2C',
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
