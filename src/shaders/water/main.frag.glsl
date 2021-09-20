uniform sampler2D terrainDepth;
uniform sampler2D noise;
uniform float waterHeight;
uniform float time;

varying vec2 vUv;
varying vec3 vColor;
varying vec3 vPosition;
// varying vec3 vWorldPosition;
varying vec3 vViewAngle;

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;
    color += texture2D(image, uv) * 0.1964825501511404;
    color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
    return color;
}

float sineBetween(float min, float max, float t) {
    float halfRange = (max - min) / 2.0;
    return min + halfRange + sin(t) * halfRange;
}

void main() {
    vec3 color = vec3(0.25, 0.55, 0.71);

    // Position terrain in centre of water
    vec2 uv = (vUv * 2.0) - 0.5;

    vec4 noiseLookup = texture2D(noise, vUv * 10.0 + vec2(sin(time * 0.005), cos(time * 0.005)));

    // Blur the depth lookup
    vec2 resolution = vec2(128.0, 128.0);
    float blurX = blur(terrainDepth, uv, resolution.xy, vec2(5.0, 0.0)).b;
    float blurY = blur(terrainDepth, uv, resolution.xy, vec2(0.0, 5.0)).b;
    float blur = (blurX + blurY) * 0.5;

    vec4 depthLookup = texture2D(terrainDepth, uv);

    float shoreFalloff = blur;

    shoreFalloff = depthLookup.b;

    float heightDelta = vPosition.y / waterHeight;

    float dist = distance(vPosition, vec3(0.0, 8.0, 0.0)) / 2048.0;
    dist = smoothstep(0.15, 0.25, dist);

    float peaks = step(sineBetween(0.5, 0.6, time * 0.1), shoreFalloff) * 0.1;

    float alpha = (0.95 - shoreFalloff) * (dist * 0.5);

    float wave = dist + sin(vPosition.x / 128.0);// * cos(vPosition.z / 128.0);

    // gl_FragColor = vec4(shoreFalloff, shoreFalloff, shoreFalloff, 1.0);
    // gl_FragColor = vec4(peaks, peaks, peaks, 1.0);
    // gl_FragColor = vec4(color + peaks, 0.5);
    gl_FragColor = vec4(color + peaks, 0.5 + (dist * 0.5));
}