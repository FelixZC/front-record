/**
 * 创建一个WebSocket服务器，用于管理在线房间和用户。
 * @requires 'ws' 模块用于WebSocket服务
 */
const WebSocket = require('ws');

// 初始化WebSocket服务器，监听8080端口
const server = new WebSocket.Server({
    port: 8080
});

// 引入uuid模块，用于生成唯一标识符
const uuid = require('uuid');

// 存储在线的房间和用户
const rooms = {};

// 当有客户端连接时的处理逻辑
server.on('connection', (ws) => {
    // 初始化客户端的心跳状态
    ws.isAlive = true;
    // 为客户端生成一个唯一的peerId
    const peerId = uuid.v4();

    // 当收到客户端的'pong'消息时，更新其心跳状态
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    // 当收到客户端的消息时，进行消息解析和处理
    ws.on('message', async (message) => {
        let data;
        try {
            data = JSON.parse(message);
        } catch (error) {
            // 当接收到的JSON格式有误时，向客户端返回错误信息
            console.error('Received invalid JSON:', message);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid message format.'
            }));
            return;
        }

        // 根据消息类型执行相应的逻辑
        switch (data.type) {
            case 'joinRoom':
                // 当客户端请求加入房间时
                if (!rooms[data.roomId]) {
                    // 如果房间不存在，则创建一个新房间
                    rooms[data.roomId] = [];
                }
                // 将客户端添加到房间中
                rooms[data.roomId].push({
                    ws,
                    peerId
                });
                // 设置客户端的房间ID和peerId
                ws.peerId = peerId;
                ws.roomId = data.roomId;
                // 通知房间内的其他用户有新成员加入
                rooms[data.roomId].forEach(client => {
                    if (client.ws !== ws) {
                        client.ws.send(JSON.stringify({
                            type: 'newPeer',
                            fromID: peerId,
                        }));
                    }
                });
                break;
                // 其他消息处理逻辑...
        }
    });

    // 当客户端连接关闭时的处理逻辑
    ws.on('close', () => {
        // 如果客户端属于某个房间，则从房间中移除该客户端
        if (ws.roomId && rooms[ws.roomId]) {
            rooms[ws.roomId] = rooms[ws.roomId].filter(client => client.ws !== ws);
            // 向房间内其他用户广播该客户端已离开的消息
            rooms[ws.roomId].forEach(client => {
                client.ws.send(JSON.stringify({
                    type: 'peerDisconnected',
                    peerId: ws.peerId,
                }));
            });
        }
    });
});