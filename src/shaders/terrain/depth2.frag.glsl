// precision highp float;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
flat varying vec3 vSurfaceNormal;
varying vec3 vPosition;

uniform float waterHeight;
uniform float worldHeight;
uniform float worldSize;
uniform float grassHeight;

uniform sampler2D noise;

void main() {
    vec3 colorSand = vec3(0.5);
    vec3 colorGrass = vec3(0.0);
    vec3 colorRock = vec3(1.0);

    float depth = vPosition.y / worldHeight;
    float waterFalloff = smoothstep(0.0, waterHeight, vPosition.y);
    float sandFalloff = 1.0 - smoothstep(0.0, grassHeight, vPosition.y);

    vec3 up = vec3(0.0, 1.0, 0.0);

    float slope = acos(dot(up, vNormal));

    vec3 color = colorGrass;

    float rockMix = step(0.8, slope);

    float sandMix = sandFalloff;

    color = mix(color, colorSand, sandMix);
    color = mix(color, colorRock, rockMix);

    gl_FragColor = vec4(sandMix, rockMix, waterFalloff, 1.0);
}