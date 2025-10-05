import * as path from 'path';
import * as fs from 'fs/promises';
import * as fse from 'fs-extra/esm';
import { Anify, CommandInput } from './types';
import { LoaderConfig } from '@yascml/loader';

export const buildPatchArgs = async ({
  gameFile,
  loaderFile,
  embeddedMods,
  loaderConfig,
  outputPath,
  singleFile,
}: Anify<CommandInput>) => {
  const result: CommandInput = {
    gameFile: await fs.readFile(gameFile.trim(), { encoding: 'utf-8' }),
    loaderFile: await fs.readFile(loaderFile.trim(), { encoding: 'utf-8' }),
    singleFile,
  };

  if (embeddedMods) {
    let paths: string[] = embeddedMods;
    if (typeof embeddedMods === 'string') {
      paths = embeddedMods.split(',');
    }

    if (!result.embeddedMods) result.embeddedMods = [];
    for (const path of paths) {
      const readResult = await fs.readFile(path.trim(), { encoding: 'base64' });
      result.embeddedMods.push(`data:application/octet-stream;base64,${readResult}`);
    }
  }

  if (loaderConfig) {
    if (typeof loaderConfig === 'string') {
      try {
        const config = JSON.parse(loaderConfig) as LoaderConfig;
        result.loaderConfig = config;
      } catch {
        result.loaderConfig = await fse.readJSON(loaderConfig);
      }
    } else {
      result.loaderConfig = loaderConfig;
    }
  }

  if (outputPath) {
    result.outputPath = outputPath;
  } else {
    result.outputPath = path.dirname(gameFile);
  }

  return result;
};
