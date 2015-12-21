varying vec2 vUv;
uniform sampler2D texture;
void main(void) {
  float r = 0.9;
  float PI = 3.14159265358979323846264;
  vec2 texPos = vec2(vUv.x, vUv.y);
  float theta = 2.0 * PI * texPos.x;
  float x = mod((texPos.y * 2.0), 1.0) * r * cos(theta);
  float y = mod((texPos.y * 2.0), 1.0) * r * sin(theta);
  float theta2 = 2.0 * PI * (1.0 - texPos.x + 0.5);
  float x2 = (1.0 - mod((texPos.y * 2.0), 1.0)) * r * cos(theta2);
  float y2 = (1.0 - mod((texPos.y * 2.0), 1.0)) * r * sin(theta2);
  if (texPos.y < 0.5)
  {
    texPos.x = x * 0.25 + 0.25;
    texPos.y = y * 0.5 + 0.62;
  }
  else
  {
    texPos.x = x2 * 0.25 + 0.75;
    texPos.y = y2 * 0.5 + 0.62;
  }
  texPos.y = texPos.y * 640.0 / 720.0;
  gl_FragColor = texture2D(texture, texPos);
}
