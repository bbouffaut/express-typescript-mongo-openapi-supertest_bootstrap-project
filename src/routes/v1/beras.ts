import express from 'express';
import controller from '../../controllers/v1/beras';
const router = express.Router();

router.get('/beras', controller.getBeras);
router.get('/beras/:id', controller.getBera);


export { router };