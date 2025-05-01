import Pickup from "../models/Pickup.js";

import {
  checkFieldMissing,
  checkNameLength,
  checkPhoneNumberFormat,
  checkDateFormat,
  checkDateRange,
  checkPageNumber,
  checkPageLimit,
} from "./validationCheck.js";
``;
import {
  checkNoRecordFound,
  checkTimeCancellable,
  checkStatusCancellable,
  checkNonExistentId,
  checkProccessingRequest,
  checkInvalidField,
  checkRequiredField,
  checkRequestLength,
} from "./dbDataCheck.js";

export const createPickup = async (pickupData) => {
  const requestField = [
    "customerName",
    "address",
    "phoneNumber",
    "requestDetails",
  ];
  const customerName = pickupData["customerName"];

  checkFieldMissing(pickupData);
  checkNameLength(pickupData);
  checkPhoneNumberFormat(pickupData);
  // 4. exceed the number of request
  // Redis
  // Response (429 Too Many Requests):

  try {
    const pickupCreate = new Pickup(pickupData);
    const dbCreatePickup = await pickupCreate.save();
    return {
      title: "Response (201 Created",
      id: dbCreatePickup._id,
      customerName: dbCreatePickup.customerName,
      address: dbCreatePickup.address,
      phoneNumber: dbCreatePickup.phoneNumber,
      requestDetails: dbCreatePickup.requestDetails,
      status: dbCreatePickup.status,
      createdAt: dbCreatePickup.createdAt,
      updatedAt: dbCreatePickup.updatedAt,
    };
  } catch (err) {
    const error = new Error("데이터베이스 처리 중 오류가 발생했습니다");
    error.title = "Response (500 Internal Server Error):";
    error.code = "DATABASE_ERROR";
    error.details = {
      errorCode: "DB_CONNECTION_ERROR",
      timestamp: new Date(),
    };
    throw error;
  }
};

export const getPickups = async (query) => {
  const { start, end, page, limit, status } = query;
  const startDate = new Date(start); // invalid Date 가 결과로 담김.
  const endDate = new Date(end);

  try {
    checkDateFormat(startDate, endDate);
    checkDateRange(startDate, endDate);
    checkPageNumber(page);
    checkPageLimit(limit);

    const dbGetPickups = await Pickup.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const docsTotal = await Pickup.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // 5. internal server error
    checkNoRecordFound(start, end, dbGetPickups);
    const pagination = {
      total: docsTotal,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(docsTotal / limit),
    };

    return { dbGetPickups, pagination };
  } catch (error) {
    throw error;
  }
};

export const cancelPickup = async (id) => {
  const dbCancelPickup = await Pickup.findById({ _id: id });
  try {
    checkProccessingRequest(dbCancelPickup);
    checkNonExistentId(dbCancelPickup);
    checkStatusCancellable(dbCancelPickup);
    checkTimeCancellable(dbCancelPickup);
    checkInvalidRequest(dbCancelPickup);

    const dbCancelResult = await Pickup.findOneAndUpdate(
      { _id: id },
      { status: "CANCELLED" },
      { new: true },
    );
    return dbCancelResult;
  } catch (error) {
    console.log("error catch");
    throw error;
  }
};

export const updatePickup = async (id, updateData) => {
  // [PATCH]
  // 3. 필수 항목 누락 - updateData 가 비어있는지 확인한다
  // 4. 취소된 요청 - status === "CANCELLED"
  // 5. 처리 중인 요청 - status === "PROCESSING"
  // 6. 서버 내부 오류 - ????

  // 1. 수정 불가능한 필드 포함 -
  // 수정이 불가능한 필드를 배열로 만든다
  try {
    checkInvalidField(updateData);
    checkRequiredField(updateData);
    checkRequestLength(updateData);

    // 0. Success 코드
    const dbUpdatePickup = await Pickup.findOneAndUpdate( //null
      { _id: id },
      { requestDetails: updateData.requestDetails, status: "UPDATED" },
      { new: true },
    );

    // 2. 필수 항목 길이 - requestDetails => updateData 의 validation 으로 길이를 확인한다
    // console.log(updateData.requestDetails.length());

    return dbUpdatePickup;

  } catch (error) {
     throw error;
  }
  // id로 Pickup 데이터에 조회한다


};
