const fs = require('fs');
const compareImages = require("resemblejs/compareImages");

async function getDiff(imgPath1, imgPath2, options) {
    
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    const data = await compareImages(
        await fs.promises.readFile(imgPath1),
        await fs.promises.readFile(imgPath2),
        options
    );

    //await fs.promises.writeFile("./output.png", data.getBuffer());
    return data;
}

function parseColorOption(colorString) {
    let rgbArray = colorString.split(',').map((item) => item.trim());
    let color = {
        red: rgbArray[0],
        green: rgbArray[1],
        blue: rgbArray[2]
    }
    return color;
}

function parseBoxOption(boxString) {
    let boxList = boxString.split(',').map((item) => item.trim());
    const box = {
        top: boxList[0],
        right: boxList[1],
        bottom: boxList[2],
        left: boxList[3]
      };
    return box;
}

module.exports = {
    parseColorOption,
    parseBoxOption,
    getDiff,
};