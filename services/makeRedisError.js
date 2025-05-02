export function makeRedisError(){
  const error = new Error("필수 필드가 누락되었습니다");
  error.title = "Response (500 Internal Server Error): ";
  error.statusCode = 500;
  error.code = "CACHE_ERROR";
  error.details = {
    errorCode: "REDIS_CONNECTION_ERROR",
    timestamp: new Date(),
  };
  throw error;
}