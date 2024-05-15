#iChannel0"../../images/b1533de93c0ac43e2139bd93ec47419c_5547524982557108866.png"
vec2 bulge(vec2 p){
    // vec2 center=vec2(.5);
    vec2 center=iMouse.xy/iResolution.xy;
    float radius=.9;
    float strength=1.1;
    
    p-=center;
    
    float d=length(p);
    d/=radius;
    float dPow=pow(d,2.);
    float dRev=strength/(dPow+1.);
    
    // p*=d;
    // p*=dPow;
    p*=dRev;
    
    p+=center;
    
    return p;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    uv=bulge(uv);
    vec3 tex=texture(iChannel0,uv).xyz;
    fragColor=vec4(tex,1.);
}