export default `#version 100
  precision mediump float;

  varying vec2 vTexCoord;

  uniform sampler2D source;
  // uniform sampler2D alpha;

  // All components are in the range [0…1], including hue.
  // Taken from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl.
  // Code is licensed under the WTFPL.  
  vec3 hsv2rgb(vec3 c)
  {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  vec3 rgb2hsv(vec3 c)
  {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  float distAlphaHSV(vec3 pixel, vec3 target, float tolerance, float edge) {
    vec3 h1 = rgb2hsv(pixel);
    vec3 h2 = rgb2hsv(target);

    float a = (length(h1.r - h2.r) - tolerance) * edge;

    return a;
  }

  float distAlphaRGB(vec3 pixel, vec3 target, float tolerance, float edge) {
    return (length(pixel.rgb - target.rgb) - tolerance) * edge;
  }

  float distAlphaR(vec3 pixel, vec3 target, float tolerance, float edge) {
    return (abs(pixel.r - target.r) - tolerance) * edge;
  }

  float distAlphaG(vec3 pixel, vec3 target, float tolerance, float edge) {
    return (abs(pixel.g - target.g) - tolerance) * edge;
  }

  float distAlphaB(vec3 pixel, vec3 target, float tolerance, float edge) {
    return (abs(pixel.b - target.b) - tolerance) * edge;
  }

  vec3 colorRGB(vec3 c) {
    return c.rgb;
  }

  vec3 colorRRR(vec3 c) {
    return c.rrr;
  }

  vec3 colorGGG(vec3 c) {
    return c.ggg;
  }

  vec3 colorBBB(vec3 c) {
    return c.bbb;
  }

  void main(void) {
    // pixel = texture2D(alpha, vTexCoord); // avoid error if no keys defined
    vec4 pixel = texture2D(source, vTexCoord);
    gl_FragColor = pixel;

    %keys%
    // pixel.a = 1.;
  }
`
