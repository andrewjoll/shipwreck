varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
flat varying vec3 vSurfaceNormal;

uniform float worldSize;

void main() {
    // vUv = uv;
    vPosition = position;
    vNormal = normal;
    vSurfaceNormal = normal;

    float halfWorld = worldSize * 0.5;

    vUv = vec2(
        (position.x + halfWorld) / worldSize,
        (position.z + halfWorld) / worldSize
    );

    vUv = vec2(vUv.x, 1.0 - vUv.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}