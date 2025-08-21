import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ message:"All fields are required"});
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
            data:{
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
        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await prisma.user.findUnique({
            where: { email}
        })
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);

        if(!isPasswordSame){
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