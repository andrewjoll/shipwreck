varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
varying vec3 vPosition;
// varying vec3 vWorldPosition;
// varying vec3 vViewAngle;

uniform float waterHeight;
uniform float grassHeight;

uniform sampler2D noise;

void main() {
    vec3 colorSand = vec3(0.84, 0.77, 0.55);
    vec3 colorGrass = vec3(0.3, 0.5, 0.3);
    vec3 colorRock = vec3(0.6, 0.6, 0.55);

    vec4 noiseLookup = texture2D(noise, vUv * 20.0);
    float noiseStep = step(0.5, noiseLookup.g);

    vec3 up = vec3(0.0, 1.0, 0.0);

    float dist = distance(vPosition, vec3(0.0, 0.0, 0.0)) / 1024.0;
    // dist = smoothstep(0.45, 0.5, dist);
    dist = smoothstep(0.1, waterHeight, vPosition.y);
    
    float slope = dot(vNormal, up);

    vec3 color = colorGrass;

    float rockMix = 1.0 - smoothstep(0.7, 0.8, slope);
    rockMix = step(0.5, rockMix);

    float sandMix = smoothstep(0.0, grassHeight, vPosition.y);
    sandMix = 1.0 - step(0.7, sandMix);

    color = mix(color, colorSand, sandMix);
    color = mix(color, colorRock, rockMix);

    // Lighting
    vec3 lightDirection = vec3(0.2, 1.0, 0.2);
    float lightIntensity = dot(lightDirection, vNormal);

    if (rockMix > 0.5) {
        vec3 xTangent = dFdx(vPosition);
        vec3 yTangent = dFdy(vPosition);
        vec3 faceNormal = normalize(cross(xTangent, yTangent));
        lightIntensity = dot(lightDirection, faceNormal);
    }

    // gl_FragColor = vec4(faceNormal.xyz, 1.0);
    gl_FragColor = vec4(color * lightIntensity, 1.0);
}