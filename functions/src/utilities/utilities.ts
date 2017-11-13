export const isHashed = (str: string) => {
  const matches = str.toString().match(/(.+?)(-)(.{20})/)
  return !!matches
}
export const toArray = (obj: Object) => {
  const items = []
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      items.push({ ...obj[k], $key: k })
    }
  }
  return items
}

export const normalizeSnapshots = (snapshot: any) => {
  const items = []
  snapshot
    .forEach(child => {
      const value = child.val()
      const $key = child.key
      items.push({ ...value, $key })
    })
  return items
}

export const defaultDatasetFactory = (labels, datasetsCount: number = 1) => {
  const dataset = () => ({
    data: [],
    label: 'label',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  })

  const datasets = Array
    .from(Array(datasetsCount).keys())
    .map(() => dataset())
    .map((_dataset, i) => {
      _dataset.label = labels[i]
      return _dataset
    })

  return {
    datasets,
    labels: []
  }
}

export const fromThisYear = (timestamp: number) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const actualYear = (new Date()).getFullYear()
  return year === actualYear
}
