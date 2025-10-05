import inquirer from 'inquirer';
import { patchGame } from './patch';

inquirer.prompt([
  {
    type: 'input',
    name: 'gameFile',
    message: 'The original game file path:',
    required: true,
  },
  {
    type: 'input',
    name: 'loaderFile',
    message: 'The YASCML script file path:',
    required: true,
  },
  {
    type: 'input',
    name: 'embeddedMods',
    message: 'Embedded mods path, split by \',\':',
  },
  {
    type: 'input',
    name: 'loaderConfig',
    message: 'The YASCML config object or JSON file path:',
  },
  {
    type: 'input',
    name: 'outputPath',
    message: 'Save result to (default as path/to/gameFile.patch.html):',
  },
  {
    type: 'select',
    name: 'singleFile',
    message: 'Use single file mode?',
    choices: [
      {
        name: 'Yes',
        value: true,
      },
      {
        name: 'No',
        value: false,
      }
    ],
    default: true,
  },
  {
    type: 'confirm',
    name: 'confirmed',
    message: 'Is that correct',
    default: false,
  }
]).then((e) => {
  if (!e.confirmed) return;
  patchGame(e);
});
