import { MESSAGES, TIME, VALIDATION } from "../config/constants.js";

export function checkNoRecordFound(start, end, dbGetPickups) {

  if(dbGetPickups.length === 0){

    const error = new Error("해당 기간의 수거 요청이 존재하지 않습니다.");
    error.title = "Response (404 Not Found): ";
    error.code = "NO_RECORDS_FOUND";
    error.details = {
      start: start,
      end: end,
    };
    throw error;
  }
}
