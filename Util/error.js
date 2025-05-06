class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }

}

class InvalidError extends AppError {
  constructor(status, message, code, details) {
    super(status, message);
    this.code = code;
    this.details = details;
  }
}