varying vec2 vUv;
varying vec3 vColor;
varying vec3 vPosition;
// varying vec3 vWorldPosition;
varying vec3 vViewAngle;

void main() {
    // vec3 color1 = vec3(0.25, 0.55, 0.71);
    // vec3 color2 = vec3(1.0, 1.0, 1.0);

    vec3 color1 = vec3(0.25, 0.55, 0.71); // #3f8cb5
    vec3 color2 = vec3(82.0 / 255.0, 161.0 / 255.0, 203.0 / 255.0);    

    float mixValue = smoothstep(0.0, 1.0, (vPosition.y / 1024.0));

    vec3 color = mix(color1, color2, mixValue);

    gl_FragColor = vec4(color, 1.0);
}