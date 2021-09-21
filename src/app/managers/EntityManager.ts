import { Entity } from '@/entities';
import { System } from '@/systems';
import { Manager } from '@/managers';
import Game from '@/Game';
import Player from '@/entities/Player';
import HealthCheck from '@/systems/HealthCheck';
import Mesh from '@/components/Mesh';
import { Scene } from 'three';
import Movement from '@/systems/Movement';

class EntityManager implements Manager {
  protected entities: Entity[] = [];
  protected systems: System[] = [];

  protected scene: Scene;

  init(game: Game): void {
    console.debug('EntityManager::init');

    this.scene = game.scene;

    const player = new Player();

    this.add(player);

    this.systems.push(new HealthCheck());
    this.systems.push(new Movement());
  }

  update(time: number, deltaTime: number): void {
    this.systems.forEach((system) => {
      system.update(this.entities, time, deltaTime);
    });
  }

  add(entity: Entity): void {
    if (entity.hasComponent(Mesh.name)) {
      this.scene.add(entity.getComponent<Mesh>(Mesh.name));
    }

    this.entities.push(entity);
  }
}

const manager = new EntityManager();

export default manager;
