import express from 'express';
import controller from '../controllers/massifs';
const router = express.Router();

router.get('/massifs', controller.getMassifs);
/*router.get('/posts/:id', controller.getPost);
router.put('/posts/:id', controller.updatePost);
router.delete('/posts/:id', controller.deletePost);
router.post('/posts', controller.addPost);*/

export = router;