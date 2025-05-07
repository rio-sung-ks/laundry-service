import { CODE, MESSAGES, TIME, VALIDATION } from "../config/constants.js";
import { InvalidError } from "../Util/error.js";

export function checkNoRecordFound(start, end, dbGetPickups) {
  if (dbGetPickups.length === 0) {
    throw new InvalidError(
      MESSAGES.ERROR.NO_RECORDS_FOUND,
      CODE.NO_RECORDS_FOUND,
      {
        start: start,
        end: end,
      }
    );
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
    throw new InvalidError(
      MESSAGES.ERROR.CANCELLATION_TIME_EXPIRED,
      CODE.CANCELLATION_TIME_EXPIRED,
      {
        createdAt: dbCancelPickup.createdAt,
        curretTime: new Date(nowTime),
        timeElapsed: `${hourElapsedFloor} 시간 ${minElapsedFloor} 분`,
      }
    );
  }
}

export function checkStatusCancellable(dbCancelPickup) {
  const isStatusCancellable = dbCancelPickup.status !== "CANCELLED";
  if (!isStatusCancellable) {
    throw new InvalidError(
      MESSAGES.ERROR.ALREADY_CANCELLED,
      CODE.ALREADY_CANCELLED,
      {
        status: dbCancelPickup.status,
        cancelledAt: dbCancelPickup.updatedAt,
      }
    );
  }
}

export function checkNonExistentId(dbCancelPickup) {
  if (!dbCancelPickup) {
    throw new InvalidError(
      MESSAGES.ERROR.PICKUP_NOT_FOUND,
      CODE.PICKUP_NOT_FOUND,
      {
        requestId: "nonexistent_id",
      }
    )
  }
}

export function checkProccessingRequest(dbCancelPickup) {
  if (dbCancelPickup.status === "PROCESSING") {
    const error = new Error("이미 처리 중인 요청입니다");
    error.status = 409;
    error.title = "Response (409 Conflict) : ";

    error.code = "REQUEST_IN_PROCESS";
    error.isValid = false;
    error.details = {
      status: "PROCESSING",
      startedAt: dbCancelPickup.updatedAt,
    };

    throw error;
  }
}

export function checkInvalidField(updateData) {
  const immutableField = [
    "immutableField1",
    "immutableField2",
    "customerName",
    "immutableField3",
  ];
  for (const field in updateData) {
    if (immutableField.indexOf(field) !== -1) {
      const error = new Error("수정할 수 없는 필드가 포함되어 있습니다");
      error.status = 409;
      error.title = "Response (400 Bad Request) : ";
      error.code = "INVALID_UPDATE_FIELD";
      error.isValid = false;
      error.details = {
        field: "customerName",
        constraint: "readonly",
      };

      throw error;
    }
  }
}

export function checkRequiredField(updateData) {
  if (Object.keys(updateData).length === 0) {
    const error = new Error("요청사항 필드는 필수입니다.");
    error.status = 400;
    error.title = "Response (400 Bad Request) : ";
    error.code = "MISSING_REQUEST_DETAILS";
    error.isValid = false;
    error.details = {
      field: "requestDetails",
      constraint: "required",
    };
    throw error;
  }

  if (Object.keys(updateData).indexOf("requestDetails") === -1) {
    const error = new Error("요청사항 필드는 필수입니다.");
    error.status = 400;
    error.title = "Response (400 Bad Request) : ";
    error.code = "MISSING_REQUEST_DETAILS";
    error.isValid = false;
    error.details = {
      field: "requestDetails",
      constraint: "required",
    };
    throw error;
  }
}

export function checkRequestLength(updateData) {
  const requestLength = updateData?.requestDetails?.length;
  if (
    requestLength < VALIDATION.REQUEST_DETAILS.MIN_LENGTH ||
    requestLength > VALIDATION.REQUEST_DETAILS.MAX_LENGTH
  ) {
    console.log("here2");
    const error = new Error("요청사항은 10-1000자 사이여야 합니다.");
    error.status = 400;
    error.title = "Response (400 Bad Request) : ";
    error.code = "INVALID_REQUEST_LENGTH";
    error.isValid = false;
    error.details = {
      value: updateData.requestDetails,
      constraint: `length: ${VALIDATION.REQUEST_DETAILS.MIN_LENGTH}-${VALIDATION.REQUEST_DETAILS.MAX_LENGTH}`,
    };

    throw error;
  }
}

export function checkIdLength(id) {
  if (id.length !== 24) {
    throw new InvalidError("테스트 메세지", "INVALID_REQUEST_ID", {
      field: "id",
      value: "invalid-id-format",
      constraint: "24자리 16진수 문자열",
    });
  }
}

export function checkAlreadyCancelledInModifying(foundPickup) {
  const currentStatus = foundPickup.status;
  if (currentStatus === "CANCELLED") {
    const error = new Error("취소된 요청은 수정할 수 없습니다");
    error.title = "Response (400 Bad Request) : ";
    error.code = "ALREADY_CANCELLED";
    error.isValid = false;
    error.details = {
      status: "CANCELLED",
      cancelledAt: foundPickup.updatedAt,
    };

    throw error;
  }
}

export function checkProccessingInModifying(foundPickup) {
  if (foundPickup.status === "PROCESSING") {
    const error = new Error("처리 중인 요청은 수정할 수 없습니다");
    error.status = 409;
    error.title = "Response (409 Conflict) : ";
    error.code = "REQUEST_IN_PROCESS";
    error.isValid = false;
    error.details = {
      status: "PROCESSING",
      startedAt: foundPickup.updatedAt,
    };

    throw error;
  }
}

export function makeTransactionError() {
  const error = new Error("요청 수정 처리 중 오류가 발생했습니다");
  error.status = 500;
  error.title = "Response (500 Internal Server Error) : ";
  error.code = "TRANSACTION_ERROR";
  error.isValid = true;
  error.details = {
    errorCode: "DB_TRANSACTION_FAILED",
    timestamp: new Date(),
  };

  throw error;
}
