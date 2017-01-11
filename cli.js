#!/usr/bin/env node

const fs = require('fs');
const execa = require('execa');
const fkill = require('fkill');
const ora = require('ora');
const inquirer = require('inquirer');
const icons = require('./icons');
const sublimeIcon = require('./');

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    h: 'help',
    i: 'icon'
  }
});

if (argv.v || argv.version) {
  console.log(require('./package').version);
  return;
}

if (argv.h || argv.help) {
  fs.createReadStream(`${__dirname}/usage.txt`)
    .pipe(process.stdout)
    .on('close', () => process.exit(1));
  return;
}

const setIcon = (icon) => {
  const spinner = ora('Setting LICEcap icon').start();

  return sublimeIcon(icon).then(() => {
    spinner.succeed();
    spinner.text = 'Clearing icon caches';
    spinner.start();

    return execa('touch', [
      '\/Applications/LICEcap.app',
      '\/Applications/LICEcap.app\/Contents\/Info.plist'
    ]);
  }).then(() => fkill('Dock'))
    .then(() => spinner.succeed())
    .catch(error => spinner.fail());
};

if (argv.i || argv.icon) {
  return setIcon(argv.i || argv.icon);
} else {
  const keys = Object.keys(icons);

  if (keys.length === 1) {
    return setIcon(icons[keys[0]]);
  }

  return inquirer.prompt([{
    type: 'list',
    name: 'icon',
    message: 'Select icon',
    choices: keys
  }]).then(answer => setIcon(icons[answer.icon]));
}
