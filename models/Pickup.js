import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  // TODO: 수거 요청 스키마 정의
  customerName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  requestDetails: {
    type: String,
    required: true
  },

}, {
  timestamps: true,
});

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;