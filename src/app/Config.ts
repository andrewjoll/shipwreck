import { Vector3 } from 'three';

export default {
  WORLD_SIZE: 1024,
  WORLD_HEIGHT: 160,
  WORLD_RESOLUTION: 64,
  WORLD_LAND_SCALE: 0.5,

  SAND_HEIGHT: 0,
  GRASS_HEIGHT: 24,

  WATER_HEIGHT: 8,
  WATER_SIZE: 2048,
  WATER_RESOLUTION: 32,

  UP: new Vector3(0, 1, 0),
  DOWN: new Vector3(0, -1, 0),

  LAYER_PICKABLE: 10,
};
