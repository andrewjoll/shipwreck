varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
flat varying vec3 vSurfaceNormal;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    vSurfaceNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}