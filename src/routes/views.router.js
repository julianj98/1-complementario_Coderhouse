import express from "express";
const router = express.Router();
import ProductManager from "../dao/filesystem/manager/ProductManager.js";
const productManager = new ProductManager();

router.get("/realtimeproducts", (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
});



export default router;