import {
  createPickup,
  getPickups,
  cancelPickup,
  updatePickup
} from '../services/pickupService.js';

export const createPickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 생성
  
  try {
    const request = req.body;
    console.dir(request);
    const dbPickupCreate = await createPickup(request);
    res.json(dbPickupCreate);

  } catch (error) {
    res.status(error.statusCode).json({
      message : "Reponse (400 Bad Request) : ",
      error: {
        code:  error.code,
        message: error.message,
        details: error.details
      }
    });
  }

};

export const getPickupRequests = async (req, res, next) => {
  // TODO: 수거 요청 목록 조회
  const dbGetPickups = await getPickups(req.query);
  res.json(dbGetPickups);

};

export const cancelPickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 취소
};

export const updatePickupRequest = async (req, res, next) => {
  // TODO: 수거 요청 수정
};
