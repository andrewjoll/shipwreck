uniform sampler2D terrainDepth;
uniform sampler2D noiseMap;

uniform float waterHeight;
uniform float worldSize;
uniform float waterSize;
uniform float time;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vPosition;
// varying vec3 vWorldPosition;
varying vec3 vViewAngle;

float sineBetween(float min, float max, float t) {
    float halfRange = (max - min) / 2.0;
    return min + halfRange + sin(t) * halfRange;
}

void main() {
    vec3 color = vec3(0.25, 0.55, 0.71);

    // Position terrain in centre of water
    vec2 uv = (vUv * (waterSize / worldSize)) + ((waterSize/worldSize) * -0.5) + 0.5;

    // Noise
    // vec4 noiseLookup = texture2D(noiseMap, vUv * 5.0);
    // float turbulence = noiseLookup.g;

    // Blurred terrain info
    vec4 depthLookup = texture2D(terrainDepth, uv);

    float shoreFalloff = depthLookup.b;

    // Falloff from center to edge of terrain mesh
    float dist = distance(vPosition, vec3(0.0, 8.0, 0.0)) / (worldSize * 0.5);
    bool outerEdge = dist > 2.0;

    // Shore outer wave
    color += step(sineBetween(0.5, 0.6, time * 0.1), shoreFalloff) * 0.1;

    // Smooth inner cuttoff
    float alpha = outerEdge ? 0.0 : dist;

    // Clip the alpha if we're close to the shore line,
    // looks nicer than intersecting with the terrain
    if (shoreFalloff > 0.8) {
        alpha = 0.0;
    }

    gl_FragColor = vec4(color, alpha);
}