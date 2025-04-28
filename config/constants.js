/**
 * 수거 요청 상태 정의
 * @readonly
 * @enum {string}
 */
export const PICKUP_STATUS = {
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  UPDATED: 'UPDATED',
  PROCESSING: 'PROCESSING'
};

/**
 * 입력값 검증 규칙
 * @readonly
 * @typedef {Object} ValidationRules
 */
export const VALIDATION = {
  CUSTOMER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  ADDRESS: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 200
  },
  PHONE_NUMBER: {
    PATTERN: /^010-\d{4}-\d{4}$/
  },
  REQUEST_DETAILS: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000
  }
};

/**
 * 페이지네이션 설정
 * @readonly
 * @typedef {Object} PaginationConfig
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

/**
 * 시간 관련 상수
 * @readonly
 * @typedef {Object} TimeConfig
 */
export const TIME = {
  CANCELLATION_WINDOW: 60 * 60 * 1000,
  DATE_FORMAT: 'YYYY-MM-DD'
};

/**
 * 캐시 설정
 * @readonly
 * @typedef {Object} CacheConfig
 */
export const CACHE = {
  TTL: 60 * 5,
  PREFIX: {
    PICKUPS: 'pickups'
  }
};

/**
 * API 응답 메시지
 * @readonly
 * @typedef {Object} ApiMessages
 */
export const MESSAGES = {
  SUCCESS: {
    CREATE: '수거 요청이 성공적으로 생성되었습니다.',
    UPDATE: '수거 요청이 성공적으로 수정되었습니다.',
    CANCEL: '수거 요청이 성공적으로 취소되었습니다.',
    DEFAULT: '성공적으로 처리되었습니다.'
  },
  ERROR: {
    INVALID_DATE: '유효하지 않은 날짜 형식입니다.',
    INVALID_DATE_RANGE: '시작일이 종료일보다 늦을 수 없습니다.',
    INVALID_PAGE: '유효하지 않은 페이지 번호입니다.',
    INVALID_LIMIT: '유효하지 않은 페이지 크기입니다.',
    MISSING_REQUEST_DETAILS: '수정할 내용이 필요합니다.',
    TOO_SHORT_REQUEST_DETAILS: '수정 내용이 너무 짧습니다.'
  }
};

/**
 * 로깅 메시지
 * @readonly
 * @typedef {Object} LogMessages
 */
export const LOG_MESSAGES = {
  INFO: {
    CREATE_START: '수거 요청 생성 시작',
    CREATE_COMPLETE: '수거 요청 생성 완료',
    UPDATE_START: '수거 요청 수정 시작',
    UPDATE_COMPLETE: '수거 요청 수정 완료',
    CANCEL_START: '수거 요청 취소 시작',
    CANCEL_COMPLETE: '수거 요청 취소 완료',
    LIST_START: '수거 요청 목록 조회 시작',
    LIST_COMPLETE: '수거 요청 목록 조회 완료'
  },
  ERROR: {
    CREATE_FAIL: '수거 요청 생성 실패',
    UPDATE_FAIL: '수거 요청 수정 실패',
    CANCEL_FAIL: '수거 요청 취소 실패',
    LIST_FAIL: '수거 요청 목록 조회 실패',
    CACHE_ERROR: '캐시 처리 중 오류 발생'
  }
};
