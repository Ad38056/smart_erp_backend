const prisma = require("../prismaClient");


// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {

        const { name, category, description, price, stock, image } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                price: Number(price),
                stock: Number(stock),
                image
            }
        });

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {

        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
    try {

        const product = await prisma.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {

        const product = await prisma.product.update({

            where: {
                id: Number(req.params.id)
            },

            data: req.body

        });

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {

        await prisma.product.delete({

            where: {
                id: Number(req.params.id)
            }

        });

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};