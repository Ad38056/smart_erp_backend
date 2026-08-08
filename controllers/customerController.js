const prisma = require("../prismaClient");

const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, company, address, status, notes } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const customer = await prisma.customer.create({
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

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCustomers = async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCustomer = async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                orders: true
            }
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customer = await prisma.customer.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });

        res.json(customer);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        await prisma.customer.delete({
            where: { id: Number(req.params.id) }
        });

        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
};
