const prisma = require("../prismaClient");

const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, company, address, status, notes } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Supplier name is required" });
        }

        const supplier = await prisma.supplier.create({
            data: {
                name,
                email,
                phone,
                company,
                address,
                status: status || "ACTIVE",
                notes
            }
        });

        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { createdAt: "desc" }
        });

        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSupplier = async (req, res) => {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                products: true
            }
        });

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const supplier = await prisma.supplier.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });

        res.json(supplier);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        await prisma.supplier.delete({
            where: { id: Number(req.params.id) }
        });

        res.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    getSupplier,
    updateSupplier,
    deleteSupplier
};
