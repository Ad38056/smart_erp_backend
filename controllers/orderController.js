const prisma = require("../prismaClient");

const createOrder = async (req, res) => {
    try {
        const { customerId, notes, paymentStatus, status, items } = req.body;

        if (!customerId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Customer and at least one order item are required"
            });
        }

        const customer = await prisma.customer.findUnique({
            where: { id: Number(customerId) }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const orderItems = [];
        let total = 0;

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: Number(item.productId) }
            });

            if (!product) {
                return res.status(404).json({
                    message: `Product with id ${item.productId} not found`
                });
            }

            const quantity = Number(item.quantity || 0);
            if (quantity <= 0) {
                return res.status(400).json({
                    message: `Quantity for product ${product.name} must be greater than 0`
                });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${product.name}`
                });
            }

            const unitPrice = Number(item.price ?? product.price);
            const itemTotal = unitPrice * quantity;

            orderItems.push({
                productId: product.id,
                quantity,
                price: unitPrice,
                total: itemTotal
            });

            total += itemTotal;
        }

        const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
                data: {
                    orderNumber: `ORD-${Date.now()}`,
                    customerId: Number(customerId),
                    status: status || "PENDING",
                    paymentStatus: paymentStatus || "UNPAID",
                    notes,
                    total,
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    customer: true
                }
            });

            for (const item of orderItems) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: product.stock - item.quantity
                    }
                });
            }

            return createdOrder;
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                customer: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await prisma.order.update({
            where: { id: Number(req.params.id) },
            data: req.body,
            include: {
                customer: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.json(order);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        await prisma.order.delete({
            where: { id: Number(req.params.id) }
        });

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
};
