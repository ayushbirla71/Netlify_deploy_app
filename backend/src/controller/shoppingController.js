const shoppingModel= require('../models/shoppingModel')

const creatsShoppingItems = async (req,res)=>{
    try {
        let data= req.body
        let {name,category,currencyFormat,price,totalPrice,totalQuantity,image}=data
        if(!name)return res.status(400).send({status:false,message:"name is mandetry"})
        if(!category)return res.status(400).send({status:false,message:"category is mandetry"})
        if(!currencyFormat)return res.status(400).send({status:false,message:"currencyFormat is mandetry"})
        if(!price)return res.status(400).send({status:false,message:"price is mandetry"})

        let createdData= await shoppingModel.create(data)
        return res.status(201).send({status:true,message:"created successful",data:createdData})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const getShoppingItems= async (req,res)=>{
    try {
        let body=req.query
        console.log(body)
        let data= await shoppingModel.findOne(body)
        return res.status(201).send({status:true,message:"all items",data:data})
    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

const updateShoppingItems = async (req,res)=>{
    try {
        console.log(req.body)
        const {_id,name,category,currencyFormat,price,totalPrice,totalQuantity,image} = req.body
        let Obj={}
        if(currencyFormat){
            Obj.currencyFormat=currencyFormat
        }
        if(totalPrice){
            Obj.totalPrice=totalPrice
        }
        if(totalQuantity){
            Obj.totalQuantity=totalQuantity
        }
        let updateData= await shoppingModel.findByIdAndUpdate(_id,{Obj},{new:true})

        return res.status(200).send({status:true,message:"updated",data:updateData})

    } catch (error) {
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports={creatsShoppingItems, getShoppingItems, updateShoppingItems}