import { Entity } from '@/entities';

interface Component {
  entity: Entity;
  name: string;
}

type ComponentList = {
  [key: string]: Component;
};
