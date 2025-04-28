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
    const dbPickupCreate = await createPickup(request);
    res.json(dbPickupCreate);

  } catch (error) {
    res.status(400).json({ message : '400 Bad Reqeust' })
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




// import { createPickup } from '../services/pickupService.js';

// export const createPickupRequest = async (req, res, next) => {
//   try {
//     const body = req.body;
//     const createdPickup = await createPickup(body);
//     res.status(201).json(createdPickup);
//   } catch (error) {
//     // ❗ 여기서 400 Bad Request로 응답
//     res.status(400).json({
//       error: {
//         message: error.message || 'Bad Request',
//       }
//     });
//   }
// };