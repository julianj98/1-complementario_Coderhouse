import mongoose from "mongoose"

const productCollection = "products"
//title, description, code, price, status = true, stock, category, thumbnail
const productSchema= new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type:String,
        unique:true,
    },
    price: Number,
    status:Boolean,
    stock:Number,
    category:String,
    thumbnail:String,

})

const productModel= mongoose.model(productCollection,productSchema)
export default productModel