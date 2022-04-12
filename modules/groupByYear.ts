/**
 * * @param {Array} array
 * * @param {string} propertyPath
 */
function groupByYear(collection, propertyPath: string) {
  const t = Object.values<T>(
    collection.reduce((accumulator, current) => {
      const year = new Date(stringToProperty(current, propertyPath)).getFullYear()
      accumulator[year] = { year, items: [...(accumulator[year]?.items || []), current] }
      return accumulator
    }, {})
  )
    .sort((a, b) => b.year - a.year)
    .map((e) => {
      return {
        ...e, // @ts-expect-error
        items: e.items.sort((a, b) => new Date(stringToProperty(b, propertyPath)) - new Date(stringToProperty(a, propertyPath))),
      }
    })
  return t
}

function stringToProperty(object, property: string): string {
  return property.split('.').reduce(function (o, x) {
    return o[x]
  }, object)
}

export default groupByYear

interface T {
  year: number
  items: Array<unknown>
}