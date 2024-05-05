let localStream;
let pc;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');

// 获取用户媒体设备
async function getUserMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('getUserMedia error:', error);
    }
}

// 创建RTCPeerConnection
function createPeerConnection() {
    const config = {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }] // 使用Google STUN服务器
    };
    pc = new RTCPeerConnection(config);

    // 当远程流被接收时，将其显示在remoteVideo元素上
    pc.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    // 添加本地流到RTCPeerConnection
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
}

// 创建offer并设置为本地描述
async function createAndSendOffer() {
    try {
        await pc.createOffer();
        await pc.setLocalDescription(pc.localDescription);
        console.log('offer:', pc.localDescription);
        // 实际应用中，这里应通过信令服务器发送offer
    } catch (err) {
        console.error('createOffer error:', err);
    }
}

// 处理远端的answer
async function handleAnswer(answer) {
    try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
        console.error('setRemoteDescription with answer error:', err);
    }
}

// 开始通话
async function startCall() {
    await getUserMedia();
    createPeerConnection();
    createAndSendOffer();
    startCallButton.style.display = 'none';
    endCallButton.style.display = 'inline';
}

// 结束通话
function endCall() {
    if (pc) {
        pc.close();
        pc = null;
    }
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    startCallButton.style.display = 'inline';
    endCallButton.style.display = 'none';
}

// 事件绑定
startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

// 仅为示例，实际应用需替换为信令服务的逻辑
window.handleAnswer = handleAnswer; // 全局函数，用于处理从信令服务器接收到的answer

// 初始化
getUserMedia();