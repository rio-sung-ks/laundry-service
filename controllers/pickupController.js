import {
  createPickup,
  getPickups,
  cancelPickup,
  updatePickup
} from '../services/pickupService.js';

export const createPickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 생성
  const request = req.body;
  const dbPickupCreate = await createPickup(request);
  res.json(dbPickupCreate);
};

export const getPickupRequests = async (req, res, next) => {
  // TODO: 수거 요청 목록 조회
  const request = req.query;
  console.log(request);
  const dbGetPickups = await getPickups(request);
  res.json(dbGetPickups);

};

export const cancelPickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 취소
};

export const updatePickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 수정
};
