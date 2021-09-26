import {
  BackSide,
  ClampToEdgeWrapping,
  Color,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
} from 'three';
import Config from '@/Config';
import { getAsset } from '@helpers/Loader';

export const TerrainDepth = new ShaderMaterial({
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
  vertexShader: require('@shaders/terrain/depth.vert.glsl'),
  fragmentShader: require('@shaders/terrain/depth.frag.glsl'),
});

export const TerrainMain = (): ShaderMaterial => {
  const material = new ShaderMaterial({
    transparent: false,
    // wireframe: true,
    uniforms: {
      waterHeight: {
        value: Config.WATER_HEIGHT,
      },
      grassHeight: {
        value: Config.GRASS_HEIGHT,
      },
      noise: {
        value: getAsset('noise'),
      },
    },
    vertexShader: require('@shaders/terrain/main.vert.glsl'),
    fragmentShader: require('@shaders/terrain/main.frag.glsl'),
    extensions: {
      derivatives: true,
    },
    // glslVersion: GLSL3,
  });

  material.uniforms.noise.value.wrapS = RepeatWrapping;
  material.uniforms.noise.value.wrapT = RepeatWrapping;

  return material;
};

export const WaterMain = (terrainDepth: Texture): ShaderMaterial => {
  const material = new ShaderMaterial({
    transparent: true,
    // depthWrite: false,
    // wireframe: true,
    uniforms: {
      waterHeight: {
        value: Config.WATER_HEIGHT,
      },
      waterSize: {
        value: Config.WATER_SIZE,
      },
      worldSize: {
        value: Config.WORLD_SIZE,
      },
      time: {
        value: 0,
      },
      terrainDepth: {
        value: terrainDepth,
      },
      noise: {
        value: getAsset('noise'),
      },
    },
    vertexShader: require('@shaders/water/main.vert.glsl'),
    fragmentShader: require('@shaders/water/main.frag.glsl'),
  });

  material.uniforms.noise.value.wrapS = RepeatWrapping;
  material.uniforms.noise.value.wrapT = RepeatWrapping;

  material.uniforms.terrainDepth.value.wrapS = ClampToEdgeWrapping;
  material.uniforms.terrainDepth.value.wrapT = ClampToEdgeWrapping;

  return material;
};

export const SkyMain = (): ShaderMaterial => {
  const material = new ShaderMaterial({
    transparent: false,
    side: BackSide,
    depthWrite: true,
    uniforms: {},
    vertexShader: require('@shaders/sky/main.vert.glsl'),
    fragmentShader: require('@shaders/sky/main.frag.glsl'),
  });

  return material;
};

export const TreeMain = (isTrunk: boolean): ShaderMaterial => {
  const material = new ShaderMaterial({
    // wireframe: true,
    uniforms: {
      color: {
        value: isTrunk
          ? new Color(78 / 255, 60 / 255, 51 / 255)
          : new Color(0.3, 0.5, 0.3),
      },
    },
    vertexShader: require('@shaders/tree/main.vert.glsl'),
    fragmentShader: require('@shaders/tree/main.frag.glsl'),
  });

  return material;
};

export const RockMain = (): ShaderMaterial => {
  const material = new ShaderMaterial({
    // wireframe: true,
    uniforms: {},
    vertexShader: require('@shaders/rock/main.vert.glsl'),
    fragmentShader: require('@shaders/rock/main.frag.glsl'),
    extensions: {
      derivatives: true,
    },
    // glslVersion: GLSL3,
  });

  return material;
};
