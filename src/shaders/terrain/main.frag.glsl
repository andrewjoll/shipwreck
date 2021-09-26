// precision highp float;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
flat varying vec3 vSurfaceNormal;
varying vec3 vPosition;

uniform float waterHeight;
uniform float grassHeight;

uniform sampler2D noise;

void main() {
    vec3 colorSand = vec3(0.84, 0.77, 0.55);
    vec3 colorGrass = vec3(0.3, 0.5, 0.3);
    vec3 colorRock = vec3(0.6, 0.6, 0.55);

    vec3 up = vec3(0.0, 1.0, 0.0);

    float dist = distance(vPosition, vec3(0.0, 0.0, 0.0)) / 1024.0;
    // dist = smoothstep(0.45, 0.5, dist);
    dist = smoothstep(0.1, waterHeight, vPosition.y);
    
    float slope = acos(dot(up, vNormal));

    vec3 color = colorGrass;

    float rockMix = step(0.8, slope);

    float sandMix = smoothstep(0.0, grassHeight, vPosition.y);
    sandMix = 1.0 - step(0.7, sandMix);

    color = mix(color, colorSand, sandMix);
    color = mix(color, colorRock, rockMix);

    // Lighting
    vec3 lightDirection = vec3(0.2, 1.0, 0.2);
    float lightIntensity = dot(lightDirection, vNormal);

    if (rockMix >= 0.5) {
        lightIntensity = dot(lightDirection, vSurfaceNormal);
    }

    color *= lightIntensity;

    gl_FragColor = vec4(color, 1.0);
}