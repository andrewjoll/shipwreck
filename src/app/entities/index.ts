import { Component, ComponentList } from '@/components';
import { MathUtils } from 'three';

export abstract class Entity {
  protected components: ComponentList = {};
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
}
