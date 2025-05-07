import {
  CODE,
  MESSAGES,
  requiredField,
  TIME,
  VALIDATION,
} from "../config/constants.js";
import env from "../config/env.js";
import { InvalidError, RateLimitError } from "../Util/error.js";

export function checkFieldMissing(pickupData) {
  for (const field of requiredField) {
    if (!pickupData[field]) {
      throw new InvalidError(
        MESSAGES.ERROR.MISSING_REQUIRED_FIELD,
        CODE.MISSING_REQUIRED_FIELD,
        {
          field: field,
          constraint: "required",
        }
      );
    }
  }
}

export function checkNameLength(pickupData) {
  const customerName = pickupData["customerName"];
  if (
    customerName.length < VALIDATION.CUSTOMER_NAME.MIN_LENGTH ||
    customerName.length > VALIDATION.CUSTOMER_NAME.MAX_LENGTH
  )
    throw new InvalidError(
      MESSAGES.ERROR.MISSING_REQUIRED_FIELD,
      CODE.MISSING_REQUIRED_FIELD,
      {
        field: "customerName",
        value: customerName,
        constraint: "length 2-50",
      }
    );
}

export function checkPhoneNumberFormat(pickupData) {
  const phoneNumber = pickupData["phoneNumber"];
  if (!VALIDATION.PHONE_NUMBER.PATTERN.test(phoneNumber)) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_PHONE_FORMAT,
      CODE.INVALID_PHONE_FORMAT,
      {
        field: "phoneNumber",
        value: phoneNumber,
        constraint: "format: XXX-XXXX-XXXX",
      }
    );
  }
}

export function checkDateFormat(startDate, endDate) {
  if (isNaN(startDate.getDate()) || isNaN(endDate.getDate())) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_DATE,
      CODE.INVALID_DATE,
      {
        field: "end",
        value: "invalid-date",
        constraint: TIME.DATE_FORMAT,
      }
    )
  }
}

export function checkDateRange(startDate, endDate) {
  if (startDate > endDate) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_DATE_RANGE,
      CODE.INVALID_DATE_RANGE,
      {
        start: startDate,
        end: endDate,
      }
    )
  }
}

export function checkPageNumber(pageNumber) {
  if (pageNumber < 1) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_PAGE,
      CODE.INVALID_PAGE,
      {
        field: "page",
        value: pageNumber,
        constraint: "min: 1",
      }
    )
  }
}

export function checkPageLimit(pageLimit) {
  if (pageLimit > 100) {
    throw new InvalidError(
      MESSAGES.ERROR.INVALID_LIMIT,
      CODE.INVALID_LIMIT,
      {
        field: "limit",
        value: 150,
        constraint: "max: 100",
      }
    )
  }
}

export const requestCounts = {};
export const rateLimiter = (req, res, next) => {
  const timeLimit = env.RATE_LIMIT_WINDOW;
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

  const maxRequests = env.RATE_LIMIT_MAX;

  if (requestCounts[ip].count > maxRequests) {
    throw new RateLimitError(
      MESSAGES.ERROR.RATE_LIMIT_EXCEEDED,
      CODE.RATE_LIMIT_EXCEEDED,
      {
        retryAfter: timeLimit / (60 * 1000),
        limit: maxRequests,
        remaining: 0,
      }
    )
  }

  requestCounts[ip].lastRequest = now;
  next();
};

// rateLimiter 의사코드

// 시간과 횟수 리밋을 선언한다
// 현재 시간을 기록한다
// 접속 정보를 기록할 객체를 만든다

// ip와 지금 시간을 객체에 저장한다

// 요청이 왔을 때
// 저장된 ip 가 있으면)
// 시간과 저장된 시간의 차이를 구한다

// 차이 < 시간 리밋, count ++
// 시간 리밋 보다 작은데 count ++ 가 제한 횟수 보다 큰 경우 => 429
// 시간 리밋 보다 작은데 count ++ 가 제한 횟수 보다 작은 경우 => 접속

// 차이 > 시간 리밋, count reset

// 저장된 ip 가 없으면)
// 저장 후 위 과정으로 이동
