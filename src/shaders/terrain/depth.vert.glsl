// varying vec2 vUv;
// varying vec3 vColor;
// varying vec3 vNormal;
varying vec3 vPosition;
// varying vec3 vWorldPosition;

void main() {
    // vColor = color;
    // vUv = uv;
    vPosition = position;
    // vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}