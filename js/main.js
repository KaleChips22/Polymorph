const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = (4 / 3) * canvas.height

// 15 x 12 tiles

const height = canvas.height
const width = canvas.width

const tileSize = Math.floor(height / 12);
const pixelSize = Math.floor(tileSize / 8);

const tileRows = Math.ceil(height / tileSize);
const tileCols = Math.ceil(width / tileSize);

function color(r, g, b, a) {
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`
    return `rgba(${r},${g},${b},${a})`
}

function pixel(x, y) {
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
}

function tile(typeName, x, y, pX = 0, pY = 0) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let index = j * 8 + i
            if (TILES[typeName][index] != 54) {
                color(...COLORS[TILES[typeName][index]], 1)
            } else {
                color(0, 0, 0, 0)
            }
            pixel(x * 8 + i + pX, y * 8 + j + pY)
        }
    }
}

function tileFill(typeName, x, y, w, h) {
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            tile(typeName, x + i, y + j)
        }
    }
}

function tilePatch(typeName, x, y, w, h) {
    tile(typeName + '_corner_top_left', x, y)
    tile(typeName + '_corner_top_right', x + w - 1, y)
    tile(typeName + '_corner_bottom_left', x, y + h - 1)
    tile(typeName + '_corner_bottom_right', x + w - 1, y + h - 1)

    tileFill(typeName + '_edge_top', x + 1, y, w - 2, 1)
    tileFill(typeName + '_edge_bottom', x + 1, y + h - 1, w - 2, 1)
    tileFill(typeName + '_edge_left', x, y + 1, 1, h - 2)
    tileFill(typeName + '_edge_right', x + w - 1, y + 1, 1, h - 2)

    tileFill(typeName, x + 1, y + 1, w - 2, h - 2)
}

function tileBG(typeName) {
    tileFill(typeName, 0, 0, tileCols, tileRows)
}

color(0, 0, 0, 1)
ctx.fillRect(0, 0, width, height)

tileBG('grass')

tilePatch('water', 6, 4, 5, 5)
tilePatch('dirt', 0, 1, tileCols, 2)

tilePatch('water', 1, 6, 3, 5)

tilePatch('dirt', 11, 3, 5, 6)