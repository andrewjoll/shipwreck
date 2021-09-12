import { Pane } from 'tweakpane';

const pane = new Pane();

export default {
  addFolder: (title: string) => {
    return pane.addFolder({ title });
  },
};
