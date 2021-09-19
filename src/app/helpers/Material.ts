import * as THREE from 'three';
import { Texture } from 'three';
import Config from '../Config';

export const TerrainDepth = new THREE.ShaderMaterial({
  vertexColors: true,
  // wireframe: true,
  uniforms: {
    waterHeight: {
      value: Config.WATER_HEIGHT,
    },
    worldHeight: {
      value: Config.WORLD_HEIGHT,
    },
  },
  vertexShader: require('../../shaders/terrain/depth.vert.glsl'),
  fragmentShader: require('../../shaders/terrain/depth.frag.glsl'),
});

export const TerrainMain = (): THREE.ShaderMaterial => {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    // wireframe: true,
    uniforms: {
      waterHeight: {
        value: Config.WATER_HEIGHT,
      },
    },
    vertexShader: require('../../shaders/terrain/main.vert.glsl'),
    fragmentShader: require('../../shaders/terrain/main.frag.glsl'),
  });

  return material;
};

export const WaterMain = (terrainDepth: Texture): THREE.ShaderMaterial => {
  const material = new THREE.ShaderMaterial({
    transparent: true,
    // wireframe: true,
    uniforms: {
      waterHeight: {
        value: Config.WATER_HEIGHT,
      },
      time: {
        value: 0,
      },
      terrainDepth: {
        value: terrainDepth,
      },
      noise: {
        value: THREE.ImageUtils.loadTexture(
          require('../../assets/noise.png').default
        ),
      },
    },
    vertexShader: require('../../shaders/water/main.vert.glsl'),
    fragmentShader: require('../../shaders/water/main.frag.glsl'),
  });

  material.uniforms.noise.value.wrapS = THREE.RepeatWrapping;
  material.uniforms.noise.value.wrapT = THREE.RepeatWrapping;

  return material;
};
