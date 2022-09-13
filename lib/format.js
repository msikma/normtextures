// normtextures <https://github.com/msikma/normtextures>
// © MIT license

const path = require('path')

/**
 * Formats the "unknown" value.
 */
const formatUnknown = unknownValue => {
  const val = unknownValue.slice(2)
  return `<span class="mono unknown">${unknownValue.slice(0, 2)}${val.padStart(8, '0')}</span>`
}

/**
 * Formats a flag indicator.
 */
const formatFlag = flagValue => {
  const prefix = flagValue.slice(0, 2)
  const suffix = flagValue.slice(2)
  const val = prefix === '0x' ? suffix : flagValue
  return `<span class="mono flag val-${val}">${flagValue}.</span> `
}

/**
 * Formats the description for a map file.
 */
const formatDescription = paragraphs => {
  return paragraphs.map(p => `<p>${p}</p>`).join('').trim()
}

/**
 * Returns a relative link to a texture image.
 */
const getFileLink = (link, name, basedirs = []) => {
  return `./${path.join(...basedirs, name, link)}`
}

/**
 * Returns an image tag for a texture.
 */
const getFileImage = (link, name, basedirs = []) => {
  const filepath = getFileLink(link, name, basedirs)
  return `<a href="${filepath}" class="t"><img src="${filepath}" class="t" /></a>`
}

/**
 * Returns an anchor link for a given map name.
 */
const getNameLink = name => {
  return `${name.replace(/\./g, '_')}`
}

module.exports = {
  getNameLink,
  getFileLink,
  getFileImage,
  formatDescription,
  formatFlag,
  formatUnknown
}
