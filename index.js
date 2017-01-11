const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tempfile = require('tempfile');

module.exports = (icns) => {
  const src = path.isAbsolute(icns) ? icns : path.resolve(process.cwd(), icns);
  const tmp = tempfile('.icns');
  const dest = '/Applications/LICEcap.app/Contents/Resources/LICEcap.icns';
  const read = fs.createReadStream(src);
  const write = fs.createWriteStream(tmp);

  return new Promise((resolve, reject) => {
    read.on('error', error => {
      rimraf(tmp, () => reject(error));
    });

    write.on('error', error => {
      rimraf(tmp, () => reject(error));
    }).on('close', () => {
      fs.rename(tmp, dest, error => {
        if (error) {
          rimraf(tmp, () => reject(error));
        } else {
          rimraf(tmp, () => resolve());
        }
      });
    });

    read.pipe(write);
  });
};
