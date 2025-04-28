import { Types } from 'mongoose';
import Pickup from '../models/Pickup.js';
import redisClient from '../config/redis.js';

export const createPickup = async (pickupData) => {
  // TODO: 수거 요청 생성
  const pickupCreate =  new Pickup(pickupData);
  const dbPickupCreate = await pickupCreate.save();
  return dbPickupCreate;
};

export const getPickups = async (query) => {
  // TODO: 수거 요청 목록 조회
  const {start, end} = query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  console.log(`start : ${startDate}`);
  console.log(`end : ${endDate}`);
  const dbGetPickups =  await Pickup.find({ createdAt: { $gte: startDate, $lte: endDate } });
  return dbGetPickups;
};

export const cancelPickup = async (id) => {
  // TODO: 수거 요청 취소
};

export const updatePickup = async (id, updateData) => {
  // TODO: 수거 요청 수정
};
