// varying vec2 vUv;
// varying vec3 vColor;
// varying vec3 vNormal;
varying vec3 vPosition;
// varying vec3 vWorldPosition;

uniform float worldHeight;
uniform float waterHeight;

void main() {
    float depth = vPosition.y / worldHeight;
    float waterFalloff = smoothstep(0.0, waterHeight, vPosition.y);

    gl_FragColor = vec4(0.0, depth, waterFalloff, 1.0);
}