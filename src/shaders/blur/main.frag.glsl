precision mediump float;

uniform sampler2D blurTexture;

varying vec2 vUv;
uniform vec2 blurResolution;
uniform vec2 blurDirection;

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
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

void main() {
    // const vec2 resolution = vec2(512.0, 512.0);
    // const vec2 direction = vec2(1.0, 0.0);

    vec2 uv = vec2(gl_FragCoord.xy / blurResolution.xy);

    gl_FragColor = blur13(blurTexture, uv, blurResolution.xy, blurDirection);
}

/*
float normpdf(in float x, in float sigma) {
	return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
}

void main() {
    const vec2 resolution = vec2(512.0, 512.0);
    const int mSize = 11;
    const int kSize = (mSize - 1) / 2;
    float kernel[mSize];
    vec3 outputColor = vec3(0.0);

    vec2 uv = vUv * 10.0;

    // Create the 1-D kernel
    float sigma = 7.0;
    float Z = 0.0;

    for (int j = 0; j <= kSize; ++j) {
        kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
    }

    // Get the normalization factor (as the gaussian has been clamped)
    for (int j = 0; j < mSize; ++j) {
        Z += kernel[j];
    }

    // Read out the texels
    for (int i = -kSize; i <= kSize; ++i) {
        for (int j = -kSize; j <= kSize; ++j) {
            outputColor += kernel[kSize + j] * kernel[kSize + i] * 1.0;
          //      texture(blurTexture, (uv.xy + vec2(float(i), float(j))) / resolution.xy).rgb;
        }
    }

    // vec4 lookup = texture2D(blurTexture, vUv);

    gl_FragColor = vec4(outputColor, 1.0);
}
*/

/*
precision mediump float;

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube

float normpdf(in float x, in float sigma)
{
	return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec3 c = texture(iChannel0, fragCoord.xy / iResolution.xy).rgb;

    //declare stuff
    const int mSize = 11;
    const int kSize = (mSize-1)/2;
    float kernel[mSize];
    vec3 final_colour = vec3(0.0);
    
    //create the 1-D kernel
    float sigma = 7.0;
    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j)
    {
        kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
    }
    
    //get the normalization factor (as the gaussian has been clamped)
    for (int j = 0; j < mSize; ++j)
    {
        Z += kernel[j];
    }
    
    //read out the texels
    for (int i=-kSize; i <= kSize; ++i)
    {
        for (int j=-kSize; j <= kSize; ++j)
        {
            final_colour += kernel[kSize+j]*kernel[kSize+i]*texture(iChannel0, (fragCoord.xy+vec2(float(i),float(j))) / iResolution.xy).rgb;

        }
    }

    
    fragColor = vec4(final_colour/(Z*Z), 1.0);
}
*/