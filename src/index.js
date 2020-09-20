const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

async function run() {
  try {
    const imgPath1 = core.getInput('img_1');
    const imgPath2 = core.getInput('img_2');
    const diffColorString = core.getInput('diff_color');
    const ignoreMaskPath = core.getInput('ignore_mask');

    const img1 = PNG.sync.read(fs.readFileSync(imgPath1));
    const img2 = PNG.sync.read(fs.readFileSync(imgPath2));
    const { width, height } = img1;
    const imgDiff = new PNG({ width, height });


    let area = {
      x0: 300,
      y0: 300,
      x1: 815,
      y1: 700,
    }

    //utils.ignoreArea(area, img1);
    //utils.ignoreArea(area, img2);

    const diffColor = utils.stringToList(diffColorString);

    let options = {
      threshold: 0.1,
      includeAA: false,
      alpha: 1,
      aaColor: [255, 255, 0],
      diffColor: diffColor,
      diffMask: false,
    }

    const mismatched = pixelmatch(img1.data, img2.data, imgDiff.data, width, height, options);
    const mismatchPercentage = mismatched / (img1.width * img1.height) * 100;

    const img1Name = path.basename(imgPath1, path.extname(imgPath1));
    const img2Name = path.basename(imgPath2, path.extname(imgPath2));
    core.info(`The second image "${img2Name}" is ${mismatchPercentage}% different compared to the first image "${img1Name}".`);

    const buffer = PNG.sync.write(imgDiff);
    core.setOutput('img-diff', buffer);
    core.setOutput('mismatch', mismatchPercentage);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
