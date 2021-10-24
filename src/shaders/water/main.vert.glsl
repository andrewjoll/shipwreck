varying vec2 vUv;
varying vec3 vPosition;
// varying vec3 vWorldPosition;

uniform sampler2D terrainDepth;
uniform float time;
uniform float waterHeight;

void main() {
    vUv = uv;
    vPosition = position;

    vec3 transformed = vec3(position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}