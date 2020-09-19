const core = require('@actions/core');
const path = require('path');
const utils = require('./utils');

async function run() {
  try {
    const imgPath1 = core.getInput('img_1');
    const imgPath2 = core.getInput('img_2');
    const errorColorString = core.getInput('error_color');
    const maskPath = core.getInput('mask');
    const ignoredBoxSting = core.getInput('ignored_box');
    
    // TODO: Produce boxes based on mask....

    const errorColorObj = utils.parseColorOption(errorColorString);
    const boxObj = utils.parseBoxOption(ignoredBoxSting);

    let options = {
      output: {
          errorColor: errorColorObj,
          ignoredBox: boxObj,
          errorType: "flat",
          //transparency: 0.3,
          largeImageThreshold: 0,
          useCrossOrigin: false,
          outputDiff: true,
      },
      scaleToSameSize: true,
      ignore: "antialiasing"
  };
    
    let data = utils.getDiff(imgPath1, imgPath2, options);

    const img1Name = path.basename(imgPath1, path.extname(imgPath1));
    const img2Name = path.basename(imgPath2, path.extname(imgPath2));
    core.info(`The second image "${img2Name}" is ${data.misMatchPercentage}% different compared to the first image "${img1Name}".`);
    
    core.setOutput('img-diff', data.getBuffer());
    core.setOutput('mismatch', data.misMatchPercentage);

  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
