import { PICKUP_STATUS, PAGINATION } from "../config/constants.js";
import { checkIdLength } from "../services/dbDataCheck.js";
import {
  createPickup,
  getPickups,
  cancelPickup,
  updatePickup,
} from "../services/pickupService.js";

export const createPickupRequest = async (req, res, next) => {
  try {
    const request = req.body;
    const dbCreatePickup = await createPickup(request);
    res.json(dbCreatePickup);
  } catch (error) {
    next(error);
  }
};

export const getPickupRequests = async (req, res, next) => {
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
    checkIdLength(id);
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
  try {
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
  } catch (error) {
    console.log("error in controller");
    next(error);
  }
};
