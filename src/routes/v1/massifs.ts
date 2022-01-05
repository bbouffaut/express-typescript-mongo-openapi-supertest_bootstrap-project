import express from 'express';
import controller from '../../controllers/v1/massifs';
const router = express.Router();

router.get('/massifs', controller.getMassifs);
router.get('/massifs/:id', controller.getMassif);


export { router };