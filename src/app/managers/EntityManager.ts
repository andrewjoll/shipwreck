import { Entity } from '@/entities';
import { System } from '@/systems';
import { Manager } from '@/managers';
import Game from '@/Game';
import Player from '@/entities/Player';
import Mesh from '@/components/Mesh';
import { Scene, Vector3 } from 'three';
import Movement from '@/systems/Movement';

class EntityManager implements Manager {
  protected entities: Entity[] = [];
  protected systems: System[] = [];

  protected scene: Scene;
  protected player: Player;

  init(game: Game): void {
    console.debug('EntityManager::init');

    this.scene = game.scene;

    this.addSystem(new Movement());
  }

  addPlayer(startLocation: Vector3): void {
    this.player = new Player(startLocation);
    this.addEntity(this.player);
  }

  update(time: number, deltaTime: number): void {
    this.systems.forEach((system) => {
      system.update(this.entities, time, deltaTime);
    });
  }

  addSystem(system: System): void {
    system.init();

    this.systems.push(system);
  }

  addEntity(entity: Entity): void {
    if (entity.hasComponent(Mesh.name)) {
      this.scene.add(entity.getComponent<Mesh>(Mesh.name));
    }

    this.entities.push(entity);
  }

  getPlayer(): Player {
    return this.player;
  }
}

const manager = new EntityManager();

export default manager;
