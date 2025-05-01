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

const app = express();

app.use(helmet());

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

mongoose.connect(env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})
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