/**
 * @param {import('fastify').FastifyInstance} app
 * @param {import('socket.io').Socket} socket
 */
export default (app, socket) => {
    // 클라이언트로부터 'chat:message' 이벤트 수신
    socket.on('chat:message', (data = {}) => {
        const { text = '', username = 'Anonymous' } = data;

        // 수신 로그
        const payload = {
            id: socket.id,
            username,
            text: text.trim(),
            time: new Date().toISOString()
        };

        app.log.info(`Message from ${socket.id} (${username}): ${text}`);

        // 모든 클라이언트에 전송
        app.io.emit('chat:message', payload);
    });

    // 타이핑 상태 처리
    socket.on('chat:typing', (data = {}) => {
        const { username = 'Anonymous', isTyping = false } = data;
        socket.broadcast.emit('chat:typing', {
            socketId: socket.id,
            username,
            isTyping
        });
    });

    // 사용자 이름 설정
    socket.on('chat:set-username', (data = {}) => {
        const { username = '' } = data;
        if (username.trim()) {
            socket.username = username.trim();
            socket.emit('chat:username-set', {
                username: socket.username,
                message: '사용자 이름이 설정되었습니다.'
            });
        }
    });
};
