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
