import { VALIDATION } from "../config/constants.js";

export function checkFieldMissing(pickupData) {
  const requestField = [
    "customerName",
    "address",
    "phoneNumber",
    "requestDetails",
  ];
  for (const field of requestField) {
    if (!pickupData[field]) {
      const error = new Error("필수 필드가 누락되었습니다");
      error.title = "Response (400 Bad Request): ";
      error.statusCode = 400;
      error.code = "MISSING_REQUIRED_FIELD";
      error.details = {
        field: field,
        constraint: "required",
      };
      throw error;
    }
  }
}

export function checkNameLength(pickupData) {
  const customerName = pickupData["customerName"];
  if (
    customerName.length < VALIDATION.CUSTOMER_NAME.MIN_LENGTH ||
    customerName.length > VALIDATION.CUSTOMER_NAME.MAX_LENGTH
  ) {
    const error = new Error("이름은 2-50자 사이여야 합니다");
    error.title = "Response (400 Bad Request): ";
    error.statusCode = 400;
    error.code = "INVALID_NAME_LENGTH";
    error.details = {
      field: "customerName",
      value: customerName,
      constraint: "length 2-50",
    };
    throw error;
  }
}

export function checkPhoneNumberFormat(pickupData) {
  const phoneNumber = pickupData["phoneNumber"];
  console.log(phoneNumber);
  if (!VALIDATION.PHONE_NUMBER.PATTERN.test(phoneNumber)) {
    const error = new Error("올바른 전화번호 형식이 아닙니다");
    error.title = "Response (400 Bad Request): ";
    error.statusCode = 400;
    error.code = "INVALID_PHONE_FORMAT";
    error.details = {
      field: "phoneNumber",
      value: phoneNumber,
      constraint: "format: XXX-XXXX-XXXX",
    };
    throw error;
  }
}


export async function createPickupInDB(pickupData){
  try {
    const pickupCreate = new Pickup(pickupData);
    const dbPickupCreate = await pickupCreate.save();

    return dbPickupCreate;
  } catch (err) {

    const error = new Error("데이터베이스 처리 중 오류가 발생했습니다");
    error.title = "Response (500 Internal Server Error):";
    error.code = "DATABASE_ERROR";
    error.details = {
      errorCode: "DB_CONNECTION_ERROR",
      timestamp: new Date()
    };
    throw error;
  }
}