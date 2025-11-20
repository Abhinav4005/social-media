import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/email.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        const { password: _, ...userWithoutPassword } = newUser;
        const token = generateToken({ id: userWithoutPassword.id });
        return res.status(201).json({ message: "User created successfully", user: userWithoutPassword, token });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const { password: _, ...userWithoutPassword } = user;
        const token = generateToken({ id: userWithoutPassword.id });
        return res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });
    } catch (error) {

        console.error("Error during sign in:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const token = generateToken({ id: user?.id, expiresIn: "30m" })

        const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

        const reset = await prisma.passwordReset.create({
            data: {
                userId: user?.id,
                token: token,
                expiresAt: expiresAt,
                used: false,

            }
        });

        await sendEmail({
            to: email,
            subject: "Reset Your My-Social Password",
            templateName: "passwordReset.html",
            variables: {
                name: user?.name,
                resetLink: `${process.env.FRONTEND_URL}?token=${token}`
            }
        });

        return res.status(200).json({
            message: "Password reset link sent successfully",
            reset: reset
        })
    } catch (error) {
        console.error("Error in forgot password: ", error)
        return res.status(500).json({ message: `Error in forgot-password: ${error}` })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if(newPassword !== confirmPassword){
            return res.status(400).json({ message: "Passwords do not match"})
        }

        const resetRecord = await prisma.passwordReset.findUnique({
            where: { token: token }
        })

        if (!resetRecord) {
            return res.status(404).json({ message: "Token not found" });
        }

        if(Date.now() > resetRecord.expiresAt){
            return res.status(400).json({ message: "Token is expired" });
        }

        if(resetRecord.used){
            return res.status(400).json({ message: "Token is already used" });
        }

        const user = await prisma.user.findUnique({
            where: { id: resetRecord?.userId }
        });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(confirmPassword, 10);

        const updateUser = await prisma.user.update({
            where: {id: resetRecord?.userId},
            data:{
                password: hashedPassword
            }
        });

        const updateReset = await prisma.passwordReset.update({
            where:{ token: token},
            data:{
                usedAt: new Date(Date.now()),
                used: true,
            }
        })

        const {password:_, ...userWithoutPassword} = updateUser;

        return res.status(200).json({ 
            message: "Password reset successfully",
            user: userWithoutPassword,
            reset: updateReset
        })
    } catch (error) {
        console.error("Error in resetting password: ", error);
        return res.status(500).json({ message: `Error in resetting password: ${error}`})
    }
}