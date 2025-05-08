import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import createError from 'http-errors';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import dotenv from "dotenv";
dotenv.config();
import pickupRoutes from './routes/pickupRoutes.js';
import { rateLimiter } from './services/validationCheck.js';
import redis from './config/redis.js';
import Pickup from './models/Pickup.js';

const app = express();

app.use(helmet());
app.get("/", rateLimiter, (req, res) => {
  res.send("요청 성공");
});
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${res.statusCode}] ${req.method} ${req.originalUrl}`);
  });
  next();
});

app.get('/test-cached', async (req, res, next) => {
  const cacheKey = 'pickup:all';
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.status(200).json({ source: 'cache', data: JSON.parse(cached) });
    }

    const pickups = await Pickup.find();
    await redis.set(cacheKey, JSON.stringify(pickups), 'EX', 300);
    return res.status(200).json({ source: 'db', data: pickups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/test-nocache', async (req, res, next) => {
  try {
    const pickups = await Pickup.find();
    res.status(200).json({ source: 'db', data: pickups });
  } catch (err) {
    next(err);
  }
});

/*

  CORS 설정은 왜 필요할까요?

 */
// mongoose.populate 활용
// https://mongoosejs.com/docs/populate.html
app.use(cors({
  origin: env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const conn = mongoose.createConnection(env.MONGODB_URI)

mongoose.connect(env.MONGODB_URI)
.then(() => console.log('MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

app.use(logger(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${env.API_PREFIX}/pickups`, pickupRoutes);

app.use((req, res, next) => {
  next(createError(404, '요청하신 리소스를 찾을 수 없습니다 ❌'));
});

app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  res.status(statusCode).json({
    title: err.title,
    error: {
      code: err.code,
      message: err.message,
      details: env.NODE_ENV === 'development' ? err.details : undefined,
    }
  });
});

export default app;
