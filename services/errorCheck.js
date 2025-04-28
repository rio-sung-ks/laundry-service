import { Types } from 'mongoose';
import Pickup from '../models/Pickup.js';
import redisClient from '../config/redis.js';
import { VALIDATION } from '../config/constants.js';

export const createPickup = async (pickupData) => {
  // TODO: 수거 요청 생성
  const requestField = ["customerName", "address", "phoneNumber", "requestDetails"];
  const customerName = pickupData["customerName"];
  // 1. 필드누락
  for (const field of requestField){
    if (!pickupData[field]) {
      const error = new Error("필수 필드가 누락되었습니다");
      error.statusCode = 400;
      error.code = "MISSING_REQUIRED_FIELD";
      error.details = {
        field: field,
        constraint: "required"
      };
      throw error;
    }
  }

  // 2. 이름 길이
    if (customerName.length < VALIDATION.CUSTOMER_NAME.MIN_LENGTH || customerName.length > VALIDATION.CUSTOMER_NAME.MAX_LENGTH) {
      const error = new Error("이름은 2-50자 사이여야 합니다");
      error.statusCode = 400;
      error.code = "INVALID_NAME_LENGTH";
      error.details = {
        field: "customerName",
        value: customerName,
        constraint: "length 2-50"
      };
      throw error;
    }

    const pickupCreate =  new Pickup(pickupData);
    const dbPickupCreate = await pickupCreate.save();

    return dbPickupCreate;
};

export const getPickups = async (query) => {
  // TODO: 수거 요청 목록 조회
  const {start, end} = query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dbGetPickups =  await Pickup.find({ createdAt: { $gte: startDate, $lte: endDate } });
  return dbGetPickups;
};

export const cancelPickup = async (id) => {
  // TODO: 수거 요청 취소
};

export const updatePickup = async (id, updateData) => {
  // TODO: 수거 요청 수정
};
