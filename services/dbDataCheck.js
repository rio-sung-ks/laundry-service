import { MESSAGES, TIME, VALIDATION } from "../config/constants.js";

export function checkNoRecordFound(start, end, dbGetPickups) {

  if(dbGetPickups.length === 0){

    const error = new Error("해당 기간의 수거 요청이 존재하지 않습니다.");
    error.title = "Response (404 Not Found): ";
    error.code = "NO_RECORDS_FOUND";
    error.details = {
      start: start,
      end: end,
    };
    throw error;
  }
}

export function checkCancelTimeExpired(dbCancelResult, nowTime, timeElapsed){

  const hourElapsed = timeElapsed / (60 * 60 * 1000);
  const hourElapsedFloor = Math.floor(timeElapsed / (60 * 60 * 1000));
  const minElapsedFloor = Math.floor((hourElapsed - hourElapsedFloor) * 60);
  if (dbCancelResult) {
    const error = new Error("취소 가능 시간(1시간)이 경과했습니다");
    error.title = "Response (400 Bad Request) : ";
    error.code = "CANCELLATION_TIME_EXPIRED";
    error.details = {
      createdAt: dbCancelResult.createdAt,
      curretTime: new Date(nowTime),
      timeElapsed: `${hourElapsedFloor} 시간 ${minElapsedFloor} 분`
    };
    throw error;
  }
}
