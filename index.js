const fs = require('fs');
const path = require('path');
const tempy = require('tempy');

module.exports = (icns) => {
  const src = path.isAbsolute(icns) ? icns : path.resolve(process.cwd(), icns);
  const tmp = tempy.file({extension: 'icns'});
  const dest = '/Applications/LICEcap.app/Contents/Resources/LICEcap.icns';
  const rs = fs.createReadStream(src);
  const ws = fs.createWriteStream(tmp);

  return new Promise((resolve, reject) => {
    ws.on('error', reject).on('close', resolve);
    rs.on('error', reject).pipe(ws);
  });
};
