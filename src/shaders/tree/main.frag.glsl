varying vec2 vUv;
varying vec3 vColor;
varying vec3 vNormal;
// varying vec3 vPosition;
uniform vec3 color;

void main() {
    // vec3 color = vec3(0.3, 0.5, 0.3);

    vec3 lightDirection = vec3(0.2, 1.0, 0.2);
    float lightIntensity = dot(lightDirection, vNormal);
    lightIntensity = 0.5 + (lightIntensity * 0.5);

    gl_FragColor = vec4(color * lightIntensity, 1.0);
}