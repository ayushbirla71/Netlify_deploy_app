const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    name:{type:String},
    category:{type:String},
    currencyFormat:{type:String,enum:["₹","$"]},
    price:{type:Number},
    totalPrice:{type:Number},
    totalQuantity:{type:Number},
    image:{type:String}

})

module.exports= mongoose.model('list',listSchema)