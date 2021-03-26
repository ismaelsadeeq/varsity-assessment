var express = require('express');
var router = express.Router();
const controller = require('../controllers/product.controller')

const cors = require('../config/cors');

/* GET home page. */
router.get('/',
  cors.cors,
  controller.getProducts
);

router.get('/product/:id',
  cors.cors,
  controller.getSingleProduct
);

router.post('/create',
  cors.cors,
  controller.createProduct
);

router.put('/edit/:id',
  cors.cors,
  controller.editProduct
);

router.put('/delete/:id',
  cors.cors,
  controller.deleteProductVarieties
);

module.exports = router;
