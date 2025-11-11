export default `#version 100
  precision mediump float;

  varying vec2 vTexCoord;
  //varying vec4 pixel;

  uniform sampler2D source;

  void main(void) {
    gl_FragColor = texture2D(source, vTexCoord);
  }
`
