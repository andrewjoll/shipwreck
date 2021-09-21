import { Entity } from '@/entities';
import { Component } from '@/components';

export default class Health implements Component {
  entity: Entity;
  name: string = 'Health';
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
