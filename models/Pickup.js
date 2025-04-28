import mongoose from 'mongoose';

const pickupSchema = new mongoose.Schema({
  // TODO: 수거 요청 스키마 정의
}, {
  timestamps: true,
});

const Pickup = mongoose.model('Pickup', pickupSchema);

export default Pickup;
