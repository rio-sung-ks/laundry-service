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
    INVALID_REQUEST_ID: "잘못된 요청 ID 형식입니다.",
    MISSING_REQUEST_DETAILS: '수정할 내용이 필요합니다.',
    TOO_SHORT_REQUEST_DETAILS: '수정 내용이 너무 짧습니다.',
    ALREADY_CANCELLED: "취소된 요청은 수정할 수 없습니다",
    NO_RECORDS_FOUND: "해당 기간의 수거 요청이 존재하지 않습니다.",
    CANCELLATION_TIME_EXPIRED: "취소 가능 시간(1시간)이 경과했습니다.",
    ALREADY_CANCELLED2: "이미 취소된 요청입니다.",
    PICKUP_NOT_FOUND: "해당 수거 요청을 찾을 수 없습니다.",
    REQUEST_IN_PROCESS: "이미 처리 중인 요청입니다.",
    INVALID_UPDATE_FIELD: "수정할 수 없는 필드가 포함되어 있습니다.",
    MISSING_REQUEST_DETAILS2: "요청사항 필드는 필수입니다.",
    INVALID_REQUEST_LENGTH: "요청사항은 10-1000자 사이여야 합니다.",
    REQUEST_IN_PROCESS_NOTCANCELLABLE: "처리 중인 요청은 수정할 수 없습니다.",
    TRANSACTION_ERROR: "요청 수정 처리 중 오류가 발생했습니다.",
    MISSING_REQUIRED_FIELD: "필수 필드가 누락되었습니다",
    INVALID_NAME_LENGTH: "이름은 2-50자 사이여야 합니다",
    INVALID_PHONE_FORMAT: "올바른 전화번호 형식이 아닙니다",
    RATE_LIMIT_EXCEEDED: "요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요",
  }
};

export const CODE = {
    INVALID_DATE: "INVALID_DATE",
    INVALID_DATE_RANGE: "INVALID_DATE_RANGE",
    INVALID_PAGE: "INVALID_PAGE",
    INVALID_LIMIT: "INVALID_LIMIT",
    INVALID_REQUEST_ID: "INVALID_REQUEST_ID",
    MISSING_REQUEST_DETAILS: "MISSING_REQUEST_DETAILS",
    TOO_SHORT_REQUEST_DETAILS: "TOO_SHORT_REQUEST_DETAILS",
    ALREADY_CANCELLED: "ALREADY_CANCELLED",
    NO_RECORDS_FOUND:"NO_RECORDS_FOUND",
    CANCELLATION_TIME_EXPIRED:"CANCELLATION_TIME_EXPIRED",
    ALREADY_CANCELLED2: "ALREADY_CANCELLED2",
    PICKUP_NOT_FOUND: "PICKUP_NOT_FOUND",
    REQUEST_IN_PROCESS: "REQUEST_IN_PROCESS",
    INVALID_UPDATE_FIELD: "INVALID_UPDATE_FIELD",
    MISSING_REQUEST_DETAILS2: "MISSING_REQUEST_DETAILS",
    INVALID_REQUEST_LENGTH: "INVALID_REQUEST_LENGTH",
    REQUEST_IN_PROCESS_NOTCANCELLABLE: "REQUEST_IN_PROCESS_NOTCANCELLABLE",
    TRANSACTION_ERROR: "TRANSACTION_ERROR",
    MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
    INVALID_NAME_LENGTH: "INVALID_NAME_LENGTH",
    INVALID_PHONE_FORMAT: "INVALID_PHONE_FORMAT",
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
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

export const requiredField = [
    "requestDetails",
    "address",
  ];

export const immutableField = [
  "customerName",
];
