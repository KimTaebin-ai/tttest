import fp from 'fastify-plugin'
import { Server as IOServer } from 'socket.io'
import chatController from '../controllers/chatController.js';

export default fp(async (app) => {
    const io = new IOServer(app.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        transports: ['websocket', 'polling']                     // CORS 설정
    });

    app.decorate('io', io)

    app.addHook('onClose', (instance, done) => {
        io.close()
        done()
    });

    io.on('connection', (socket) => {
        app.log.info(`Socket connected: ${socket.id}`);

        // 연결된 클라이언트에게 환영 메시지
        socket.emit('chat:welcome', {
            message: '채팅방에 오신 것을 환영합니다!',
            socketId: socket.id
        });

        // 다른 클라이언트들에게 새 사용자 알림
        socket.broadcast.emit('chat:user-joined', {
            socketId: socket.id,
            message: `새로운 사용자가 입장했습니다.`
        });

        // 컨트롤러로 위임
        chatController(app, socket);

        // 연결 해제 처리
        socket.on('disconnect', (reason) => {
            app.log.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
            socket.broadcast.emit('chat:user-left', {
                socketId: socket.id,
                message: `사용자가 퇴장했습니다.`
            });
        });
    });
});
