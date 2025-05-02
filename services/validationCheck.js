import { MESSAGES, TIME, VALIDATION } from "../config/constants.js";

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

export function checkDateFormat(startDate, endDate) {
  if (isNaN(startDate.getDate()) || isNaN(endDate.getDate())) {
    const error = new Error(MESSAGES.ERROR.INVALID_DATE);
    error.title = "Response (400 Bad Request): ";
    error.code = "INVALID_DATE_FORMAT";
    error.details = {
      field: "end",
      value: "invalid-date",
      constraint: TIME.DATE_FORMAT,
    };
    throw error;
  }
}

export function checkDateRange(startDate, endDate) {
  if (startDate > endDate) {
    const error = new Error(MESSAGES.ERROR.INVALID_DATE_RANGE);
    error.title = "Response (400 Bad Request): ";
    error.code = "INVALID_DATE_RANGE";
    error.details = {
      start: startDate,
      end: endDate,
    };
    throw error;
  }
}

export function checkPageNumber(pageNumber) {
  if (pageNumber < 1) {
    const error = new Error(MESSAGES.ERROR.INVALID_PAGE);
    error.title = "Response (400 Bad Request): ";
    error.code = "INVALID_PAGE_NUMBER";
    error.details = {
      field: "page",
      value: pageNumber,
      constraint: "min: 1",
    };
    throw error;
  }
}

export function checkPageLimit(pageLimit) {
  if (pageLimit > 100) {
    const error = new Error(MESSAGES.ERROR.INVALID_LIMIT);
    error.title = "Response (400 Bad Request): ";
    error.code = "INVALID_LIMIT";
    error.details = {
      field: "limit",
      value: 150,
      constraint: "max: 100",
    };
    throw error;
  }
}

export const requestCounts = {};
export const rateLimiter = (req, res, next) => {
  const timeLimit = 10 * 60 * 1000;
  const ip = req.ip;
  const now = Date.now();

  if (!requestCounts[ip]) {
      requestCounts[ip] = { count: 1, lastRequest: now };
  } else {
      const timeSinceLastRequest = now - requestCounts[ip].lastRequest;

      if (timeSinceLastRequest < timeLimit) {
      requestCounts[ip].count += 1;
      } else {
      requestCounts[ip] = { count: 1, lastRequest: now };
      }
  }

  const maxRequests = 10;

  if (requestCounts[ip].count > maxRequests) {
      const error = new Error(
      "요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요"
      );
      error.status = 429;
      error.title = "Response (429 Too Many Requests) : ";
      error.code = "RATE_LIMIT_EXCEEDED";
      error.isValid = false;
      error.details = {
      retryAfter: timeLimit / (60 * 1000),
      limit: maxRequests,
      remaining: 0,
      };
      throw error;
  }

  requestCounts[ip].lastRequest = now;
  next();
  };
