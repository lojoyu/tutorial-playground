//precision mediump float;
//precision mediump vec4;
uniform float time;

varying vec3 vPosition;
//varying vec4 vColor;

void main()	{

    float dist = length(gl_PointCoord-vec2(0.5));
    float alpha = 1. - smoothstep(0.45, 0.5, dist);
    //color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
    gl_FragColor = vec4(1., 1., 1., alpha);;

}