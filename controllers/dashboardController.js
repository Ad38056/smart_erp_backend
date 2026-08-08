const prisma = require("../prismaClient");

const getDashboardSummary = async (req, res) => {
    try {
        const [totalProducts, totalCustomers, totalSuppliers, totalOrders, revenue, lowStock, recentOrders] = await Promise.all([
            prisma.product.count(),
            prisma.customer.count(),
            prisma.supplier.count(),
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: { total: true }
            }),
            prisma.product.findMany({
                where: { stock: { lte: 5 } },
                orderBy: { stock: "asc" },
                take: 10
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    customer: true,
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        ]);

        res.json({
            metrics: {
                totalProducts,
                totalCustomers,
                totalSuppliers,
                totalOrders,
                totalRevenue: Number(revenue._sum.total || 0)
            },
            lowStock,
            recentOrders,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardSummary
};
