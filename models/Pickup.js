import mongoose from 'mongoose';
import { VALIDATION } from '../config/constants.js';

const pickupSchema = new mongoose.Schema({
  // TODO: 수거 요청 스키마 정의
  customerName: {
    type: String,
    min: VALIDATION.CUSTOMER_NAME.MIN_LENGTH,
    max: VALIDATION.CUSTOMER_NAME.MAX_LENGTH,
    required: true
  },
  address: {
    type: String,
    min: VALIDATION.ADDRESS.MIN_LENGTH,
    max: VALIDATION.ADDRESS.MAX_LENGTH,
    required: true
  },
  phoneNumber: {
    type: String,
    PATTERN : VALIDATION.PHONE_NUMBER.PATTERN,
    required: true
  },
  requestDetails: {
    type: String,
    min: VALIDATION.REQUEST_DETAILS.MIN_LENGTH,
    max: VALIDATION.REQUEST_DETAILS.MAX_LENGTH,
    required: true
  },

}, {
  timestamps: true,
});

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;