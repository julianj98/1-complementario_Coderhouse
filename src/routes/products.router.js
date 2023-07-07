import { Router } from "express";
//import ProductManager from "../ProductManager.js";
import ProductsManager from "../dao/mongo/manager/products.js";
import { io } from "../app.js";
//const productManager = new ProductManager();

const productsManager = new ProductsManager();

const router = Router();

router.get("/",async (req,res)=>{
    const products= await productsManager.getProducts();
    res.json({status:"ok", data:products});
});

router.post('/',async (req,res)=>{
    const {title, description, code, price , status,stock,category,thumbnail} = req.body
    if (!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({status:"error",message: "no data sent!"})
    }
    try {
        const product = req.body;
        const createdProduct = await productsManager.createProduct(product)
        res.status(201).json({status:"ok",data:createdProduct})
    } catch (error) {
        return     res.status(400).json({status:"error",message:"Cannot get products: "+ error})
    }

})

router.get("/:id",async (req,res)=>{
    const {id} = req.params;
    try {
        const product = await productsManager.getProduct(id);
        res.json({status: "ok", data:product})
    } catch (error) {
         return     res.status(400).json({status:"error",message:"Cannot get product: "+ error})

    }
})
router.put("/:id",async(req,res)=>{
    const {title, description, code, price , status,stock,category,thumbnail} = req.body
    if (!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({status:"error",message: "no data sent!"})
    }
    const {id} = req.params;
    const newProduct=req.body;
    try {
        await productsManager.updateProduct(id,newProduct);
        res.json({status:"ok", data:newProduct})
    } catch (error) {
        return res.status(400).json({status:"error",message:"Cannot update product: "+ error})
    }

})

router.delete("/:id",async(req,res)=>{
    const {id} = req.params;
    try {
        await productsManager.deleteProduct(id);
        res.json({status:"success"});
    } catch (error) {
        return res.status(400).json({status:"error",message:"Cannot delete product: "+ error})        
    }

})

/*
router.get("", (req, res) => {
    const products = productManager.getProducts();
    const { limit } = req.query
    if (!limit) res.json(products)
    else {
        const productsLimit = products.slice(0, parseInt(limit));
        res.json(productsLimit);
    }
});
router.get("/:id", (req, res) => {
    const { id } = req.params
    const products = productManager.getProducts();
    const productById = products.find(productById => productById.id == id);
    if (productById) return res.json(productById);
    else res.json({ error: "Product does not exist" });
})
router.post("", (req, res) => {
    const { title, description, code, price, stock, category, thumbnail } = req.body;
    const newProduct = productManager.addProduct(title, description, code, price, true, stock, category, thumbnail);
    if (newProduct === 'El código ya existe') {
        res.status(400).json({ error: 'El código ya existe' });
    } else if (newProduct === 'Producto agregado exitosamente') {
        io.emit("productUpdated",productManager.getProducts());
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } else if (newProduct === 'Todos los campos obligatorios deben ser completados') {
        res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
    } else {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id); 
    const { title, description, code, price, stock, category, thumbnail } = req.body;
    const fieldsToUpdate = {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
    };
    const updateProducts = productManager.updateProduct(parsedId, fieldsToUpdate);
    if (updateProducts ==='producto modificado'){
        io.emit("productUpdated",productManager.getProducts());
        res.status(201).json({ message: 'Producto modificado exitosamente' });
    } else if(updateProducts ==='Producto no encontrado') {
        res.status(400).json({ error: 'el producto no existe' });
    }
  });

  router.delete("/:id",(req,res)=>{
    const { id } = req.params;
    const parsedId = parseInt(id); 
    const deleteProduct = productManager.deleteProduct(parsedId)
    if (deleteProduct ==='producto eliminado'){
        io.emit("productUpdated",productManager.getProducts());
        res.status(201).json({ message: 'Producto eliminado exitosamente' });
    } else if(deleteProduct ==='Producto no encontrado') {
        res.status(400).json({ error: 'el producto no existe' });
    }
  })
*/
export default router;
