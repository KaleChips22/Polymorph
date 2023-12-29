var selectedSwatch = [0, 0, 0]
var tileData = new Array().fill([-1, -1, -1] /* Invisible */)
var currentTile = -1

const colorsElem = document.getElementById('colors')
COLORS.forEach((c, i) => {
    const e = document.createElement('div')
    e.style.backgroundColor = `rgb(${c[0]},${c[1]},${c[2]})`
    e.classList.add('color-swatch')
    e.dataset.index = i
    colorsElem.appendChild(e)

    e.onclick = setSwatch
})

function setSwatch(e) {
    const target = e.target
    colorsElem.childNodes.forEach(x => x?.classList?.remove('selected'))
    target.classList.add('selected')
    selectedSwatch = COLORS[parseInt(target.dataset.index)]
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.addEventListener('mousedown', setPixel)

drawScreen()

function setPixel(e) {
    tileData[currentTile] = selectedSwatch
    drawScreen()
}

canvas.addEventListener("mousemove", e => {
    var x = e.x - e.target.offsetLeft
    var y = e.y - e.target.offsetTop

    var xPixel = Math.floor(x / 100)
    var yPixel = Math.floor(y / 100)

    currentTile = xPixel + yPixel * 8

    drawScreen()
    ctx.strokeStyle = 'rgb(255,255,255)'
    ctx.strokeWeight = 8
    ctx.strokeRect(100 * xPixel, 100 * yPixel, 100, 100)
})

function drawScreen() {
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, 800, 800)

    tileData.forEach((pixel, index) => {
        ctx.fillStyle = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
        let x = index % 8
        let y = Math.floor(index / 8)
        ctx.fillRect(x * 100, y * 100, 100, 100)
    })
}

function fill() {
    tileData = new Array(8 * 8).fill(selectedSwatch)
    drawScreen()
}

function generateList(data = tileData, show = true) {
    const array = data.map(x => COLOR_STRINGS.indexOf(x.join(',')))
    // console.log(tileData)
    const string = JSON.stringify(array)
    if (show) {
        navigator.clipboard.writeText(string)
        prompt("Copy the value below:", string)
    } else {
        return string
    }
}

function importString(string) {
    tileData = JSON.parse(string).map(x => COLORS[x])
    drawScreen()
}

function save() {
    const name = prompt('Enter a name:', '')
    if (!name) {
        return -1
    }
    window.localStorage.setItem(name, JSON.stringify(tileData.map(x => x.join(','))))
    drawScreen()
}

function load(input = false) {
    const name = input || prompt(Object.keys(window.localStorage).join('\n'), '')
    // tileData = JSON.parse(window.localStorage.getItem(name))
    tileData = JSON.parse(window.localStorage.getItem(name)).map(x => x.split(','))
    drawScreen()
}

function exportAll() {
    let lines = []
    for (let [key, val] of Object.entries(window.localStorage)) {
        lines.push(`${key}: ${generateList(JSON.parse(val).map(x => x.split(',')), false)}`)
    }
    const string = `const TILES = {\n    ${lines.join(',\n    ')}\n}`
    const blob = new Blob([string], {
        type: 'text/plain'
    })
    const url = URL.createObjectURL(blob)
    window.open(url)
}