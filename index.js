#!/usr/bin/env node

// normtextures <https://github.com/msikma/normtextures>
// © MIT license

const path = require('path')
const {getAllMapsData, getFlagStats} = require('./lib/data')
const {generateNormalityTexturesPage, generateLinks, generateFlags, generateOverview, generateProblematic} = require('./lib/html')

/** Base directory containing texture exports. */
const TEXT_DIR = ['textures']
const TEXT_BASE = path.resolve(__dirname, 'docs', ...TEXT_DIR)

/** Descriptions of each file. */
const descriptions = {
  'abovetv.das': ['The loft above the TV station.'],
  'blownup.das': ['The street after blowing up the power station.'],
  'cells.das': ['The Ordinary Outpost cells (both as prisoner and as prison guard).'],
  'den.das': [`Rebel base, initial version (inside the dumpster).`],
  'docks.das': [`Rebel base, second version (after getting free reign).`],
  'duct.das': [`The ducts inside the Plush-Rest Factory.`],
  'eureka0.das': [`Kent's apartment.`],
  'eureka1.das': [`The TV station.`],
  'facrecp.das': [`The Plush-Rest Factory reception area.`],
  'factory.das': [`The interior of the Plush-Rest Factory.`],
  'factout.das': [`The outside area of the Plush-Rest Factory.`],
  'filter.das': [`The Mood Filter where Kent gets brainwashed.`],
  'labs.das': [`The labs inside the Ordinary Outpost.`],
  'landing.das': [`The area just outside Kent's front door.`],
  'mintmall.das': [`The M.I.N.T. Mall.`],
  'missile.das': [`Plush-Rest Factory, only used for the short conversation with the other rebels after the missile has been fired.`],
  'outpost.das': [`The Ordinary Outpost reception area.`],
  'process.das': [`The processing floor inside the Ordinary Outpost.`],
  'sewer.das': [`The sewers underneath the Memorial Stadium.`],
  'stadium.das': [`The Memorial Stadium.`],
  'trucktv.das': [`The street before blowing up the power station.`],
  'turbine.das': [`The power station next to the TV shop.`],
  'winbox.das': [`Dai's window cleaning cradle outside Kent's apartment.`]
}

/** Files that are not exported correctly. */
const problematic = {
  'eureka0.das': ['SOFA', 'SOFA-BRK', 'SOFABRK2', 'BPIPE'],
  'eureka1.das': ['SOFA'],
  'facrecp.das': ['SOFA', 'COFFEE', 'MACHINE'],
  'factory.das': ['SLEEPER', 'WASTEMAN'],
  'factout.das': ['EXITCHUT'],
  'trucktv.das': ['ROOF'],
  'winbox.das': ['ROOF']
}

/** Descriptions for texture flags. */
const flagDescriptions = {
  '0x1': [],
  '0x2': [],
  '0x4': [],
  '0x8': [`People lying on the ground.`],
  '0x10': [`Items attached to the ceiling, e.g. lights or the hanging teddy inside the power station.`],
  '0x20': [`Skyboxes with fireworks.`],
  '0x40': [`Used by multi-angle textures (number of angles?)`],
  '0x80': [],
  '0x100': [],
  '0x200': [],
  '0x400': ['Partly or fully translucent.'],
  '0x800': [`Unused.`],
  '0x1000': [],
  '0x2000': [],
  '0x4000': [`Only used for the mood filter in the Memorial Stadium.`],
  '0x8000': [`Used by multi-angle textures (number of angles?)`],
  'animated': [`Contains animation.`]
}

/**
 * Generates the textures index file.
 */
const main = async () => {
  const allMapsData = await getAllMapsData(TEXT_BASE)
  const flagData = getFlagStats(allMapsData, flagDescriptions)

  const flags = generateFlags(flagData)
  const overview = generateOverview(allMapsData, descriptions, TEXT_DIR)
  const links = generateLinks(allMapsData, descriptions)
  const prob = generateProblematic(problematic)
  const html = generateNormalityTexturesPage(overview, links, prob, flags, problematic)
  
  console.log(html)
}

main()
