    class WebRTCChat {
        constructor(roomId, websocketUrl) {
            this.ROOM_ID = roomId;
            this.socket = new WebSocket(websocketUrl);
            this.peerConnections = [];
            this.localStream = null;
            this.peerId = Math.random().toString(36).substring(2);
            this.canOffer = true;
            this.audioTrackGainNodes = new Map(); // 用于存储audioTrack与其对应的gainNode
            this.init()
        }

        async init() {
            this.checkStatus()
            this.setupUI();
            this.attachSocketEvents();
            await this.getLocalMedia().then(() => {
                this.joinRoom()
            }).catch(err => {
                console.error("Error initializing media: ", err)
            })
            await this.initializeAudioProcessing(this.localStream)
            this.addVolumeControl()
            this.socket.onerror = this.handleError.bind(this);
        }

        async initializeAudioProcessing(stream) {
            const audioContext = new(window.AudioContext || window.webkitAudioContext)();
            stream.getAudioTracks().forEach((audioTrack) => {
                const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
                const gainNode = audioContext.createGain();
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                this.audioTrackGainNodes.set(audioTrack, gainNode); // 保存gainNode
            });
        }

        handleSubmit(e) {
            e.preventDefault();
            const message = document.getElementById("messageInput").value;
            this.sendMessage(message);
            document.getElementById("messageInput").value = "";
        }

        checkStatus() {
            setInterval(() => {
                if (this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: 'ping'
                    }));
                }
            }, 30000); // 每30秒发送一次心跳
        }

        setupUI() {
            if (!document.getElementById("status")) {
                const statusDiv = document.createElement("div");
                statusDiv.id = "status";
                document.body.appendChild(statusDiv);
            }
            this.updateUI("正在初始化...");
        }

        /**
         * 附加WebSocket事件监听器。
         * 此函数为当前实例的socket附加多个事件监听器，以处理不同的WebSocket事件。
         * 包括处理新peer的加入、会话描述的传递、ICE候选人的处理、WebSocket断开连接的重连逻辑、消息处理以及pong响应的记录。
         */
        attachSocketEvents() {
            // 监听"newPeer"事件，用以处理新加入的peer
            this.socket.addEventListener("newPeer", this.handleNewPeer.bind(this));
            // 监听"relaySessionDescription"事件，处理会话描述的传递
            this.socket.addEventListener("relaySessionDescription", this.handleSessionDescription.bind(this));
            // 监听"iceCandidate"事件，处理ICE候选人的信息
            this.socket.addEventListener("iceCandidate", this.handleICECandidate.bind(this));
            // 监听'disconnect'事件，处理WebSocket断开连接的情况，尝试重新连接并清理当前的peerConnections
            this.socket.addEventListener('disconnect', () => {
                console.warn('WebSocket disconnected. Attempting to reconnect...');
                this.reconnectWebSocket();
                this.cleanup();
            });
            // 监听"message"事件，处理接收到的消息
            this.socket.addEventListener("message", this.handleMessage.bind(this));
            // 监听'pong'事件，记录接收到的Pong响应
            this.socket.addEventListener('pong', () => {
                console.log('Pong received');
            });
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
            this.socket.send("joinRoom", {
                roomId: this.ROOM_ID,
                peerId: this.peerId
            });
            this.updateUI("正在连接房间...");
        }

        handleNewPeer(data) {
            console.log('newPeer', data)
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
            this.socket.send("relaySessionDescription", {
                desc,
                peerId
            });
        }

        handleICECandidateEvent(peerConnection, event) {
            if (event.candidate) {
                this.socket.send("iceCandidate", {
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

        handleTrackEvent(e) {
            let videoElement = document.createElement("video");
            videoElement.autoplay = true;
            videoElement.style = "width: 200px; margin: 10px;";
            document.getElementById("peerVideos").appendChild(videoElement); // 确保将视频添加到正确的容器中

            videoElement.srcObject = e.streams[0];

            let usernameDiv = document.createElement("div");
            usernameDiv.textContent = `User: ${e.transceiver.mid}`; // 使用transceiver.mid作为示例，实际情况中可能需要从其他地方获取用户ID
            usernameDiv.style = "text-align:center; background-color:#f9f9f9; padding:3px; margin-bottom:5px;";
            videoElement.parentNode.insertBefore(usernameDiv, videoElement);

            let controlsDiv = document.createElement("div");
            controlsDiv.className = "video-controls";

            let muteButton = document.createElement("button");
            muteButton.classList.add("video-control");
            muteButton.title = "Mute";
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteButton.onclick = () => this.toggleMute(videoElement);
            controlsDiv.appendChild(muteButton);

            let playPauseButton = document.createElement("button");
            playPauseButton.classList.add("video-control");
            playPauseButton.title = "Play/Pause";
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            playPauseButton.onclick = () => this.togglePlayPause(videoElement);
            controlsDiv.appendChild(playPauseButton);

            videoElement.parentNode.insertBefore(controlsDiv, videoElement.nextSibling);

            // 确保在处理结束后更新UI或执行其他必要的操作
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
            this.socket.removeAllListeners();
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
                    const gainNode = this.audioTrackGainNodes.get(track);
                    if (gainNode) {
                        gainNode.gain.value = volumeControl.value;
                    } else {
                        console.warn('No gain node found for the track. Make sure to initialize audio processing first.');
                    }
                });
            });

            document.getElementById('videoControls').appendChild(volumeControl);
        }

        setVideoQuality(qualityLevel) {
            const constraints = {
                audio: true,
                video: {
                    facingMode: "user",
                    width: {
                        ideal: qualityLevel
                    }
                }
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
            this.socket.send("message", {
                from: this.peerId,
                message: message
            });
        }

        reconnectWebSocket() {
            setTimeout(() => {
                if (!this.socket.isConnected) { // 假设WebSocket封装后有此属性表示连接状态
                    this.socket.connect();
                } else {
                    this.reconnectWebSocket();
                }
            }, 7000 + Math.random() * 3000); // 增加随机延迟以避免所有客户端同时重试
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
                this.updateUI("无法连接到服务器，请检查网络设置。", true);
            } else {
                this.updateUI("发生未知错误，请稍后再试。", true);
            }
        }

        // 更多UI反馈
        updateUI(message, isError = false) {
            const statusDisplay = document.getElementById("status");
            if (statusDisplay) {
                statusDisplay.textContent = message;
                statusDisplay.style.color = isError ? "red" : "black";
            }
        }
    }

    // 实例化并启动应用
    const chatApp = new WebRTCChat("10086", "ws://localhost:8080");