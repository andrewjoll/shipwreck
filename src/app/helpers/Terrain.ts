import {
  Color,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  RGBFormat,
  Scene,
  Texture,
  Vector2,
  WebGLRenderTarget,
} from 'three';

import Config from '@/Config';
import * as Material from '@helpers/Material';
import Renderer from '@/Renderer';

const DEPTH_RESOLUTION = 512;

export const renderDepth = (terrain: Mesh, renderer: Renderer): Texture => {
  renderer.saveSize();
  renderer.setSize(DEPTH_RESOLUTION, DEPTH_RESOLUTION, false);

  const renderTarget = new WebGLRenderTarget(
    DEPTH_RESOLUTION,
    DEPTH_RESOLUTION,
    {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBFormat,
      stencilBuffer: false,
    }
  );

  const renderTarget2 = new WebGLRenderTarget(
    DEPTH_RESOLUTION,
    DEPTH_RESOLUTION,
    {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBFormat,
      stencilBuffer: false,
    }
  );

  const renderTarget3 = new WebGLRenderTarget(
    DEPTH_RESOLUTION,
    DEPTH_RESOLUTION,
    {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBFormat,
      stencilBuffer: false,
    }
  );

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
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  // Add the blur quad
  const planeGeometry = new PlaneBufferGeometry(
    Config.WORLD_SIZE,
    Config.WORLD_SIZE,
    1,
    1
  );

  const planeMaterial = Material.BlurMain(
    renderTarget.texture,
    new Vector2(DEPTH_RESOLUTION, DEPTH_RESOLUTION),
    new Vector2(0, 1)
  );

  const quad = new Mesh(planeGeometry, planeMaterial);

  quad.position.set(0, Config.WORLD_HEIGHT, 0);
  quad.rotateX(-(Math.PI / 2));

  scene.remove(depthTerrain);
  scene.add(quad);

  // Render again
  renderer.setRenderTarget(renderTarget2);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  // Change direction
  quad.material = Material.BlurMain(
    renderTarget2.texture,
    new Vector2(DEPTH_RESOLUTION, DEPTH_RESOLUTION),
    new Vector2(1, 0)
  );

  // Render again
  renderer.setRenderTarget(renderTarget3);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  // Restore renderer size
  renderer.restoreSize();

  renderTarget.dispose();
  renderTarget2.dispose();

  return renderTarget3.texture;
};
