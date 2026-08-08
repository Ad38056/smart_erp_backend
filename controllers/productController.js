const prisma = require("../prismaClient");

const createProduct = async (req, res) => {
    try {
        const { name, category, description, price, stock, image, supplierId } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Product name is required" });
        }

        if (Number(price) < 0 || Number(stock) < 0) {
            return res.status(400).json({
                message: "Price and stock cannot be negative"
            });
        }

        const product = await prisma.product.create({
            data: {
                name,
                category,
                description,
                price: Number(price),
                stock: Number(stock || 0),
                image,
                supplierId: supplierId ? Number(supplierId) : null
            }
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                supplier: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                supplier: true,
                orderItems: true
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await prisma.product.update({
            where: { id: Number(req.params.id) },
            data: {
                ...req.body,
                price: req.body.price !== undefined ? Number(req.body.price) : undefined,
                stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined,
                supplierId: req.body.supplierId !== undefined ? Number(req.body.supplierId) : undefined
            }
        });

        res.json(product);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await prisma.product.delete({
            where: { id: Number(req.params.id) }
        });

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};