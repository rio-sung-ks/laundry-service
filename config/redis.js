import Redis from 'ioredis';
import env from './env.js';

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redis.on('error', (err) => {
  // console.error('Redis 연결 오류:', err);
});

redis.on('connect', () => {
  console.log('Redis 연결 성공');
});

export default redis;
