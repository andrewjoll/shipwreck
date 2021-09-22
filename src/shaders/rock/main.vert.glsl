varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

void main() {
    vUv = uv;
    vColor = instanceColor;
    vNormal = (modelViewMatrix * instanceMatrix * vec4(normal * instanceColor, 0.0)).xyz;

    vec4 instancePosition = instanceMatrix * vec4(position + (vNormal * instanceColor), 1.0);
    vPosition = instancePosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
}