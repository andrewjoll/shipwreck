import { Entity } from '@/entities';
import { Component } from '@/components';
import * as THREE from 'three';

export default class Mesh extends THREE.Mesh implements Component {
  entity: Entity;
  name: string = 'Mesh';
}
