import { SugarCube } from './sugarcube';
import { SugarCubeInternal } from './internal';

export * from './sugarcube';
export * from './internal';

declare global {
  interface Window {
    SugarCube?: SugarCube;
    $SugarCube?: SugarCubeInternal;
  }
}
