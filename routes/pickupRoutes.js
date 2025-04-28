import express from 'express';
import * as pickupController from '../controllers/pickupController.js';

const router = express.Router();

router.post('/', pickupController.createPickupRequest);
router.get('/', pickupController.getPickupRequests);
router.delete('/:id', pickupController.cancelPickupRequest);
router.patch('/:id', pickupController.updatePickupRequest);

export default router;
