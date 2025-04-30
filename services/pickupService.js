import Pickup from "../models/Pickup.js";

import {
  checkFieldMissing,
  checkNameLength,
  checkPhoneNumberFormat,
  checkDateFormat,
  checkDateRange,
  checkPageNumber,
  checkPageLimit,
} from "./validationCheck.js";

import { checkNoRecordFound, checkCancelTimeExpired } from "./dbDataCheck.js";
import { TIME } from "../config/constants.js";

export const createPickup = async (pickupData) => {
  const requestField = [
    "customerName",
    "address",
    "phoneNumber",
    "requestDetails",
  ];
  const customerName = pickupData["customerName"];

  checkFieldMissing(pickupData);
  checkNameLength(pickupData);
  checkPhoneNumberFormat(pickupData);
  // 4. exceed the number of request
  // Redis
  // Response (429 Too Many Requests):

  try {
    const pickupCreate = new Pickup(pickupData);
    const dbCreatePickup = await pickupCreate.save();

    return dbCreatePickup;
  } catch (err) {

    const error = new Error("데이터베이스 처리 중 오류가 발생했습니다");
    error.title = "Response (500 Internal Server Error):";
    error.code = "DATABASE_ERROR";
    error.details = {
      errorCode: "DB_CONNECTION_ERROR",
      timestamp: new Date()
    };
    throw error;
  }
};

export const getPickups = async (query) => {
  const { start, end, page, limit } = query;
  const startDate = new Date(start); // invalid Date 가 결과로 담김.
  const endDate = new Date(end);

  try {

    checkDateFormat(startDate, endDate);
    checkDateRange(startDate, endDate);
    checkPageNumber(page);
    checkPageLimit(limit);

    const dbGetPickups = await Pickup.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    // 5. internal server error

    checkNoRecordFound(start, end, dbGetPickups);
    return dbGetPickups;

  } catch (error) {
    throw error;
  }
};


export const cancelPickup = async (id) => {

  const dbCancelPickup = await Pickup.findById({ _id:id });
  if (!dbCancelPickup) {
    // 해당 아이디 없음
    // throw proper error
    console.log("해당 아이디 없음");
  }
  // 아이디 있으면
  console.log("해당 아이디 있음");
  const now = new Date();
  const nowTime = now.getTime();
  const createTime = dbCancelPickup.createdAt.getTime();

  // 취소 한시간 경과했는지 확인
  const timeElapsed = nowTime - createTime;
  // const hourElapsed = Math.floor(timeElapsed/(60 * 60 * 1000));
  const hourElapsed = timeElapsed / (60 * 60 * 1000);
  const hourElapsedFloor = Math.floor(timeElapsed / (60 * 60 * 1000));
  const minElapsedFloor = Math.floor((hourElapsed - hourElapsedFloor) * 60);
  const isCancellable = timeElapsed <= TIME.CANCELLATION_WINDOW;
  console.log("isCancellable : ", isCancellable);

  if(isCancellable){
    // cancellable 하면
    const dbCancelResult = await Pickup.findByIdAndDelete(id);
    return dbCancelResult;
  } else {

    // isCanccellable = false
    console.log("false 진입");
    console.log("timeElapsed : ",timeElapsed);

    checkCancelTimeExpired(dbCancelPickup, nowTime, timeElapsed)
  }
};

export const updatePickup = async (id, updateData) => {
  // TODO: 수거 요청 수정
};
