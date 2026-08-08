const bcrypt = require("bcrypt");
const prisma = require("../prismaClient");

const seedDemoData = async (req, res) => {
    try {
        const existingAdmin = await prisma.user.findUnique({
            where: { email: "admin@smarterp.com" }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await prisma.user.create({
                data: {
                    name: "System Admin",
                    email: "admin@smarterp.com",
                    password: hashedPassword,
                    role: "ADMIN",
                    status: "ACTIVE"
                }
            });
        }

        let supplierA = await prisma.supplier.findFirst({
            where: { name: "Northwind Supply" }
        });
        if (!supplierA) {
            supplierA = await prisma.supplier.create({
                data: {
                    name: "Northwind Supply",
                    email: "sales@northwind.com",
                    phone: "+1-555-0101",
                    company: "Northwind Supply Co.",
                    address: "15 Market Street, Boston",
                    status: "ACTIVE",
                    notes: "Primary electronics supplier"
                }
            });
        }

        let supplierB = await prisma.supplier.findFirst({
            where: { name: "Eastern Goods" }
        });
        if (!supplierB) {
            supplierB = await prisma.supplier.create({
                data: {
                    name: "Eastern Goods",
                    email: "ops@easterngoods.com",
                    phone: "+1-555-0102",
                    company: "Eastern Goods Ltd.",
                    address: "90 Industrial Way, Chicago",
                    status: "ACTIVE",
                    notes: "Office and consumables supplier"
                }
            });
        }

        let customerA = await prisma.customer.findFirst({
            where: { name: "Apex Retail" }
        });
        if (!customerA) {
            customerA = await prisma.customer.create({
                data: {
                    name: "Apex Retail",
                    email: "ops@apexretail.com",
                    phone: "+1-555-0201",
                    company: "Apex Retail",
                    address: "200 Main Avenue, New York",
                    status: "VIP",
                    notes: "High-value recurring client"
                }
            });
        }

        let customerB = await prisma.customer.findFirst({
            where: { name: "Metro Dynamics" }
        });
        if (!customerB) {
            customerB = await prisma.customer.create({
                data: {
                    name: "Metro Dynamics",
                    email: "buying@metrodynamics.com",
                    phone: "+1-555-0202",
                    company: "Metro Dynamics",
                    address: "310 Innovation Park, Austin",
                    status: "ACTIVE",
                    notes: "Wholesale buyer"
                }
            });
        }

        let productA = await prisma.product.findFirst({
            where: { name: "Laptop Pro 14" }
        });
        if (!productA) {
            productA = await prisma.product.create({
                data: {
                    name: "Laptop Pro 14",
                    category: "Electronics",
                    description: "Business laptop for remote teams",
                    price: 1299.99,
                    stock: 18,
                    image: "https://example.com/laptop-pro.jpg",
                    supplierId: supplierA.id
                }
            });
        }

        let productB = await prisma.product.findFirst({
            where: { name: "Office Desk Chair" }
        });
        if (!productB) {
            productB = await prisma.product.create({
                data: {
                    name: "Office Desk Chair",
                    category: "Furniture",
                    description: "Ergonomic chair for office spaces",
                    price: 249.5,
                    stock: 12,
                    image: "https://example.com/chair.jpg",
                    supplierId: supplierB.id
                }
            });
        }

        let productC = await prisma.product.findFirst({
            where: { name: "USB-C Hub" }
        });
        if (!productC) {
            productC = await prisma.product.create({
                data: {
                    name: "USB-C Hub",
                    category: "Accessories",
                    description: "Compact multiport adapter",
                    price: 79.99,
                    stock: 35,
                    image: "https://example.com/hub.jpg",
                    supplierId: supplierA.id
                }
            });
        }

        const existingOrder = await prisma.order.findFirst({
            where: { orderNumber: "ORD-1001" }
        });
        if (!existingOrder) {
            await prisma.order.create({
                data: {
                    orderNumber: "ORD-1001",
                    customerId: customerA.id,
                    status: "PROCESSING",
                    paymentStatus: "PARTIAL",
                    total: productA.price + productC.price,
                    notes: "First recurring order",
                    items: {
                        create: [
                            {
                                productId: productA.id,
                                quantity: 1,
                                price: productA.price,
                                total: productA.price
                            },
                            {
                                productId: productC.id,
                                quantity: 2,
                                price: productC.price,
                                total: productC.price * 2
                            }
                        ]
                    }
                }
            });
        }

        res.json({
            message: "Demo ERP data seeded successfully",
            admin: {
                email: "admin@smarterp.com",
                password: "admin123"
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    seedDemoData
};
