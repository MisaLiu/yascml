import * as path from 'path';
import * as fs from 'fs/promises';
import ora from 'ora';
import { patchGameHTML } from '../html';
import { buildPatchArgs } from './utils';
import { CommandInput, Anify } from './types';

export const patchGame = async (args: Anify<CommandInput>) => {
  const spinner = ora('Reading files...');

  try {
    const input = await buildPatchArgs(args);

    const gameFileParse = path.parse(args.gameFile.trim());
    const gameFileBasePath = gameFileParse.dir;
    const gameFileBaseName = gameFileParse.name;
    const resultPath = path.resolve(input.outputPath ?? gameFileBasePath, `./${gameFileBaseName}.patched.html`);

    spinner.text = 'Patching game...';

    const result = await patchGameHTML(
      input.gameFile,
      input.loaderFile,
      input.embeddedMods,
      input.loaderConfig,
      input.singleFile,
    );

    spinner.text = 'Writing game file...';

    if (await fs.stat(resultPath)) {
      await fs.unlink(resultPath);
    }
    await fs.writeFile(resultPath, result);

    spinner.succeed(`Patch finished! Patched game files are: ${resultPath}`);
  } catch (e) {
    spinner.fail('Failed to patch!');
    console.error(e);
  }
};
