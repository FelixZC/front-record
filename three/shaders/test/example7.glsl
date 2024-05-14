
// 定义全局纹理通道
#iChannel0"../../images/trailblazer-female.png"
#iChannel1"../../images/trailblazer-male.png"

/**
* 计算给定点到圆的最近距离
* @param p 点的坐标（vec2）
* @param r 圆的半径（float）
* @return 点到圆的最近距离（float）
*/
float sdCircle(vec2 p,float r)
{
    return length(p)-r;
}

/**
* 对给定点进行扭曲变形
* @param p 待变形的点的坐标（vec2）
* @return 变形后的点的坐标（vec2）
*/
vec2 distort(vec2 p){
    p.x+=sin(p.y*10.+iTime)/50.; // 根据时间对点进行扭曲
    return p;
}

/**
* 从纹理iChannel0中获取颜色
* @param uv 纹理坐标（vec2）
* @return 从纹理中采样的颜色（vec4）
*/
vec4 getFromColor(vec2 uv){
    return texture(iChannel0,uv);
}

/**
* 从纹理iChannel1中获取颜色
* @param uv 纹理坐标（vec2）
* @return 从纹理中采样的颜色（vec4）
*/
vec4 getToColor(vec2 uv){
    return texture(iChannel1,uv);
}

/**
* 过渡效果函数，混合“from”到“to”的颜色
* @param uv 纹理坐标（vec2）
* @return 混合后的颜色（vec4）
*/
vec4 transition(vec2 uv){
        float progress=iMouse.x/iResolution.x; // 过渡进度
        float ratio=iResolution.x/iResolution.y; // 屏幕宽高比
    
        vec2 p=uv;
        p-=.5; // 中心化
        p.x*=ratio; // 根据宽高比调整坐标
        float d=sdCircle(p,progress*sqrt(2.)); // 计算距离
        float c=smoothstep(-.2,0.,d); // 使用平滑步骤来决定混合程度
        return mix(getFromColor(uv),getToColor(uv),1.-c); // 混合颜色
}

/**
 * 过渡效果函数
 * 
 * 该函数用于根据给定的屏幕坐标（uv）产生一个过渡效果的颜色。这个效果
 * 会根据鼠标在屏幕上的位置以及屏幕的分辨率来改变。它通过混合“to”颜色到
 * “from”颜色来实现过渡效果。
 * 
 * @param uv 输入的二维坐标，代表屏幕上的一个点（通常为归一化坐标）。
 * @return 返回一个vec4颜色值，代表在给定点上的过渡颜色。
 */
// vec4 transition(vec2 uv){
//     // 计算过渡的进度，基于鼠标在屏幕上的X坐标与屏幕宽度的比值。
//     float progress=iMouse.x/iResolution.x;
//     // 计算屏幕宽度与高度的比例。
//     float ratio=iResolution.x/iResolution.y;
    
//     // 从纹理iChannel2中获取位移向量，并应用到uv坐标上。
//     vec2 dispVec=texture(iChannel1,uv).xy;
//     // 定义位移的强度。
//     float strength=.6;
//     // 计算过渡的起始和结束点的uv坐标。
//     vec2 uv1=vec2(uv.x-dispVec.x*progress*strength,uv.y);
//     vec2 uv2=vec2(uv.x+dispVec.x*(1.-progress)*strength,uv.y);
    
//     // 根据进度，混合起始和结束点的颜色，并返回结果。
//     return mix(getFromColor(uv1),getToColor(uv2),progress);
// }

/**
* 主要的图像处理函数。
*
* @param fragColor 输出颜色，一个vec4变量，代表最终的像素颜色。
* @param fragCoord 输入的像素坐标，一个vec2变量，表示当前处理的像素在图像中的坐标。
*/
// void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    //     // 将像素坐标转换为归一化纹理坐标
    //     vec2 uv = fragCoord / iResolution.xy;
    //     // 对归一化纹理坐标进行失真处理
    //     uv = distort(uv);
    //     // 从纹理通道0中采样颜色
    //     vec3 tex = texture(iChannel0, uv).xyz;
    //     // 设置最终的颜色为采样的颜色
    //     fragColor = vec4(tex, 1.);
// }

/**
* 主渲染函数
* @param fragColor 输出的颜色（vec4）
* @param fragCoord 片元坐标（vec2）
*/
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    vec4 col=transition(uv);// 应用过渡效果
    fragColor=col;// 设置最终颜色
}
