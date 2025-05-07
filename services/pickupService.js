import Pickup from "../models/Pickup.js";
import mongoose from "mongoose";
import env from "../config/env.js";
import dotenv from "dotenv";
dotenv.config();

import {
  checkFieldMissing,
  checkNameLength,
  checkPhoneNumberFormat,
  checkDateFormat,
  checkDateRange,
  checkPageNumber,
  checkPageLimit,
} from "./validationCheck.js";

import {
  checkNoRecordFound,
  checkTimeCancellable,
  checkStatusCancellable,
  checkNonExistentId,
  checkProccessingRequest,
  checkInvalidField,
  checkRequiredField,
  checkRequestLength,
  checkAlreadyCancelledInModifying,
  checkProccessingInModifying,
  makeTransactionError,
  checkIdLength,
} from "./dbDataCheck.js";
import redis from "../config/redis.js";
import Redis from "ioredis";
import { makeRedisError } from "./makeRedisError.js";


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

  try {
    await mongoose.connect(env.MONGODB_URI);
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
  const startDate = new Date(start);
  const endDate = new Date(end);
  const filter = {createdAt: { $gte: startDate, $lte: endDate }};

  checkDateFormat(startDate, endDate);
  checkDateRange(startDate, endDate);
  checkPageNumber(page);
  checkPageLimit(limit);
  const cacheKey = `getPikcups:${start}_${end}`;
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      // redis.disconnect();
      const result = JSON.parse(cachedData);
      return result;
    }

    await mongoose.connect(env.MONGODB_URI);
    const dbGetPickups = await Pickup.find(filter);
    const docsTotal = await Pickup.countDocuments(filter);

    checkNoRecordFound(start, end, dbGetPickups);
    const pagination = {
      total: docsTotal,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(docsTotal / limit),
    };

    await redis.set(cacheKey, JSON.stringify({ dbGetPickups, pagination }), 'EX', 300);

    return { dbGetPickups, pagination };
  } catch (error) {
    if (!error.isValid) {
      throw error;
    }
    console.log(">>>>>");
    makeRedisError();
    throw error;
  }


};

export const cancelPickup = async (id) => {
  await mongoose.connect(env.MONGODB_URI);
  const dbCancelPickup = await Pickup.findById({ _id: id });
  try {
    checkProccessingRequest(dbCancelPickup);
    checkNonExistentId(dbCancelPickup);
    checkStatusCancellable(dbCancelPickup);
    checkTimeCancellable(dbCancelPickup);
    const dbCancelResult = await Pickup.findOneAndUpdate(
      { _id: id },
      { status: "CANCELLED" },
      { new: true }
    );

    return dbCancelResult;
  } catch (error) {
    throw error;
  }
};

export const updatePickup = async (id, updateData) => {
  const conn = await mongoose.connect(env.MONGODB_URI);
  const session = await conn.startSession();

  try {
    session.startTransaction();
    checkIdLength(id);
    const foundPickup = await Pickup.findById({ _id: id });
    checkInvalidField(updateData);
    checkRequiredField(updateData);
    checkRequestLength(updateData);
    checkAlreadyCancelledInModifying(foundPickup);
    checkProccessingInModifying(foundPickup);

    const dbUpdatePickup = await Pickup.findOneAndUpdate(
      { _id: id },
      { requestDetails: updateData.requestDetails, status: "UPDATED" },
      { new: true }
    );

    await session.commitTransaction();

    return dbUpdatePickup;
  } catch (error) {
    if (!error.isValid) {
      throw error;
    }
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
};
