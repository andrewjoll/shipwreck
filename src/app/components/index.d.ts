import { Entity } from '@/entities';
import { Vector3 } from 'three';

interface Component {
  entity: Entity;
  name: string;
}

type ComponentList = {
  [key: string]: Component;
};

interface PositionProvider extends Component {
  getPosition: () => Vector3;
}
