import { Types } from "mongoose";
import Pickup from "../models/Pickup.js";
import redisClient from "../config/redis.js";
import { MESSAGES, TIME, VALIDATION } from "../config/constants.js";
import {
  checkFieldMissing,
  checkNameLength,
  checkPhoneNumberFormat,
  checkDateFormat,
  checkDateRange,
  checkPageNumber,
  checkPageLimit
  
} from "./validationCheck.js";

export const createPickup = async (pickupData) => {
  // TODO: 수거 요청 생성
  const requestField = [
    "customerName",
    "address",
    "phoneNumber",
    "requestDetails",
  ];
  const customerName = pickupData["customerName"];

  // 1. missing field
  checkFieldMissing(pickupData);

  // 2. name length
  checkNameLength(pickupData);

  // 3. phoneNumber format
  checkPhoneNumberFormat(pickupData);

  // 4. exceed the number of request
  // Redis
  // Response (429 Too Many Requests):

  // 5. internal server error
  try {
    const pickupCreate = new Pickup(pickupData);
    const dbPickupCreate = await pickupCreate.save();

    return dbPickupCreate;
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
  // TODO: 수거 요청 목록 조회
  try {
    const { start, end, page, limit } = query;
    console.log(limit);
    
    const startDate = new Date(start); // invalid Date 가 결과로 담김.
    const endDate = new Date(end);
    checkDateFormat(startDate, endDate);
    checkDateRange(startDate, endDate);
    checkPageNumber(page);
    checkPageLimit(limit);

    const dbGetPickups = await Pickup.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    return dbGetPickups;

  } catch (error) {
    throw error;
  }
};

export const cancelPickup = async (id) => {
  // TODO: 수거 요청 취소
};

export const updatePickup = async (id, updateData) => {
  // TODO: 수거 요청 수정
};
