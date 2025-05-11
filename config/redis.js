import Redis from 'ioredis';
import env   from './env.js';

let redisClient;

if (env.REDIS_HOST) {
  redisClient = new Redis({
    host:     env.REDIS_HOST,
    port:     env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis 연결 오류:', err);
  });
  redisClient.on('connect', () => {
    console.log('Redis 연결 성공');
  });

} else {
  redisClient = {
    get:  async (/* key */)       => null,
    set:  async (/* key,val */)   => {},
    del:  async (/* key */)       => {},
    expire: async (/* key,sec */) => {},
  };
}

export default redisClient;