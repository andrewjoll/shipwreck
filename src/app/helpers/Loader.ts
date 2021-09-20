import { ImageLoader, LoadingManager } from 'three';

const manager = new LoadingManager();
const loader = new ImageLoader(manager);

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const percent = Math.round((itemsLoaded / itemsTotal) * 100);
  console.debug(`Loading ${percent}%`);
};

manager.onError = (url: string) => {
  console.error(`Error loading asset '${url}'`);
};

type LoaderManifest = {
  [key: string]: string;
};

type LoaderCache = {
  [key: string]: HTMLImageElement;
};

const loaderCache: LoaderCache = {};

export const loadManifest = async (manifest: LoaderManifest) => {
  const keys = Object.keys(manifest);

  return Promise.all(
    keys.map((key) =>
      loader.loadAsync(manifest[key]).then((result) => {
        loaderCache[key] = result;

        return result;
      })
    )
  );
};

export const getAsset = (key: string) => {
  if (loaderCache.hasOwnProperty(key)) {
    return loaderCache[key];
  }

  console.warn(`Asset '${key}' not loaded`);

  return null;
};

export default loader;
