import productModel from "../models/product.js"

export default class ProductsManager{
    getProducts=(params) =>{
        return productModel.find().lean();
    }
    getProduct=(id)=>{
        return productModel.findById(id);
    }

    createProduct = (product) => {
        return productModel.create(product)
    }

    updateProduct= (id,product)=>{
        return productModel.findByIdAndUpdate(id,product)
    }

    deleteProduct= (id) =>{
        return productModel.findByIdAndDelete(id)
    }

}