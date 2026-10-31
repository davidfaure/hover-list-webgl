uniform sampler2D uTexturePrev;
uniform sampler2D uTextureNext;
uniform vec2 uPrevRes;
uniform vec2 uNextRes;
uniform vec2 uPlaneRes;
uniform float uProgress;
uniform float uDirection;
uniform float uAlpha;
uniform float uCurve;
varying vec2 vUv;

#define PI 3.141592653589793

vec2 coverUv(vec2 uv, vec2 imageRes, vec2 planeRes) {
  float planeRatio = planeRes.x / planeRes.y;
  float imageRatio = imageRes.x / imageRes.y;
  vec2 scale = planeRatio < imageRatio
    ? vec2(planeRatio / imageRatio, 1.0)
    : vec2(1.0, imageRatio / planeRatio);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  float forward = step(0.0, uDirection);

  float bend = sin(vUv.x * PI) * sin(uProgress * PI) * uCurve;
  float edge = mix(1.0 - uProgress, uProgress, forward) + bend * uDirection;
  float showNext = mix(step(edge, vUv.y), 1.0 - step(edge, vUv.y), forward);

  vec2 nextUv = vec2(vUv.x, vUv.y + uDirection * (1.0 - uProgress));
  vec2 prevUv = vec2(vUv.x, vUv.y - uDirection * uProgress);

  vec4 nextColor = texture2D(uTextureNext, coverUv(nextUv, uNextRes, uPlaneRes));
  vec4 prevColor = texture2D(uTexturePrev, coverUv(prevUv, uPrevRes, uPlaneRes));

  gl_FragColor = mix(prevColor, nextColor, showNext);
  gl_FragColor.a *= uAlpha;

  #include <colorspace_fragment>

  gl_FragColor.rgb *= gl_FragColor.a;
}
