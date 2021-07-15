const sizeOf = require('image-size')
const path = require('path')

/**
* * @param {Array} array
* * @param {string} propertyPath
 */
module.exports = function groupByYear(collection, propertyPath) {
  const t = Object.values(collection.reduce((accumulator, current) => {
    const year = new Date(stringToProperty(current, propertyPath)).getFullYear()
    accumulator[year] = { year, items: [...accumulator[year]?.items || [], current]}
    return accumulator;
  }, {}))
  .sort((a, b) => b.year - a.year)
  .map(e => {
    return {
      ...e,
      items: e.items.sort((a,b) => new Date(stringToProperty(b, propertyPath)) - new Date(stringToProperty(a, propertyPath)))
    }
  })
  return t;
}


function stringToProperty(object, property) {
  return property.split(".").reduce(function(o, x) { return o[x] }, object);
}
