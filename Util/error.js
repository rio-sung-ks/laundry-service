class AppError extends Error {
  constructor(message, status, code, details, isValid = false) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.isValid = isValid;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BusinessError extends AppError {
  constructor(message, status, code, details, isValid = false) {
    super(message, status, code, details, isValid);
  }
}

class HttpError extends AppError {
  constructor(message, status, code, details, isValid = false) {
    super(message, status, code, details, isValid);
  }
}

class InvalidBusinessError extends BusinessError {
  constructor(message, code, details) {
    super(message, 400, code, details, false);
  }
}

class InvalidError extends HttpError {
  constructor(message, code, details) {
    super(message, 400, code, details, false);
  }
}

class ConflictError extends HttpError {
  constructor(message, code, details) {
    super(message, 409, code, details, false);
  }
}

class TransactionError extends HttpError {
  constructor(message, code, details) {
    super(message, 500, code, details, true);
  }
}

class RateLimitError extends HttpError {
  constructor(message, code, details) {
    super(message, 429, code, details, true);
  }
}

export {
  AppError,
  InvalidError,
  ConflictError,
  TransactionError,
  RateLimitError,
  BusinessError,
  InvalidBusinessError,
};