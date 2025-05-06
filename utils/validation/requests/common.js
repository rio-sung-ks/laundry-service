import { LENGTH_VALID_RULES } from '../../../config/constants.js';
import { MESSAGES, CODE } from '../../../config/constants.js';

import { isObjectIdOrHexString } from 'mongoose';

import { ValidationError, NotFoundError } from '../../error/error.js';

function validateMissingField(field, value, isUpdate) {
  if (
    value === undefined
    || value === null
    || value.trim() === ''
  ) {
    if (isUpdate) {
      throw new ValidationError(
        MESSAGES.ERROR.MISSING_REQUEST_DETAILS,
        CODE.MISSING_REQUEST_DETAILS,
        {
          field,
          constraint: 'required'
        }
      );
    }
    throw new ValidationError(
      MESSAGES.ERROR.MISSING_REQUIRED_FIELD,
      CODE.MISSING_REQUIRED_FIELD,
      {
        field,
        constraint: 'required'
      }
    );
  }
}

function validateLength(field, value) {
  const rules = LENGTH_VALID_RULES[field];

  if (
    value.length < rules.minLength
    || value.length > rules.maxLength
  ) {
    throw new ValidationError(
      rules.message,
      rules.code,
      {
        field,
        value,
        constraint: rules.constraint
      }
    );
  }
}

function validateId(id) {
  if (!isObjectIdOrHexString(id)) {
    throw new ValidationError(
      MESSAGES.ERROR.INVALID_REQUEST_ID,
      CODE.INVALID_REQUEST_ID,
      {
        field: 'id',
        value: 'invalid-id-format',
        constraint: '24자리 16진수 문자열'
      }
    );
  }
}

function validateNotFoundDocs(isTrue, errDetails) {
  if (isTrue) {
    if (errDetails.start) {
      throw new NotFoundError(
        MESSAGES.ERROR.NO_RECORDS_FOUND,
        CODE.NO_RECORDS_FOUND,
        errDetails
      );
    }
    throw new NotFoundError(
      MESSAGES.ERROR.PICKUP_NOT_FOUND,
      CODE.PICKUP_NOT_FOUND,
      errDetails
    );
  }
}

export { validateMissingField, validateLength, validateId, validateNotFoundDocs };
