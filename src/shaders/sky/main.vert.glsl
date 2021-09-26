varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    vec3 transformed = vec3(position);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}