import Fastify from 'fastify';
import path from 'path';
import helmet from '@fastify/helmet';
import socketPlugin from './plugins/socket.js'
import { PORT } from './utils/constants.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({ logger: true });              // 로거 활성화

await app.register(socketPlugin);                         // Socket.IO 플러그인 등록

await app.register(import('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
});

app.register(helmet, { contentSecurityPolicy: false });
// 보안 헤더: CSP는 필요 시 조정

// 기본 라우트
app.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

// 헬스 체크 라우트
app.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
    try {
        await app.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server listening on ${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();                                            // 서버 시작
