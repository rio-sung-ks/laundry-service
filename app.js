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

// Store request counts per IP
const requestCounts = {};

// Custom rate limiter middleware
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, lastRequest: now };
  } else {
    const timeSinceLastRequest = now - requestCounts[ip].lastRequest;
    const timeLimit = 60 * 60 * 1000; // 60 minutes

    if (timeSinceLastRequest < timeLimit) {
      requestCounts[ip].count += 1;
    } else {
      requestCounts[ip] = { count: 1, lastRequest: now }; // Reset after time window
    }
  }

  const maxRequests = 10;

  if (requestCounts[ip].count > maxRequests) {
    // error 만들기
    const error = new Error("요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요");
    error.status = 429;
    error.title = "Response (429 Too Many Requests) : ";
    error.code = "RATE_LIMIT_EXCEEDED";
    error.isValid = false;
    error.details = {
        retryAfter: 60,
        limit: 100,
        remaining: 0
    };
    throw error;
  }

  requestCounts[ip].lastRequest = now;
  next();
};

// Apply the custom rate limiter
app.use(rateLimiter);
app.get("/", rateLimiter, (req, res) => {
  res.send("요청 성공")
});


app.get('/', (req, res) => {
  res.send('Welcome to the rate-limited server');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});










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