// precision highp float;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
flat varying vec3 vSurfaceNormal;
// varying vec3 vPosition;

uniform float waterHeight;
uniform float worldSize;
uniform float worldHeight;
uniform float grassHeight;

uniform sampler2D noise;
uniform sampler2D depthMap;

void main() {
    vec3 colorSand = vec3(0.84, 0.77, 0.55);
    vec3 colorGrass = vec3(0.3, 0.5, 0.3);
    vec3 colorRock = vec3(0.6, 0.6, 0.55);

    vec4 depthResult = texture2D(depthMap, vUv);

    vec3 color = colorGrass;

    float rockMix = step(0.5, depthResult.g);
    float sandMix = step(0.5, depthResult.r);

    color = mix(color, colorSand, sandMix);
    color = mix(color, colorRock, rockMix);

    // Lighting
    vec3 lightDirection = vec3(0.2, 1.0, 0.2);
    float lightIntensity = dot(lightDirection, vNormal);

    if (rockMix >= 0.5) {
        lightIntensity = dot(lightDirection, vSurfaceNormal);
    }

    color *= lightIntensity;

    gl_FragColor = vec4(color.rgb, 0.0);
}