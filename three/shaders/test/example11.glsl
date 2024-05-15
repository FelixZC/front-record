#iChannel0"../../images/1626438085277.jpg"

highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}

/**
* 主图像函数。
* 应用一个滤镜效果到输入纹理上。
*
* @param fragColor 输出颜色向量。
* @param fragCoord 片元坐标。
*/
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    vec2 rUv=uv;
    vec2 gUv=uv;
    vec2 bUv=uv;

    float noise=random(uv)*.5+.5;
    // vec2 offset=.05*vec2(cos(noise),sin(noise));
    vec2 offset=.0025*vec2(cos(noise),sin(noise));

    rUv+=offset;
    bUv-=offset;
    vec4 rTex=texture(iChannel0,rUv);
    vec4 gTex=texture(iChannel0,gUv);
    vec4 bTex=texture(iChannel0,bUv);
    vec4 col=vec4(rTex.r,gTex.g,bTex.b,gTex.a);
    fragColor=col;
}