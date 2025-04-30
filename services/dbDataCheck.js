import { MESSAGES, TIME, VALIDATION } from "../config/constants.js";

export function checkNoRecordFound(start, end, dbGetPickups) {
  if (dbGetPickups.length === 0) {
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

export function checkTimeCancellable(dbCancelPickup) {
  const now = new Date();
  const nowTime = now.getTime();
  const createTime = dbCancelPickup.createdAt.getTime();
  const timeElapsed = nowTime - createTime;
  const hourElapsed = timeElapsed / (60 * 60 * 1000);
  const hourElapsedFloor = Math.floor(timeElapsed / (60 * 60 * 1000));
  const minElapsedFloor = Math.floor((hourElapsed - hourElapsedFloor) * 60);
  const isCancellable = timeElapsed <= TIME.CANCELLATION_WINDOW;

  if (!isCancellable) {
    const error = new Error("취소 가능 시간(1시간)이 경과했습니다");
    error.title = "Response (400 Bad Request) : ";
    error.code = "CANCELLATION_TIME_EXPIRED";
    error.details = {
      createdAt: dbCancelPickup.createdAt,
      curretTime: new Date(nowTime),
      timeElapsed: `${hourElapsedFloor} 시간 ${minElapsedFloor} 분`,
    };

    throw error;
  }
}

export function checkStatusCancellable(dbCancelPickup) {
  const isStatusCancellable = dbCancelPickup.status !== "CANCELLED";
  if (!isStatusCancellable) {
    const error = new Error("이미 취소된 요청입니다");
    error.title = "Response (400 Bad Request) : ";
    error.code = "ALREADY_CANCELLED";
    error.details = {
      status: dbCancelPickup.status,
      cancelledAt: dbCancelPickup.updatedAt,
    };

    throw error;
  }
}

export function checkNonExistentId(dbCancelPickup) {
  if (!dbCancelPickup) {
    const error = new Error("해당 수거 요청을 찾을 수 없습니다");
    error.title = "Response (400 Bad Request) : ";
    error.code = "PICKUP_NOT_FOUND";
    error.details = {
      requestId: "nonexistent_id",
    };

    throw error;
  }
}

export function checkProccessingRequest(dbCancelPickup) {
  if (dbCancelPickup.status === "PROCESSING") {
    const error = new Error("이미 처리 중인 요청입니다");
    error.status = 409;
    error.title = "Response (409 Bad Request) : ";
    error.code = "REQUEST_IN_PROCESS";
    error.details = {
      status: "PROCESSING",
      startedAt: dbCancelPickup.updatedAt,
    };

    throw error;
  }
}

