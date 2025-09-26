import { SugarCube } from './types';
import { SugarCubeInternal } from './types/internal';

declare global {
  interface Window {
    SugarCube?: SugarCube;
    $SugarCube?: SugarCubeInternal;
  }
}
