import {
  Color,
  Mesh,
  OrthographicCamera,
  RGBFormat,
  Scene,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';

import Config from '../Config';
import * as Material from './Material';

export const renderDepth = (
  terrain: Mesh,
  renderer: WebGLRenderer
): Texture => {
  const renderTarget = new WebGLRenderTarget(128, 128, {
    format: RGBFormat,
  });

  const scene = new Scene();
  scene.background = new Color(0xff0000);

  const depthTerrain = terrain.clone();
  depthTerrain.material = Material.TerrainDepth;
  scene.add(depthTerrain);

  const cameraDistance = Config.WORLD_SIZE;
  const camera = new OrthographicCamera(
    cameraDistance / -2,
    cameraDistance / 2,
    cameraDistance / 2,
    cameraDistance / -2,
    1,
    Config.WORLD_SIZE + 1
  );

  camera.position.set(0, Config.WORLD_SIZE, 0);
  camera.lookAt(0, 0, 0);

  renderer.setRenderTarget(renderTarget);
  renderer.clear();
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  return renderTarget.texture;
};
