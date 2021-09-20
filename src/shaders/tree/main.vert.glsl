varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 instancePosition = instanceMatrix * vec4(position, 1.0);

    vUv = uv;
    vPosition = instancePosition.xyz;
    vNormal = (modelViewMatrix * instanceMatrix * vec4(normal, 0.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
}