export const VERTEX = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

// 2D simplex noise로 일렁이는 필드 + 커서 쪽 덩어리(blob) + 그레인
export const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uScroll;
uniform vec3 uBg;
uniform vec3 uAccent;
uniform float uDark;

vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}

float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;
  vec3 x=2.*fract(p*C.www)-1.;
  vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}

float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  float asp=uRes.x/uRes.y;
  vec2 st=vec2(uv.x*asp,uv.y);
  vec2 m=vec2(uMouse.x*asp,uMouse.y);
  float t=uTime*.08;

  vec2 q=st*1.4+vec2(0.,uScroll*1.5);
  vec2 w=vec2(snoise(q+t),snoise(q+vec2(5.2,1.3)-t));
  float n=snoise(q+w*.9+t*.5);

  float d=distance(st,m);
  float blob=smoothstep(.75,0.,d+n*.18);
  float field=smoothstep(.15,.9,n*.5+.5)*.55+blob*.85;
  field=clamp(field,0.,1.)*mix(1.,.45,smoothstep(0.,.15,uScroll));

  float bands=smoothstep(.35,.4,fract(field*4.))*.06;
  vec3 col=mix(uBg,uAccent,field*mix(.75,.7,uDark));
  col+=bands*(uDark>.5?uAccent:vec3(1.));
  col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*.06;
  gl_FragColor=vec4(col,1.);
}
`;
