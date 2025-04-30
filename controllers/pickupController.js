import { PICKUP_STATUS } from "../config/constants.js";
import {
  createPickup,
  getPickups,
  cancelPickup,
  updatePickup,
} from "../services/pickupService.js";

export const createPickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 생성

  try {
    const request = req.body;
    const dbCreatePickup = await createPickup(request);
    res.json(dbCreatePickup);
  } catch (error) {
    next(error);
  }
};

export const getPickupRequests = async (req, res, next) => {
  // TODO: 수거 요청 목록 조회
  try {
    const dbGetPickups = await getPickups(req.query);
    res.json(dbGetPickups);
  } catch (error) {
    next(error);
  }
};

export const cancelPickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 취소
  try {
    const id = req.params.id;
    console.log("🟢 id : ",id);
    console.log("🟢 typeof id : ",typeof id);
    const dbCancelPickup = await cancelPickup(id);
    res.json({
      title : "Response (200 OK): ",
      id: dbCancelPickup._id,
      status: PICKUP_STATUS.CANCELLED,
      cancelledAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

export const updatePickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 수정
};
