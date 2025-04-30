import { PICKUP_STATUS, PAGINATION } from "../config/constants.js";
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
    const responseResult = await getPickups(req.query);
    const {
      total,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      totalPages,
    } = responseResult.pagination;

    res.json({
      pickups: responseResult.dbGetPickups,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelPickupRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id.length !== 24) {
      const error = new Error("잘못된 요청 ID 형식입니다");
      error.title = "Response (400 Bad Request) : ";
      error.code = "INVALID_REQUEST_ID";
      error.details = {
        field: "id",
        value: "invalid-id-format",
        constraint: "24자리 16진수 문자열",
      };
      throw error;
    }
    const dbCancelPickup = await cancelPickup(id);
    res.json({
      title: "Response (200 OK): ",
      id: dbCancelPickup._id,
      status: PICKUP_STATUS.CANCELLED,
      cancelledAt: new Date(),
    });
  } catch (error) {
    next(error);
  }
};

export const updatePickupRequest = async (req, res, next) => {
  const id = req.params.id;
  const updateData = req.body;
  const dbUpdatePickupResult = await updatePickup(id, updateData);
  res.json({
    id: dbUpdatePickupResult._id,
    customerName: dbUpdatePickupResult.customerName,
    address: dbUpdatePickupResult.address,
    phoneNumber: dbUpdatePickupResult.phoneNumber,
    requestDetails: dbUpdatePickupResult.requestDetails,
    status: dbUpdatePickupResult.status,
    updatedAt: dbUpdatePickupResult.updatedAt,
  });
};
