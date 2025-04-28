import { VALIDATION } from "../config/constants.js";

export function checkFieldMissing(pickupData){
  const requestField = ["customerName", "address", "phoneNumber", "requestDetails"];
  for (const field of requestField){
    if (!pickupData[field]) {
      const error = new Error("필수 필드가 누락되었습니다");
      error.statusCode = 400;
      error.code = "MISSING_REQUIRED_FIELD";
      error.details = {
        field: field,
        constraint: "required"
      };
      throw error;
    }
  }
}

export function checkNameLength(pickupData){
  const customerName = pickupData["customerName"];
  if (customerName.length < VALIDATION.CUSTOMER_NAME.MIN_LENGTH || customerName.length > VALIDATION.CUSTOMER_NAME.MAX_LENGTH) {
    const error = new Error("이름은 2-50자 사이여야 합니다");
    error.statusCode = 400;
    error.code = "INVALID_NAME_LENGTH";
    error.details = {
      field: "customerName",
      value: customerName,
      constraint: "length 2-50"
    };
    throw error;
  }
}