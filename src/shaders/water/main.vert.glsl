varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform sampler2D terrainDepth;
uniform float time;
uniform float waterHeight;

void main() {
    vUv = uv;
    vPosition = position;

    vec4 depthLookup = texture2D(terrainDepth, (vUv * 2.0) - 0.5);

    float amplitude = 6.0;
    float frequency = 10.0;

    float waveOffset = sin((position.x * frequency) + (time * 0.1)) * cos((position.z * frequency) + (time * 0.1)) * amplitude;

    vec3 transformed = vec3(position);

    float dist = distance(vPosition, vec3(0.0, 8.0, 0.0)) / 2048.0;
    dist = smoothstep(0.2, 0.3, dist);

    transformed.y = (waveOffset * (1.0 - depthLookup.b)) * dist;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}