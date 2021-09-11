import * as THREE from 'three';
import ImprovedNoise from './ImprovedNoise';

export default class Terrain extends THREE.Mesh {
  constructor(image: HTMLImageElement) {
    console.log(image.width, image.height);

    const worldWidth = 64,
      worldDepth = 64;

    const geometry = new THREE.PlaneGeometry(
      2048,
      2048,
      worldWidth - 1,
      worldDepth - 1
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });

    super(geometry, material);

    const data = this.generateHeight(worldWidth, worldDepth);

    geometry.rotateX(-Math.PI / 2);

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      geometry.attributes.position.setY(i, data[i] * 10);
    }

    this.position.y = 10;
  }

  getImageData(img: HTMLImageElement) {
    const scale = 1;

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');

    var size = img.width * img.height;
    var data = new Float32Array(size);

    context.drawImage(img, 0, 0);

    for (var i = 0; i < size; i++) {
      data[i] = 0;
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j = 0;
    for (var i = 0; i < pix.length; i += 4) {
      var all = pix[i] + pix[i + 1] + pix[i + 2];

      data[j++] = pix[i];
    }

    return data;
  }

  generateHeight(width: number, height: number) {
    // let seed = Math.PI / 4;
    // window.Math.random = function () {
    //   const x = Math.sin(seed++) * 10000;
    //   return x - Math.floor(x);
    // };

    const size = width * height,
      data = new Uint8Array(size);
    const perlin = new ImprovedNoise(),
      z = Math.random() * 100;

    let quality = 1;

    const center = new THREE.Vector2(width / 2, height / 2);

    // for (let i = 0; i < size; i++) {
    //   const x = i % width;
    //   const y = ~~(i / width);

    //   const point = new THREE.Vector2(x, y);
    //   const distance = point.distanceTo(center) / width;

    //   data[i] = distance * 100;
    // }

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width;
        const y = ~~(i / width);

        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 5;
    }

    const targetHeight = 50;
    const frequency = 2;
    const amplitude = 5;

    function easeInQuart(x: number): number {
      return x * x * x * x;
    }

    function easeInOutCubic(x: number): number {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function easeInOutElastic(x: number): number {
      const c5 = (2 * Math.PI) / 4.5;

      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 +
          1;
    }

    for (let i = 0; i < size; i++) {
      const x = i % width;
      const y = ~~(i / width);

      const point = new THREE.Vector2(x, y);

      let distance = point.distanceTo(center);
      const normalisedDistance = distance / width;

      // Wobble the edges to make it less circular
      distance +=
        Math.sin(x / frequency) *
        Math.cos(y / frequency) *
        amplitude *
        easeInOutCubic(normalisedDistance);
      distance = distance / width;

      // data[i] = easeInOutCubic(1 - distance * 1.5) * 50;

      data[i] *= Math.max(easeInOutCubic(1 - distance * 2), 0);
      // data[i] = (data[i] / maxHeight) * targetHeight;
    }

    const maxHeight = Math.max(...data);
    console.log(maxHeight);

    for (let i = 0; i < size; i++) {
      data[i] = (data[i] / maxHeight) * targetHeight;
    }

    return data;
  }
}
