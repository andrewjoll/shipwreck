import Health from '@/components/Health';
import { Entity } from '@/entities';
import { System } from '@/systems';

export default class HealthCheck implements System {
  name: string = 'HealthCheck';

  update(entities: Entity[], time: number): void {
    entities.forEach((entity) => {});
  }
}
