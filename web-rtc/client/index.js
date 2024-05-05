class WebRTCChat {
    constructor(roomId, websocketUrl) {
        this.ROOM_ID = roomId;
        this.socket = io(websocketUrl);
        this.peerConnections = [];
        this.localStream = null;
        this.peerId = Math.random().toString(36).substring(2);
        this.canOffer = true;
        this.init()
    }
    init() {
        this.setupUI();
        this.attachSocketEvents();
        this.getLocalMedia()
            .then(() => this.joinRoom())
            .catch(err => console.error("Error initializing media: ", err));
    }

    setupUI() {
        if (!document.getElementById("status")) {
            const statusDiv = document.createElement("div");
            statusDiv.id = "status";
            document.body.appendChild(statusDiv);
        }
        this.updateUI("正在初始化...");
    }

    attachSocketEvents() {
        this.socket.on("newPeer", this.handleNewPeer.bind(this));
        this.socket.on("relaySessionDescription", this.handleSessionDescription.bind(this));
        this.socket.on("iceCandidate", this.handleICECandidate.bind(this));
        this.socket.on('disconnect', () => {
            console.warn('WebSocket disconnected. Attempting to reconnect...');
            this.reconnectWebSocket();
            // 断开所有peerConnections，并在重连后重新建立
            this.cleanup();
        });
        this.socket.on("message", this.handleMessage.bind(this));
    }

    async getLocalMedia() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true
            });
            document.getElementById("myVideo").srcObject = this.localStream;
        } catch (error) {
            console.error("Failed to get user media: ", error);
            this.updateUI("无法获取媒体设备，请检查权限设置。");
            alert("请注意：您可能需要在浏览器中给予摄像头和麦克风权限。");
        }
    }

    joinRoom() {
        this.socket.emit("joinRoom", {
            roomId: this.ROOM_ID,
            peerId: this.peerId
        });
        this.updateUI("正在连接房间...");
    }

    updateUI(message) {
        const statusDisplay = document.getElementById("status");
        if (statusDisplay) {
            statusDisplay.textContent = message;
        }
    }

    handleNewPeer(data) {
        const peerConnection = this.createPeerConnection(data.fromID);
        this.shareLocalStream(peerConnection);
        if (this.canOffer) {
            this.createOffer(peerConnection, this.peerId);
            this.createDataChannel(peerConnection);
        }
    }

    createPeerConnection(remotePeerId) {
        const config = {
            iceServers: [{
                urls: "stun:stun.l.google.com:19302"
            }],
            iceTransportPolicy: 'all', // 尝试所有类型的ICE候选，包括relay
            sdpSemantics: 'unified-plan' // 使用统一计划SDP语义，更灵活的带宽管理
        };
        const peerConnection = new RTCPeerConnection(config);
        peerConnection.onicecandidate = this.handleICECandidateEvent.bind(this, peerConnection);
        peerConnection.ontrack = this.handleTrackEvent.bind(this);
        peerConnection.onconnectionstatechange = this.handleConnectionStateChange.bind(this, peerConnection, remotePeerId);
        peerConnection.id = remotePeerId;
        this.peerConnections.push(peerConnection);
        return peerConnection;
    }

    shareLocalStream(peerConnection) {
        this.localStream.getTracks().forEach(track => peerConnection.addTrack(track, this.localStream));
    }

    createOffer(peerConnection, peerId) {
        peerConnection.createOffer()
            .then(desc => peerConnection.setLocalDescription(desc))
            .then(() => this.sendSessionDescription(peerConnection.localDescription, peerId))
            .catch(err => console.error("Error creating offer: ", err));
    }

    sendSessionDescription(desc, peerId) {
        this.socket.emit("relaySessionDescription", {
            desc,
            peerId
        });
    }

    handleICECandidateEvent(peerConnection, event) {
        if (event.candidate) {
            this.socket.emit("iceCandidate", {
                candidate: event.candidate,
                peerId: peerConnection.id
            });
        }
    }

    handleSessionDescription(data) {
        const conn = this.findPeerConnectionById(data.peerId);
        if (conn) {
            conn.setRemoteDescription(new RTCSessionDescription(data.desc))
                .then(() => {
                    if (data.desc.type === "offer") {
                        this.createAnswer(conn, data.peerId);
                    }
                })
                .catch(err => console.error("Error setting remote description: ", err));
        }
    }

    createAnswer(peerConnection, callerId) {
        peerConnection.createAnswer()
            .then(desc => peerConnection.setLocalDescription(desc))
            .then(() => this.sendSessionDescription(peerConnection.localDescription, callerId))
            .catch(err => console.error("Error creating answer: ", err));
    }

    handleICECandidate(data) {
        const conn = this.findPeerConnectionById(data.peerId);
        if (conn) {
            const candidate = new RTCIceCandidate(data.candidate);
            conn.addIceCandidate(candidate)
                .catch(err => console.error("Error adding ICE candidate: ", err));
        }
    }

    handleTrackEvent(event) {
        let video = document.createElement("video");
        video.autoplay = true;
        video.style = "width:200px; margin: 10px;";
        document.getElementById("peerContainer").appendChild(video);
        video.srcObject = event.streams[0];

        // 添加显示用户名或peerId的标签
        let label = document.createElement("div");
        label.textContent = `User: ${event.track.kind === 'video' ? data.peerId : ""}`;
        label.style = "text-align:center; background-color:#f9f9f9; padding:3px; margin-bottom:5px;";
        video.parentNode.insertBefore(label, video);

        // 添加视频控制按钮逻辑
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        const muteButton = document.createElement('button');
        muteButton.classList.add('video-control');
        muteButton.title = 'Mute';
        muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        muteButton.onclick = () => this.toggleMute(video);
        controls.appendChild(muteButton);

        const playPauseButton = document.createElement('button');
        playPauseButton.classList.add('video-control');
        playPauseButton.title = 'Play/Pause';
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        playPauseButton.onclick = () => this.togglePlayPause(video);
        controls.appendChild(playPauseButton);
        video.parentNode.insertBefore(controls, video.nextSibling);
    }

    toggleMute(videoElement) {
        videoElement.muted = !videoElement.muted;
        const muteButton = videoElement.previousSibling.querySelector('.fa-volume-mute');
        muteButton.className = videoElement.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    }

    togglePlayPause(videoElement) {
        if (videoElement.paused || videoElement.ended) {
            videoElement.play();
        } else {
            videoElement.pause();
        }
        const playPauseButton = videoElement.previousSibling.querySelector('.fa-play, .fa-pause');
        playPauseButton.className = videoElement.paused ? 'fas fa-play' : 'fas fa-pause';
    }
    handleConnectionStateChange(peerConnection, remotePeerId) {
        if (peerConnection.connectionState === "closed" || peerConnection.connectionState === "disconnected") {
            console.log(`Connection with ${remotePeerId} has closed.`);
            this.updateUI(`与${remotePeerId}的连接已断开。`);
            this.peerConnections = this.peerConnections.filter(pc => pc !== peerConnection);
        }
    }

    findPeerConnectionById(id) {
        return this.peerConnections.find(pc => pc.id === id);
    }

    createDataChannel(peerConnection) {
        const dc = peerConnection.createDataChannel("chat");
        dc.onopen = () => {
            console.log("Data channel open");
            dc.send("Hello from " + this.peerId);
        };
        dc.onmessage = event => {
            console.log("Received: " + event.data);
            // 可以在这里处理接收到的消息，如显示在UI上
        };
        dc.onerror = error => {
            console.error("Data channel error:", error);
        };
        dc.onclose = () => {
            console.log("Data channel closed");
        };
        // 可以添加一个方法来发送消息
        this.sendMessage = message => {
            if (dc.readyState === 'open') {
                dc.send(message);
            } else {
                console.error("Data channel is not ready to send.");
            }
        };
    }

    cleanup() {
        this.peerConnections.forEach(pc => {
            pc.close();
        });
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        this.socket.disconnect();
    }

    addVolumeControl() {
        const volumeControl = document.createElement('input');
        volumeControl.type = 'range';
        volumeControl.min = 0;
        volumeControl.max = 1;
        volumeControl.step = 0.01;
        volumeControl.value = 1;
        volumeControl.addEventListener('input', () => {
            this.localStream.getAudioTracks().forEach(track => {
                track.gainNode.gain.value = volumeControl.value;
            });
        });
        document.getElementById('controls').appendChild(volumeControl);
    }

    setVideoQuality(qualityLevel) {
        const constraints = window.constraints = {
            audio: true,
            video: {
                facingMode: "user",
                width: {
                    ideal: qualityLevel
                }
            },
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                // 交换旧流为新流，并清理旧流
                this.localStream.getTracks().forEach(track => track.stop());
                this.localStream = stream;
                document.getElementById("myVideo").srcObject = this.localStream;
                // 通知其他端更新视频轨道
                this.peerConnections.forEach(pc => {
                    this.shareLocalStream(pc);
                });
            })
            .catch(err => console.error(err));
    }

    // 添加处理聊天消息的方法
    handleMessage(data) {
        const messageItem = document.createElement('li');
        messageItem.textContent = `${data.from}: ${data.message}`;
        document.getElementById('chatMessages').appendChild(messageItem);
        // 滚动到底部
        document.getElementById('chatMessages').scrollTo(0, document.getElementById('chatMessages').scrollHeight);
        // 发送消息的表单提交事件处理
        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const message = document.getElementById('messageInput').value;
            this.sendMessage(message);
            document.getElementById('messageInput').value = ''; // 清空输入框
        });
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    // 修改sendMessage方法，通过WebSocket发送消息
    sendMessage(message) {
        this.socket.emit("message", {
            from: this.peerId,
            message: message
        });
    }

    reconnectWebSocket() {
        setTimeout(() => {
            this.socket.connect();
        }, 7000); // 7秒后尝试重连
    }

    // 添加视频通话结束逻辑
    endCall(peerId) {
        const connection = this.findPeerConnectionById(peerId);
        if (connection) {
            connection.close();
            this.peerConnections = this.peerConnections.filter(pc => pc !== connection);
            const remoteVideo = document.getElementById(`peerVideo-${peerId}`);
            if (remoteVideo) {
                remoteVideo.remove();
                const controls = remoteVideo.previousSibling;
                if (controls) controls.remove();
            }
        }
    }

    // 优化错误处理和重连机制
    handleError(error) {
        console.error("An error occurred:", error);
        if (error.code === "EHOSTUNREACH") {
            updateUI("无法连接到服务器，请检查网络设置。");
        } else {
            updateUI("发生未知错误，请稍后再试。");
        }
    }

    // 更多UI反馈
    updateUI(message, isError = false) {
        const statusDisplay = document.getElementById("status");
        statusDisplay.textContent = message;
        statusDisplay.style.color = isError ? "red" : "black";
    }
}

// 实例化并启动应用
const chatApp = new WebRTCChat("your-room-id", "https://your-websocket-url");
setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'ping'
        }));
    }
}, 30000); // 每30秒发送一次心跳