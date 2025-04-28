import { Types } from 'mongoose';
import Pickup from '../models/Pickup.js';
import redisClient from '../config/redis.js';
import { VALIDATION } from '../config/constants.js';
import { checkFieldMissing, checkNameLength } from './validationCheck.js';

export const createPickup = async (pickupData) => {
  // TODO: 수거 요청 생성
  const requestField = ["customerName", "address", "phoneNumber", "requestDetails"];
  const customerName = pickupData["customerName"];

  // 1. 필드누락
  checkFieldMissing(pickupData);

  // 2. 이름 길이
  checkNameLength(pickupData);

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
