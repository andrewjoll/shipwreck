declare module 'three-pathfinding' {
  import { BufferGeometry, Vector3 } from 'three';

  type Zone = {};

  export class Pathfinding {
    findPath(
      startPosition: Vector3,
      targetPosition: Vector3,
      zoneID: string,
      groupID: number
    ): Vector3[];

    getGroup(
      zoneID: string,
      position: Vector3,
      checkPolygon?: boolean
    ): number | null;

    static createZone(geometry: BufferGeometry, tolerance?: number): Zone;

    setZoneData(zoneID: string, zone: Zone): void;
  }
}
