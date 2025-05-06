class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends AppError {
  constructor(message, code, details) {
    super(message, 400);
    this.code = code;
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(message, code, details) {
    super(message, 404);
    this.code = code;
    this.details = details;
  }
}

class ServerError extends AppError {
  constructor(message, code, details) {
    super(message, 500);
    (this.code = code), (this.details = details);
  }
}

class ConflictError extends AppError {
  constructor(message, code, details) {
    super(message, 409);
    (this.code = code), (this.details = details);
  }
}

class TooManyRequestsError extends AppError {
  constructor(message, code, details) {
    super(message, 429);
    (this.code = code), (this.details = details);
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  ServerError,
  ConflictError,
  TooManyRequestsError,
};
