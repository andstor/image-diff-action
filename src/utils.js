function ignoreArea(area, img) {
    let { data, width } = img;
    for (let y = area.y0; y < area.y1; y++) {
        for (let x = area.x0; x < area.x1; x++) {
            const k = 4 * (width * y + x);
            data[k + 0] = 0;
            data[k + 1] = 0;
            data[k + 2] = 0;
            data[k + 3] = 0;
        }
    }
}

function stringToList(string) {
    return string.split(',').map((item) => item.trim());
}

module.exports = {
    stringToList,
    ignoreArea,
};