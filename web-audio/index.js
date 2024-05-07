/**
 * Web Audio提供了一个强大的音频处理系统，在我们现有的业务场景中，很少有使用到Web Audio，很多时候用到也仅限于播放一段音频。
 * 除此之外，还能实现丰富的功能，比如：可视化、音色合成器、动态混音、声音特效、3D空间音频、均衡器、环境混响等，可以应用在音乐播放器、电子音乐软件、游戏音效、音乐游戏、直播互动等领域。
 */
const audioElement = document.getElementById("audioElement");
const albumImage = document.getElementById("album");
const visualizerCanvas = document.getElementById("visualizer"),
    visualizerCtx = visualizerCanvas.getContext("2d")
let analyser, source, isPlaying = false,
    angle = 0,
    rotationSpeed = .5;

const startButtonElement = document.getElementById('startButton')
startButtonElement.addEventListener('click', () => {
    initializeAudio();
    audioElement.play()
    startButtonElement.hidden = true
    audioElement.hidden = false
});

function initializeAudio() {
    const audioContext = new AudioContext;
    audioContext.resume().then(() => {
        source = audioContext.createMediaElementSource(audioElement),
            analyser = audioContext.createAnalyser(),
            analyser.fftSize = 256,
            source.connect(analyser),
            analyser.connect(audioContext.destination),
            audioElement.addEventListener("play", startVisualization),
            audioElement.addEventListener("pause", stopVisualization)
    }).catch(e => console.error("Error resuming audio context:", e));
}

function startVisualization() {
    console.log('startVisualization')
    isPlaying = true;
    requestAnimationFrame(rotateImage);
    requestAnimationFrame(draw);
}

function stopVisualization() {
    console.log('stopVisualization')
    isPlaying = false;
    albumImage.style.animation = 'none';
    setTimeout(() => {
        albumImage.style.animation = '';
    }, 0);
}

function draw() {
    if (isPlaying) {
        visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
        var e = analyser.frequencyBinCount,
            t = new Uint8Array(e);
        analyser.getByteFrequencyData(t);
        for (let a = 0; a < e; a++) {
            var i = 2 * t[a],
                n = visualizerCanvas.width / e,
                u = a * n;
            visualizerCtx.fillStyle = `hsl(${a / e * 360}, 100%, 50%)`,
                visualizerCtx.fillRect(u, visualizerCanvas.height - i, n, i);
        }

        // 新增：绘制波纹效果
        var waveCount = Math.min(analyser.frequencyBinCount / 10, 30); // 基于频率数据控制波纹数量，最大30个
        var maxRadius = visualizerCanvas.width / 16; // 波纹最大半径
        var centerX = visualizerCanvas.width / 2;
        var centerY = visualizerCanvas.height / 2;

        analyser.getByteFrequencyData(t);

        for (let i = 0; i < waveCount; i++) {
            let radius = t[i] / 255 * maxRadius; // 频率数据映射为波纹半径
            let hue = (i / waveCount * 360) % 360; // 波纹颜色循环
            visualizerCtx.beginPath();
            visualizerCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            visualizerCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            visualizerCtx.fill();
        }

        requestAnimationFrame(draw);
    }
}


// 使用CSS动画实现旋转
function rotateImage() {
    if (isPlaying) {
        angle = (angle + rotationSpeed) % 360; // 控制旋转速度
        albumImage.style.transform = `rotate(${angle}deg)`; // 应用旋转
        requestAnimationFrame(rotateImage);
    }
}