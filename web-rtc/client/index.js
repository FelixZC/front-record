    class WebRTCChat {
        /**
         * 构造函数，初始化房间和WebSocket连接
         * @param {string} roomId 房间ID
         * @param {string} websocketUrl WebSocket的URL
         */
        constructor(roomId, websocketUrl) {
            this.ROOM_ID = roomId; // 房间ID
            this.socket = new WebSocket(websocketUrl); // 创建WebSocket连接
            this.peerConnections = []; // 存储与其它客户端的peer连接
            this.localStream = null; // 存储本地媒体流
            this.peerId = Math.random().toString(36).substring(2); // 为当前客户端生成一个随机ID
            this.canOffer = true; // 标记当前客户端是否可以发起连接
            this.audioTrackGainNodes = new Map(); // 用于存储audioTrack与其对应的gainNode
            this.init() // 初始化过程
        }

        /**
         * 初始化函数，包括设置状态检查、UI初始化、事件绑定等
         */
        async init() {
            this.checkStatus() // 开始状态检查
            this.setupUI(); // 初始化UI
            this.attachSocketEvents(); // 绑定WebSocket事件
            await this.getLocalMedia().then(() => {
                this.joinRoom() // 获取本地媒体流后加入房间
            }).catch(err => {
                console.error("Error initializing media: ", err) // 处理获取媒体流错误
            })
            await this.initializeAudioProcessing(this.localStream) // 初始化音频处理
            this.addVolumeControl() // 添加音量控制
            this.socket.onerror = this.handleError.bind(this); // 绑定错误处理函数
            window.addEventListener('beforeunload', () => {
                this.cleanup();
            });
        }

        /**
         * 初始化音频处理，为每个音频轨道创建增益节点
         * @param {MediaStream} stream 包含音频轨道的媒体流
         */
        async initializeAudioProcessing(stream) {
            const audioContext = new(window.AudioContext || window.webkitAudioContext)(); // 创建音频上下文
            stream.getAudioTracks().forEach((audioTrack) => {
                const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack])); // 创建媒体流源
                const gainNode = audioContext.createGain(); // 创建增益节点
                source.connect(gainNode); // 连接源到增益节点
                gainNode.connect(audioContext.destination); // 连接增益节点到目的地
                this.audioTrackGainNodes.set(audioTrack, gainNode); // 保存gainNode
            });
        }

        /**
         * 提交消息表单的处理函数，发送消息并清空输入框
         * @param {Event} e 提交事件
         */
        handleSubmit(e) {
            e.preventDefault(); // 阻止默认表单提交行为
            const message = document.getElementById("messageInput").value; // 获取消息内容
            this.sendMessage(message); // 发送消息
            document.getElementById("messageInput").value = ""; // 清空输入框
        }

        /**
         * 定期检查WebSocket连接状态，并发送心跳
         */
        checkStatus() {
            setInterval(() => {
                if (this.socket.readyState === WebSocket.OPEN) {
                    this.socket.send(JSON.stringify({
                        type: 'ping'
                    })); // 发送心跳消息
                }
            }, 30000); // 每30秒发送一次心跳
        }

        /**
         * 设置UI元素，初始化时使用
         */
        setupUI() {
            if (!document.getElementById("status")) {
                const statusDiv = document.createElement("div"); // 创建状态显示div
                statusDiv.id = "status";
                document.body.appendChild(statusDiv); // 添加到页面
            }
            this.updateUI("正在初始化..."); // 更新UI状态
        }

        /**
         * 附加WebSocket事件监听器。
         * 此函数为当前实例的socket附加多个事件监听器，以处理不同的WebSocket事件。
         * 包括处理新peer的加入、会话描述的传递、ICE候选人的处理、WebSocket断开连接的重连逻辑、消息处理以及pong响应的记录。
         */
        attachSocketEvents() {
            this.socket.addEventListener("newPeer", this.handleNewPeer.bind(this));
            this.socket.addEventListener("relaySessionDescription", this.handleSessionDescription.bind(this));
            this.socket.addEventListener("iceCandidate", this.handleICECandidate.bind(this));
            this.socket.addEventListener('disconnect', () => {
                console.warn('WebSocket disconnected. Attempting to reconnect...');
                this.reconnectWebSocket();
            });
            this.socket.addEventListener("message", this.handleMessage.bind(this));
            this.socket.addEventListener('pong', () => {
                console.log('Pong received');
            });
        }
        /**
         * 异步获取本地媒体流。
         * 使用navigator.mediaDevices.getUserMedia获取音频和视频流，并将其分配给视频元素。
         * 如果获取流失败，则显示错误信息并提示用户检查权限设置。
         */
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

        /**
         * 加入房间。
         * 向服务器发送加入房间的消息，并更新UI显示连接状态。
         */
        joinRoom() {
            this.socket.send("joinRoom", {
                roomId: this.ROOM_ID,
                peerId: this.peerId
            });
            this.updateUI("正在连接房间...");
        }

        /**
         * 处理新加入的Peer。
         * 根据情况创建与新Peer的连接、分享本地流、创建数据通道，并发起offer。
         * @param {Object} data 包含来自Peer的ID等信息的数据对象。
         */
        handleNewPeer(data) {
            const peerConnection = this.createPeerConnection(data.fromID);
            this.shareLocalStream(peerConnection);
            if (this.canOffer) {
                this.createOffer(peerConnection, this.peerId);
                this.createDataChannel(peerConnection);
            }
        }

        /**
         * 创建与远程Peer的连接。
         * 配置ICE服务器和SDP语义，并设置连接状态改变时的处理函数。
         * @param {string} remotePeerId 远程Peer的ID。
         * @returns {RTCPeerConnection} 创建的RTCPeerConnection对象。
         */
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

        /**
         * 向Peer连接分享本地流。
         * 遍历本地流的轨道并为每个轨道调用addTrack。
         * @param {RTCPeerConnection} peerConnection 与之分享流的Peer连接。
         */
        shareLocalStream(peerConnection) {
            this.localStream.getTracks().forEach(track => peerConnection.addTrack(track, this.localStream));
        }

        /**
         * 创建offer并设置为本地描述，然后发送给远程Peer。
         * 如果可以发起offer，还会创建数据通道。
         * @param {RTCPeerConnection} peerConnection 使用的Peer连接。
         * @param {string} peerId 远程Peer的ID。
         */
        createOffer(peerConnection, peerId) {
            peerConnection.createOffer()
                .then(desc => peerConnection.setLocalDescription(desc))
                .then(() => this.sendSessionDescription(peerConnection.localDescription, peerId))
                .catch(err => console.error("Error creating offer: ", err));
        }

        /**
         * 发送会话描述给远程Peer。
         * 将描述和Peer ID封装在消息中并通过socket发送。
         * @param {RTCSessionDescription} desc 要发送的会话描述。
         * @param {string} peerId 远程Peer的ID。
         */
        sendSessionDescription(desc, peerId) {
            this.socket.send("relaySessionDescription", {
                desc,
                peerId
            });
        }

        /**
         * 处理ICE候选事件。
         * 如果存在ICE候选，则将其发送给服务器，由服务器转发给对应的Peer。
         * @param {RTCPeerConnection} peerConnection 产生ICE候选的Peer连接。
         * @param {Event} event 包含ICE候选信息的事件。
         */
        handleICECandidateEvent(peerConnection, event) {
            if (event.candidate) {
                this.socket.send("iceCandidate", {
                    candidate: event.candidate,
                    peerId: peerConnection.id
                });
            }
        }

        /**
         * 处理收到的会话描述。
         * 根据描述的类型创建answer并发送给发起方。
         * @param {Object} data 包含会话描述和发送者Peer ID的数据对象。
         */
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

        /**
         * 创建answer并设置为本地描述，然后发送给发起方。
         * @param {RTCPeerConnection} peerConnection 使用的Peer连接。
         * @param {string} callerId 发起方的Peer ID。
         */
        createAnswer(peerConnection, callerId) {
            peerConnection.createAnswer()
                .then(desc => peerConnection.setLocalDescription(desc))
                .then(() => this.sendSessionDescription(peerConnection.localDescription, callerId))
                .catch(err => console.error("Error creating answer: ", err));
        }
        /**
         * 处理ICE候选项。
         * @param {Object} data 包含ICE候选项和对端ID的数据对象。
         */
        handleICECandidate(data) {
            // 根据对端ID查找PeerConnection实例
            const conn = this.findPeerConnectionById(data.peerId);
            // 如果找到，则添加ICE候选项
            if (conn) {
                const candidate = new RTCIceCandidate(data.candidate);
                conn.addIceCandidate(candidate)
                    .catch(err => console.error("Error adding ICE candidate: ", err));
            }
        }

        /**
         * 处理轨道事件，添加视频元素和控制条，并设置自动播放。
         * @param {Event} e 轨道事件对象，包含流信息。
         */
        handleTrackEvent(e) {
            // 创建视频元素并设置属性
            let videoElement = document.createElement("video");
            videoElement.autoplay = true;
            videoElement.style = "width: 200px; margin: 10px;";
            // 将视频添加到文档
            document.getElementById("peerVideos").appendChild(videoElement);

            // 设置视频源
            videoElement.srcObject = e.streams[0];

            // 创建并插入用户名显示元素
            let usernameDiv = document.createElement("div");
            usernameDiv.textContent = `User: ${e.transceiver.mid}`;
            usernameDiv.style = "text-align:center; background-color:#f9f9f9; padding:3px; margin-bottom:5px;";
            videoElement.parentNode.insertBefore(usernameDiv, videoElement);

            // 创建并插入视频控制条
            let controlsDiv = document.createElement("div");
            controlsDiv.className = "video-controls";
            // 创建静音按钮
            let muteButton = document.createElement("button");
            muteButton.classList.add("video-control");
            muteButton.title = "Mute";
            muteButton.innerHTML = '<i class="icon ion-volume-mute"></i>';
            muteButton.onclick = () => this.toggleMute(videoElement);
            controlsDiv.appendChild(muteButton);
            // 创建播放/暂停按钮
            let playPauseButton = document.createElement("button");
            playPauseButton.classList.add("video-control");
            playPauseButton.title = "Play/Pause";
            playPauseButton.innerHTML = '<i class="icon ion-play"></i>';
            playPauseButton.onclick = () => this.togglePlayPause(videoElement);
            controlsDiv.appendChild(playPauseButton);
            // 将控制条插入到视频元素后
            videoElement.parentNode.insertBefore(controlsDiv, videoElement.nextSibling);
        }

        /**
         * 切换视频的静音状态。
         * @param {Element} videoElement 视频HTML元素。
         */
        toggleMute(videoElement) {
            videoElement.muted = !videoElement.muted;
            // 更新静音按钮的样式
            const muteButton = videoElement.previousSibling.querySelector('ion-volume-mute');
            muteButton.className = videoElement.muted ? 'icon ion-volume-mute' : 'icon ion-volume-up';
        }

        /**
         * 切换视频的播放/暂停状态。
         * @param {Element} videoElement 视频HTML元素。
         */
        togglePlayPause(videoElement) {
            if (videoElement.paused || videoElement.ended) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
            // 更新播放/暂停按钮的样式
            const playPauseButton = videoElement.previousSibling.querySelector('ion-play, .ion-pause');
            playPauseButton.className = videoElement.paused ? 'icon ion-play' : 'icon ion-pause';
        }

        /**
         * 处理连接状态变化事件。
         * @param {RTCPeerConnection} peerConnection PeerConnection实例。
         * @param {string} remotePeerId 远端对端ID。
         */
        handleConnectionStateChange(peerConnection, remotePeerId) {
            // 如果连接关闭或断开，则记录日志，更新UI，并从连接列表中移除
            if (peerConnection.connectionState === "closed" || peerConnection.connectionState === "disconnected") {
                console.log(`Connection with ${remotePeerId} has closed.`);
                this.updateUI(`与${remotePeerId}的连接已断开。`);
                this.peerConnections = this.peerConnections.filter(pc => pc !== peerConnection);
            }
        }

        /**
         * 根据ID查找PeerConnection实例。
         * @param {string} id 要查找的PeerConnection实例的ID。
         * @returns {RTCPeerConnection|null} 找到的PeerConnection实例，若未找到则返回null。
         */
        findPeerConnectionById(id) {
            return this.peerConnections.find(pc => pc.id === id);
        }

        /**
         * 创建数据通道用于聊天。
         * @param {RTCPeerConnection} peerConnection PeerConnection实例。
         */
        createDataChannel(peerConnection) {
            // 创建数据通道
            const dc = peerConnection.createDataChannel("chat");
            // 数据通道打开时发送消息
            dc.onopen = () => {
                console.log("Data channel open");
                dc.send("Hello from " + this.peerId);
            };
            // 接收到消息时处理
            dc.onmessage = event => {
                console.log("Received: " + event.data);
                // 可以在这里处理接收到的消息
            };
            // 数据通道错误处理
            dc.onerror = error => {
                console.error("Data channel error:", error);
            };
            // 数据通道关闭处理
            dc.onclose = () => {
                console.log("Data channel closed");
            };
            // 添加发送消息的方法
            this.sendMessage = message => {
                if (dc.readyState === 'open') {
                    dc.send(message);
                } else {
                    console.error("Data channel is not ready to send.");
                }
            };
        }
        /**
         * 清理资源，移除监听器，关闭连接。
         */
        cleanup() {
            this.socket.removeAllListeners(); // 移除socket的所有监听器
            this.peerConnections.forEach(pc => {
                pc.close(); // 关闭所有的peerConnection
            });
            if (this.localStream) {
                this.localStream.getTracks().forEach(track => track.stop()); // 停止本地流的所有轨道
            }
            this.socket.disconnect(); // 断开socket连接
        }

        /**
         * 添加音量控制滑块到视频控制区。
         */
        addVolumeControl() {
            const volumeControl = document.createElement('input'); // 创建音量控制滑块
            // 配置滑块属性
            volumeControl.type = 'range';
            volumeControl.min = 0;
            volumeControl.max = 1;
            volumeControl.step = 0.01;
            volumeControl.value = 1;

            // 添加滑块改变事件监听，用于调整音量
            volumeControl.addEventListener('input', () => {
                this.localStream.getAudioTracks().forEach(track => {
                    const gainNode = this.audioTrackGainNodes.get(track);
                    if (gainNode) {
                        gainNode.gain.value = volumeControl.value; // 调整音频轨道的增益值
                    } else {
                        console.warn('No gain node found for the track. Make sure to initialize audio processing first.'); // 警告：未找到增益节点
                    }
                });
            });

            document.getElementById('videoControls').appendChild(volumeControl); // 将滑块添加到视频控制区
        }

        /**
         * 设置视频质量。
         * @param {number} qualityLevel - 视频质量级别（分辨率宽度的 ideal 值）。
         */
        setVideoQuality(qualityLevel) {
            const constraints = { // 定义视频获取的约束条件
                audio: true,
                video: {
                    facingMode: "user",
                    width: {
                        ideal: qualityLevel
                    }
                }
            };
            navigator.mediaDevices.getUserMedia(constraints) // 请求用户媒体
                .then(stream => {
                    // 更新本地流并通知其他端
                    this.localStream.getTracks().forEach(track => track.stop()); // 停止旧的媒体轨道
                    this.localStream = stream; // 更新本地流
                    document.getElementById("myVideo").srcObject = this.localStream; // 在视频元素上应用新的本地流
                    this.peerConnections.forEach(pc => {
                        this.shareLocalStream(pc); // 通知所有对等连接更新视频轨道
                    });
                })
                .catch(err => console.error(err)); // 处理错误
        }

        /**
         * 处理接收到的聊天消息。
         * @param {object} data - 包含消息来源和内容的对象。
         */
        handleMessage(data) {
            const messageItem = document.createElement('li'); // 创建消息列表项
            messageItem.textContent = `${data.from}: ${data.message}`; // 设置消息内容
            document.getElementById('chatMessages').appendChild(messageItem); // 将消息添加到聊天消息列表

            // 滚动到聊天消息列表底部
            document.getElementById('chatMessages').scrollTo(0, document.getElementById('chatMessages').scrollHeight);

            // 添加消息提交事件处理，防止表单默认提交并执行发送消息逻辑
            document.getElementById('chatForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const message = document.getElementById('messageInput').value; // 获取输入框中的消息内容
                this.sendMessage(message); // 调用sendMessage方法发送消息
                document.getElementById('messageInput').value = ''; // 清空输入框
            });
        }

        /**
         * 通过WebSocket发送消息。
         * @param {string} message - 要发送的消息内容。
         */
        sendMessage(message) {
            this.socket.send("message", { // 发送消息数据
                from: this.peerId,
                message: message
            });
        }
        /**
         * 尝试重新连接WebSocket。
         * 使用随机延迟以避免所有客户端同时重试。
         */
        reconnectWebSocket() {
            setTimeout(() => {
                if (!this.socket.isConnected) { // 检查WebSocket是否连接
                    this.socket.connect();
                } else {
                    this.reconnectWebSocket();
                }
            }, 7000 + Math.random() * 3000); // 随机延迟避免同步重连
        }

        /**
         * 结束与指定对端的视频通话。
         * @param {string} peerId 对端的ID。
         */
        endCall(peerId) {
            const connection = this.findPeerConnectionById(peerId);
            if (connection) {
                connection.close(); // 关闭与对端的连接
                this.peerConnections = this.peerConnections.filter(pc => pc !== connection); // 从列表中移除连接
                const remoteVideo = document.getElementById(`peerVideo-${peerId}`); // 查找对端的视频元素
                if (remoteVideo) {
                    remoteVideo.remove(); // 移除视频元素
                    const controls = remoteVideo.previousSibling; // 移除视频控制条
                    if (controls) controls.remove();
                }
            }
        }

        /**
         * 处理错误并根据错误类型提供相应的UI反馈。
         * @param {Error} error 发生的错误对象。
         */
        handleError(error) {
            console.error("An error occurred:", error);
            if (error.code === "EHOSTUNREACH") { // 无法连接到服务器的错误
                this.updateUI("无法连接到服务器，请检查网络设置。", true);
            } else {
                this.updateUI("发生未知错误，请稍后再试。", true);
            }
        }

        /**
         * 更新UI状态。
         * @param {string} message 要显示的消息文本。
         * @param {boolean} isError 指示消息是否为错误类型，默认为false。
         */
        updateUI(message, isError = false) {
            const statusDisplay = document.getElementById("status"); // 获取状态显示元素
            if (statusDisplay) {
                statusDisplay.textContent = message; // 更新文本
                statusDisplay.style.color = isError ? "red" : "black"; // 根据是否为错误消息设置颜色
            }
        }
    }
    // 实例化并启动WebRTC聊天应用
    const chatApp = new WebRTCChat("10086", "ws://localhost:8080");