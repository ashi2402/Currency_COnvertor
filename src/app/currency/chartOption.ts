export const options = {
  chart: {
    backgroundColor: '#efefef',
    type: 'line'
},
  renderto: 'container',
    title: {
      text: 'Currency Compare for last 8 days from selected Date'
    },

    subtitle: {
      text: ''
    },

    yAxis: {
      title: {
        text: 'Currency Value'
      }
    },

    xAxis: {
      accessibility: {
        rangeDescription: ''
      },
      title: {
        text: 'Dates(Default)'
      }
    },

    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },

      }
    },

    series: [{
      name: 'USD Vs EUR',
      data: [0.89883, 0.89385, 0.890099, 0.882101, 0.885665, 0.885622, 0.883455]
    }],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          }
        }
      }]
    }
  };

