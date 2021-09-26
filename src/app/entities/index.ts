import { Component, ComponentList, PositionProvider } from '@/components';
import { MathUtils, Vector3 } from 'three';

export abstract class Entity {
  protected components: ComponentList = {};
  protected positionProvider: Component;

  uuid: string;

  constructor() {
    this.uuid = MathUtils.generateUUID();
  }

  public get Components(): ComponentList {
    return this.components;
  }

  addComponent(component: Component): void {
    this.components[component.name] = component;
    component.entity = this;
  }

  getComponent<C extends Component>(name: string): C {
    if (this.components.hasOwnProperty(name)) {
      return this.components[name] as C;
    }

    throw new Error(
      `Component ${name} not found on Entity ${this.constructor.name}`
    );
  }

  removeComponent(name: string): void {
    if (this.components.hasOwnProperty(name)) {
      this.components[name].entity = null;
      delete this.components[name];
    }
  }

  hasComponent(name: string): boolean {
    return this.components.hasOwnProperty(name);
  }

  setPositionProvider(name: string): void {
    this.positionProvider = this.getComponent(name);
  }

  getPosition(): Vector3 {
    return this.positionProvider.getPosition();
  }
}
