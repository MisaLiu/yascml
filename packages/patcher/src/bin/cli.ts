import { cac } from 'cac';
import inquirer from 'inquirer';
import { patchGame } from './patch';

if (process.argv.length > 2) {
  // For arguments and helps
  const cli = cac();

  cli
    .command('[game_path]', 'The original game file path')
    .option('-l, --loader [loader_path]', 'The YASCML script file path')
    .option('-e, --embedded-mod [mod_path]', 'Embedded mods path')
    .option('-c, --config [loader_config]', 'The YASCML config object or JSON file path')
    .option('-s, --single', 'Save as single file mode')
    .option('-o, --output [output_path]', 'Save result to path (default as path/to/gameFile.patch.html)')
    .action((gamePath, options) => {
      if (!options.loader) 
        throw new Error('Loader file path not defined');

      patchGame({
        gameFile: gamePath,
        loaderFile: options.loader,
        embeddedMods: options.embeddedMod ? (
          typeof options.embeddedMod === 'string' ? [options.embeddedMod] : options.embeddedMod
        ) : [],
        outputPath: options.output,
        singleFile: options.single,
      });
    });
  
  cli.help().version(__PATCHER_VERSION__).parse();
} else {
  // For interactive CLI
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
}
