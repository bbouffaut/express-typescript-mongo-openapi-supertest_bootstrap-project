import express from 'express';
import controller from '../../controllers/massifs';
const router = express.Router();

router.get('/massifs', controller.getMassifs);
router.get('/massifs/:id', controller.getMassif);


export { router };