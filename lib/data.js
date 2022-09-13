// normtextures <https://github.com/msikma/normtextures>
// © MIT license

const path = require('path')
const fs = require('fs').promises
const sortBy = require('lodash.sortby')
const fg = require('fast-glob')

/**
 * Returns the texture data file for a map.
 */
const getMapData = async (textureBase, mapExport) => {
  const json = path.join(textureBase, mapExport, `${mapExport}.json`)
  const data = JSON.parse(await fs.readFile(json, 'utf8'))
  return {name: mapExport, ...data}
}

/**
 * Returns an object with data on all flags.
 */
const getFlagStats = (allMapsData, flagDescriptions) => {
  const flagTypes = Object.fromEntries(Object.keys(flagDescriptions).map(flag => [flag, {
    name: flag,
    description: flagDescriptions[flag],
    amount: 0,
    n: Number(flag.slice(2))
  }]))
  for (const mapData of allMapsData) {
    for (const file of mapData.files) {
      for (const flag of file.flags) {
        flagTypes[flag].amount += 1
      }
      if (file.animated) {
        flagTypes['animated'].amount += 1
      }
    }
  }
  return sortBy(flagTypes, 'n')
}

/**
 * Returns all data needed to generate the overview page.
 */
const getAllMapsData = async (textureBase) => {
  const allMapsExports = await fg(['*'], {onlyDirectories: true, deep: 1, cwd: textureBase})
  const allMapsData = sortBy(await Promise.all(allMapsExports.map(mapExport => getMapData(textureBase, mapExport))), 'name')
  return allMapsData
}

module.exports = {
  getMapData,
  getFlagStats,
  getAllMapsData
}
