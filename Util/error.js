class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class InvalidError extends AppError {
  constructor(message, code, details) {
    super(message, 400);
    this.code = code;
    this.isValid = false;
    this.details = details;
  }
}

class ConflictError extends AppError {
  constructor(message, code, details) {
    super(message, 409);
    this.code = code;
    this.isValid = false;
    this.details = details;
  }
}

class TransactionError extends AppError {
  constructor(message, code, details) {
    super(message, 500);
    this.code = code;
    this.isValid = true;
    this.details = details;
  }
}

class RateLimitError extends AppError {
  constructor(message, code, details) {
    super(message, 429);
    this.code = code;
    this.isValid = true;
    this.details = details;
  }
}

export {
  AppError,
  InvalidError,
  ConflictError,
  TransactionError,
  RateLimitError,
};
