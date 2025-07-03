import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';

// 환경 이름 가져오기 (없으면 'develop' 사용)
const env = process.env.NODE_ENV || 'develop';

// 기본 .env 로드
loadEnv({
    path: resolve(process.cwd(), '.env'),
    // override: false  // 필요 시 이미 설정된 값을 덮어쓸지 결정
});

// 환경별 .env 파일 추가 로드 (.env.develop, .env.production 등)
loadEnv({
    path: resolve(process.cwd(), `.env.${env}`),
    override: true   // 환경별 값으로 덮어쓰기
});

// 상수 추출
export const PORT = Number(process.env.PORT) || 3000;