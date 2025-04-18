import express from 'express';
import { addProduct,getAllProducts } from '../controller/productController.mjs';
import { uploadImage } from '../Middleware/upload.mjs';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/add', uploadImage, addProduct);

export default router;