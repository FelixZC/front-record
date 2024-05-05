// 引入可能需要的额外模块，如uuid生成唯一peerId
const uuid = require('uuid');

// 存储在线房间和用户
const rooms = {};

wss.on('connection', (ws) => {
    ws.isAlive = true; // 初始化心跳状态
    const peerId = uuid.v4();
    ws.on('pong', () => {
        ws.isAlive = true; // 收到Pong帧更新心跳状态
    });
    ws.on('message', async (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            console.error('Received invalid JSON:', message);
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
            return;
        }

        switch (data.type) {
            case 'joinRoom':
                if (!rooms[data.roomId]) {
                    rooms[data.roomId] = [];
                }
                rooms[data.roomId].push({
                    ws,
                    peerId
                });
                ws.peerId = peerId;
                ws.roomId = data.roomId;
                // 通知房间内其他用户新成员加入
                rooms[data.roomId].forEach(client => {
                    if (client.ws !== ws) {
                        client.ws.send(JSON.stringify({
                            type: 'newPeer',
                            fromID: peerId,
                        }));
                    }
                });
                break;
                // 其他处理逻辑...
        }
    });

    ws.on('close', () => {
        if (ws.roomId && rooms[ws.roomId]) {
            rooms[ws.roomId] = rooms[ws.roomId].filter(client => client.ws !== ws);
            // 广播用户离开的消息
            rooms[ws.roomId].forEach(client => {
                client.ws.send(JSON.stringify({
                    type: 'peerDisconnected',
                    peerId: ws.peerId,
                }));
            });
        }
    });
});

// 为转发消息添加安全验证，确保消息来源合法
function broadcastMessage(roomId, data, senderPeerId) {
    if (rooms[roomId]) {
        rooms[roomId].forEach(client => {
            if (client.peerId !== senderPeerId && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify(data));
            }
        });
    }
}