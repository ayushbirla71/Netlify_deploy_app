const express= require('express');
const router= express.Router();

const {creatsShoppingItems,getShoppingItems,updateShoppingItems}= require('../controller/shoppingController');
const {removeCart,createCart,updateShoppingCart,getShoppingCart}=require('../controller/shoppingCart')

/////////////////////////////////////////////~ROUTERS~//////////////////////////////////
 router.post('/CreateItems', creatsShoppingItems)
 router.get('/getItems',getShoppingItems)
 router.put('/updateItems',updateShoppingItems)

 router.post('/CreateCart', createCart)
 router.get('/getCart',getShoppingCart)
 router.put('/updateCart',updateShoppingCart)

 router.delete('/RemoveCart',removeCart)


router.all('/*',function(req,res){
    return res.status(400).send({status:false, message:"pls provide valid path"})
})

/////////////////////////////////////////////~MODULE~//////////////////////////////////
module.exports=router