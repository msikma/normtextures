// normtextures <https://github.com/msikma/normtextures>
// © MIT license

const {getNameLink, getFileLink, getFileImage, formatDescription, formatFlag, formatUnknown} = require('./format')

/**
 * Generates a texture overview table for a particular map.
 */
const generateMapOverview = (mapData, headerItems, descriptions, basedirs = [], pathPrefix = './') => {
  const buffer = []
  buffer.push('<tbody>')
  buffer.push('<tr>')
  buffer.push(`<th colspan="${headerItems.length}"><div class="header"><h2><a name="${getNameLink(mapData.name)}">${mapData.name}</a></h2>${formatDescription(descriptions[mapData.name] || [])}</div></th>`)
  buffer.push('</tr>')
  buffer.push(generateHeader(headerItems))
  for (const file of mapData.files) {
    buffer.push('<tr>')
    buffer.push(`<td>${file.index}</td>`)
    buffer.push(`<td><a href="${getFileLink(file.filename, mapData.name, basedirs, pathPrefix)}">${file.name}</a></td>`)
    buffer.push(`<td>${file.description}</td>`)
    buffer.push(`<td class="c1"><div class="c2">${getFileImage(file.filename, mapData.name, basedirs, pathPrefix)}</div></td>`)
    buffer.push(`<td>${file.kind}</td>`)
    buffer.push(`<td class="r">${file.size}</td>`)
    buffer.push(`<td>${formatUnknown(file.unknown)}</td>`)
    buffer.push(`<td>${[...file.flags, ...(file.animated ? ['animated'] : [])].map(flag => formatFlag(flag)).join('').trim()}</td>`)
    buffer.push('</tr>')
  }
  buffer.push('</tbody>')
  return buffer.join('\n')
}

/**
 * Generates a header row for a map's texture overview table.
 */
const generateHeader = (headers, isBody = true, includeWrapper = false) => {
  const el = isBody ? 'tbody' : 'thead'
  const buffer = []
  includeWrapper && buffer.push(`<${el}>`)
  buffer.push('<tr>')
  buffer.push(...headers.map(item => `<th>${item}</th>`))
  buffer.push('</tr>')
  includeWrapper && buffer.push(`</${el}>`)
  return buffer.join('\n')
}

/**
 * Generates a texture overview table for all maps.
 */
const generateOverview = (allMapsData, descriptions, basedirs = [], pathPrefix = './') => {
  const headers = ['#', 'Name', 'Description', 'Image', 'Kind', 'Size', 'Unknown', 'Flags']
  const buffer = []
  buffer.push('<table class="table overview" border="2">')
  buffer.push(...(allMapsData.map(mapData => generateMapOverview(mapData, headers, descriptions, basedirs, pathPrefix))))
  buffer.push('</table>')
  return buffer.join('\n')
}

/**
 * Generates a list of anchor links to each map's texture overview table.
 */
const generateLinks = (allMapsData, descriptions) => {
  const buffer = []
  buffer.push('<ul>')
  for (const mapData of allMapsData) {
    const paragraphs = descriptions[mapData.name] || []
    buffer.push(`<li><a href="#${getNameLink(mapData.name)}">${mapData.name}</a> – ${paragraphs[0] ?? 'no description'}</li>`)
  }
  buffer.push('</ul>')
  return buffer.join('\n')
}

/**
 * Generates a table of flags, their usage amounts, and their descriptions.
 */
const generateFlags = (flagData) => {
  const buffer = []
  buffer.push('<table class="table flags" border="2">')
  buffer.push(`<thead>`)
  buffer.push(`<tr>`)
  buffer.push(`<th>Mask</th>`)
  buffer.push(`<th>Amount</th>`)
  buffer.push(`<th>Description</th>`)
  buffer.push(`</tr>`)
  buffer.push(`</thead>`)
  buffer.push(`<tbody>`)
  for (const flag of flagData) {
    buffer.push(`<tr>`)
    buffer.push(`<td>${formatFlag(flag.name)}</td>`)
    buffer.push(`<td>${flag.amount}</td>`)
    buffer.push(`<td>${!(flag.description || []).length ? `Unknown.` : `${flag.description.join(' ')}`}</td>`)
    buffer.push(`</tr>`)
  }

  buffer.push(`</tbody>`)
  buffer.push('</table>')
  return buffer.join('\n')
}

/**
 * Generates a list of problematic textures.
 */
const generateProblematic = (problematicData) => {
  const buffer = []
  buffer.push('<ul>')
  for (const [name, map] of Object.entries(problematicData)) {
    for (const texture of map) {
      buffer.push(`<li><span>${name}</span>/<span>${texture}</span></li>`)
    }
  }
  buffer.push('</ul>')
  return buffer.join('\n')
}

/**
 * Returns a full HTML document.
 * 
 * Requires that the individual segments of the page (such as the texture overview table)
 * are already generated.
 */
const generateNormalityTexturesPage = (htmlOverview, htmlLinks, htmlProblematic, htmlFlags, dataProblematic) => {
  const textureSize = 64
  return `
<!doctype html>
<html>
<head>
  <title>Normality texture overview</title>
  <style>
  body {
    background: black;
    color: white;
  }
  a[href] {
    color: cyan;
  }
  a[href]:visited {
    color: darkcyan;
  }
  .header h2, .header p {
    margin: 0;
  }
  .header {
    margin: 0.5em 0;
  }
  .table {
    border-color: #333;
  }
  .table td {
    border-color: #666;
  }
  .r {
    text-align: right;
  }
  .c1 {
    /* texture container 1 */
    display: flex;
    width: ${textureSize}px;
    height: ${textureSize}px;
    padding: 4px;
    align-items: center;
  }
  .c2 {
    /* texture container 2 */
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-basis: 100%;
  }
  .t {
    /* texture image */
    width: auto;
    height: auto;
    max-width: ${textureSize}px;
    max-height: ${textureSize}px;
    object-fit: contain;
    display: block;
  }
  .mono {
    white-space: pre;
    font-family: monospace;
  }
  .flag.val-1 {
    color: #0a5ba2;
  }
  .flag.val-2 {
    color: #0526d0;
  }
  .flag.val-4 {
    color: #a5d005;
  }
  .flag.val-8 {
    color: #790aa2;
  }
  .flag.val-10 {
    color: #d005a5;
  }
  .flag.val-20 {
    color: #a25b0a;
  }
  .flag.val-40 {
    color: #6405d0;
  }
  .flag.val-80 {
    color: #1abc9c;
  }
  .flag.val-100 {
    color: #f1c40f;
  }
  .flag.val-200 {
    color: #e67e22;
  }
  .flag.val-400 {
    color: #05aed0;
  }
  .flag.val-800 {
    color: #96f10f;
  }
  .flag.val-1000 {
    color: #e74c3c;
  }
  .flag.val-2000 {
    color: #284d73;
  }
  .flag.val-4000 {
    color: #8e44ad;
  }
  .flag.val-8000 {
    color: #35cc2e;
  }
  </style>
</head>
<body>
<h1>Normality textures</h1>
<p>These are all the extracted textures for the game Normality.</p>
<p>Normality's textures all come with a name and description, probably to make it easier for devs to create maps.</p>
<p>Currently not all textures can be correctly extracted.
Some textures have multiple angles from which you can view them, such as the coffee machine inside the Plush-Rest Factory, and these can't be properly parsed at the moment.
This affects only a small number of textures (see below for a list).</p>
<p>If you want a zip file of all textures, <a href="https://github.com/msikma/normtextures">head over to the Github page</a>.</p>
<h2>Overview</h2>
${htmlLinks}
<h2>Textures</h2>
${htmlOverview}
<h2>Flags</h2>
<p>Most flags don't have a known function. Combinations of flags might also mean specific things.</p>
${htmlFlags}
${Object.keys(dataProblematic).length > 0 ? `
<h2>Buggy textures</h2>
<p>These are the textures that cannot currently be exported for the reasons outlined at the top of the page.</p>
${htmlProblematic}
` : ``}
<h2>Copyright</h2>
<p>All Normality content is the property of its copyright holders. The programming code used to generate this list is <a href="https://opensource.org/licenses/MIT">MIT licensed</a>.</p>
<p>© 1996, Gremlin Interactive Ltd.</p>
</body>
</html>
  `
}

module.exports = {
  generateNormalityTexturesPage,
  generateLinks,
  generateFlags,
  generateOverview,
  generateProblematic
}
