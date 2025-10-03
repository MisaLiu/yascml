/**
 * Extract build dist files to `<root>/dist/<package_name>`.
 */
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra/esm';

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
const packagesDir = resolve(__dirname, './packages');
const resultDir = resolve(__dirname, './dist');

const rushJson = fse.readJSONSync(resolve(__dirname, './rush.json'));

fse.ensureDirSync(resultDir);
fse.emptyDirSync(resultDir);

for (const name of fs.readdirSync(packagesDir)) {
  const packageDir = join(packagesDir, name);
  if (!fs.statSync(packageDir).isDirectory) continue;

  const projectInfo = rushJson.projects.find((e) => e.projectFolder === `packages/${name}`);
  if (!projectInfo) {
    console.warn(`Cannot find project info for package: ${name}, skipping that...`);
    continue;
  }
  if (projectInfo.reviewCategory !== 'production' && projectInfo.reviewCategory !== 'document') continue;

  const outputDir = resolve(packageDir, './dist');
  if (!fs.existsSync(packageDir)) {
    console.warn(`Cannot find build result path for package: ${name}, skipping that...`);
    continue;
  }

  const _resultDir = join(resultDir, name);
  fse.ensureDirSync(_resultDir);
  fse.copySync(outputDir, _resultDir);
}
