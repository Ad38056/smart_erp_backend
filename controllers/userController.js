const prisma = require("../prismaClient");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                avatar: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, avatar } = req.body;

        const user = await prisma.user.update({
            where: { id: Number(req.user.id) },
            data: {
                name,
                phone,
                address,
                avatar
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                avatar: true,
                status: true,
                updatedAt: true
            }
        });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id) }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                address: true,
                avatar: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !["ADMIN", "USER"].includes(role)) {
            return res.status(400).json({ message: "Role must be ADMIN or USER" });
        }

        const user = await prisma.user.update({
            where: { id: Number(req.params.id) },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.json(user);
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getUsers,
    updateUserRole
};
