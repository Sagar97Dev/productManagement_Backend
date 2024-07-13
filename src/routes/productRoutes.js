const express = require('express');
const productController = require('../controllers/productcontroller');
const upload = require('../middleware/multerConfig');

const router = express.Router();
router.post('/products', upload.single('image'), productController.createProduct);

router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);

module.exports = router;
