export const defaultType = 'bar'
export const defaultData = {
  datasets: [{
    label: 'Revenu',
    data: [4500, 2300, 1700, 2100, 1540, 1350, 3400, 2435, 3425, 4572, 1456, 4500],
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  }],
  labels: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ]
}
export const buildOptions = data => {
  const baseOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 0
        }
      }]
    }
  }
  const values = data.reduce((acc, curr) => [...acc, curr], [])
  const max = Math.max(...values)
  const normalizedMax = Math.ceil(max / 100) * 100
  baseOptions.scales.yAxes[0].ticks.max = normalizedMax
  return baseOptions
}
export const defaultOptions = buildOptions(defaultData.datasets)
