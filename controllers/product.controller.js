const models = require('../models');
const multer = require('multer');
const multerConfig = require('../config/multer');;


async function getProducts(req,res){
  let product = await models.product.findAndCountAll();
  if(product){
    let noOfproduct = product.count;
	let pageLimit = parseInt(req.query.pageLimit);
	
	let currentPage = parseInt(req.query.currentPage);
	let pages = noOfproduct / pageLimit;
	let numberOfPages = Math.ceil(pages);
  
	let	skip = currentPage * pageLimit
			const products = await models.product.findAll(
			{
				order:[['updatedAt','DESC']],
				offset:skip,limit:pageLimit
			})
	return res.json({'status':'success','message':'there are '+ numberOfPages +' pages','data':{
		'total':noOfproduct,
		'pages':numberOfPages,
		'products':products
	}});
  }
	return res.json("no products")
}

async function getSingleProduct(req,res){
  productId = req.params.id
	const product = await models.product.findOne({where:{id:productId}});
	res.json({'status':'success','data':product});
}

async function createProduct(req,res){
  multerConfig.multipleUpload(req, res, async function(err) {
    const data = req.body;
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
        return res.json(err);
    } else if(!req.files && !req.file){
      const product = await models.product.create({
        product_name:data.product_name,
        product_description:data.product_description,
        product_varieties:{
          "size":data.size,
          "color":data.color,
          "quantity":data.quantity,
          "images":[],
          "price":data.price
        }
      });
        res.json({'status':'success','message':'product uploaded'})
    } else if(req.file || req.files){
      let images = [];
      for(var i= 0 ;i<=(req.files.length-1); i++){
        images.push(req.files[i].path);
      }
      const product = await models.product.create({
        product_name:data.product_name,
        product_description:data.product_description,
        product_varieties:{
          "size":data.size,
          "color":data.color,
          "quantity":data.quantity,
          "price":data.price,
          "image":images
        }
      });
      return res.json({'status':'success','message':'uploaded','data':product});   
    };
  })
}

async function editProduct(req,res){
  multerConfig.multipleUpload(req, res, async function(err) {
    const data = req.body;
    const productId = req.params.id;
    const variety = await models.product.findOne(
      {
        where:{id:productId},
        attributes:['product_varieties']
      }
    )
    if (err instanceof multer.MulterError) {
      return res.json(err.message);
    } else if (err) {
        return res.json(err);
    } else if(!req.files && !req.file){
      variety.size = data.size;
      variety.color = data.color;
      variety.quantity = data.quantity;
      variety.price = data.price;
      const product = await models.product.update({
        product_name:data.product_name,
        product_description:data.product_description,
        product_varieties:variety
      },{
        where:{id:productId}
      }
      );
        res.json({'status':'success','message':'product updated'})
    } else if(req.file || req.files){
      console.log(variety.product_varieties);
      let images = [];
      for(var i= 0 ;i<=(req.files.length-1); i++){
        images.push(req.files[i].path);
      }
      variety.product_varieties.size = data.size;
      variety.product_varieties.color = data.color;
      variety.product_varieties.quantity = data.quantity;
      variety.product_varieties.price = data.price;
      variety.product_varieties.image = images;

      const product = await models.product.update({
        product_name:data.product_name,
        product_description:data.product_description,
        product_varieties:variety.product_varieties
      },{
        where:{id:productId}
      }
      );
      return res.json({'status':'success','message':'updated'});   
    };
  })
}

async function deleteProductVarieties(req,res){
  const data = req.body;
    const productId = req.params.id;
    let variety = await models.product.findOne(
      {
        where:{id:productId},
        attributes:['product_varieties']
      }
    )
    let varieties = 5;
    const newVariety = variety.product_varieties
    for(let i =0;i<=varieties;i++){
      if(data.deleteSize){
        delete newVariety.size
      }
      if(data.deleteColor){
        delete newVariety.color
      }
      if(data.deleteQuantity){
        delete newVariety.quantity
      }
      if(data.deleteImage){
        delete newVariety.image
      }
      if(data.deletePrice){
        delete newVariety.price 
      }
    }
    await models.product.update({
      product_varieties : newVariety
    },{
      where:{id:productId}
    })
    return res.json({'status':'success','message':'deleted','trial':variety.product_varieties})
}

module.exports ={
  getProducts,
  getSingleProduct,
  createProduct,
  editProduct,
  deleteProductVarieties

}