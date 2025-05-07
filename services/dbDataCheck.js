import { CODE, immutableField, MESSAGES, TIME, VALIDATION } from "../config/constants.js";
import { InvalidError, ConflictError, TransactionError } from "../Util/error.js";

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
    throw new ConflictError(
      MESSAGES.ERROR.REQUEST_IN_PROCESS,
      CODE.REQUEST_IN_PROCESS,
      {
        status: "PROCESSING",
        startedAt: dbCancelPickup.updatedAt,
      }
    )
  }
}

export function checkInvalidField(updateData, immutableField) {

  for (const field in updateData) {
    if (immutableField.indexOf(field) !== -1) {
      throw new ConflictError (
        MESSAGES.ERROR.INVALID_UPDATE_FIELD,
        CODE.INVALID_UPDATE_FIELD,
        {
          field: immutableField[0],
          constraint: "readonly",
        }
      )
    }
  }
}

export function checkRequiredField(updateData, requiredField) {
  const updateFields = Object.keys(updateData);
  let count = 0;
  let missingRequiredFields = [];
  for (const field of requiredField) {
    if(updateFields.includes(field)){ // 모든 required 필드가 있는지 확인
      count ++;
    } else {
      missingRequiredFields.push(field);
    }
  }
  const hasFields = count === requiredField.length;
  console.log(hasFields);

  if (!hasFields) {
    throw new InvalidError(
      MESSAGES.ERROR.MISSING_REQUEST_DETAILS2,
      CODE.MISSING_REQUEST_DETAILS2,
      {
        field: missingRequiredFields,
        constraint: "required",
      }
    )
  }
}

export function checkRequestLength(updateData) {
  const requestLength = updateData?.requestDetails?.length;
  if (
    requestLength < VALIDATION.REQUEST_DETAILS.MIN_LENGTH ||
    requestLength > VALIDATION.REQUEST_DETAILS.MAX_LENGTH
  ) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_REQUEST_LENGTH,
      CODE.INVALID_REQUEST_LENGTH,
      {
        value: updateData.requestDetails,
        constraint: `length: ${VALIDATION.REQUEST_DETAILS.MIN_LENGTH}-${VALIDATION.REQUEST_DETAILS.MAX_LENGTH}`,
      }
    )
  }
}

export function checkIdLength(id) {
  if (id.length !== 24) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_REQUEST_ID,
      CODE.INVALID_REQUEST_ID,
      {
        field: "id",
        value: "invalid-id-format",
        constraint: "24자리 16진수 문자열",
      });
  }
}

export function checkAlreadyCancelledInModifying(foundPickup) {
  const currentStatus = foundPickup.status;
  if (currentStatus === "CANCELLED") {
    throw new InvalidError(
      MESSAGES.ERROR.ALREADY_CANCELLED,
      CODE.ALREADY_CANCELLED,
      {
        status: "CANCELLED",
        cancelledAt: foundPickup.updatedAt,
      }
    )
  }
}

export function checkProccessingInModifying(foundPickup) {
  if (foundPickup.status === "PROCESSING") {
    throw new ConflictError(
      MESSAGES.ERROR.REQUEST_IN_PROCESS_NOTCANCELLABLE,
      CODE.REQUEST_IN_PROCESS_NOTCANCELLABLE,
      {
        status: "PROCESSING",
        startedAt: foundPickup.updatedAt,
      }
    )
  }
}

export function makeTransactionError() {
  throw new TransactionError (
    MESSAGES.ERROR.TRANSACTION_ERROR,
    CODE.TRANSACTION_ERROR,
    {
      errorCode: "DB_TRANSACTION_FAILED",
      timestamp: new Date(),
    }
  )
}
