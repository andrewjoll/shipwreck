precision mediump float;

// in vec2 vUv;
// in vec3 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

varying vec4 diffuseColor;

void main() {
    vec3 color = vec3(0.6, 0.6, 0.55);

    vec3 xTangent = dFdx(vPosition);
    vec3 yTangent = dFdy(vPosition);
    vec3 faceNormal = normalize(cross(xTangent, yTangent));

    vec3 lightDirection = vec3(0.2, 1.0, 0.2);
    float lightIntensity = dot(lightDirection, faceNormal);
    lightIntensity = 0.5 + (lightIntensity * 0.5);

    gl_FragColor = vec4(color * lightIntensity, 1.0);
}