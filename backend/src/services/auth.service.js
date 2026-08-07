import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/email.js";
import { defaultAuthRepository } from "../repositories/auth.repository.js";
import { SecurityValidator } from "../utils/security.validator.js";
import { sanitizeUserDTO } from "../types/interfaces.js";
import { ApiError } from "../utils/apiError.js";

export class AuthService {
    constructor(authRepository = defaultAuthRepository) {
        this.authRepository = authRepository;
    }

    async signUp({ name, email, password }) {
        const cleanEmail = SecurityValidator.validateEmail(email);
        const cleanPassword = SecurityValidator.validatePassword(password);
        const cleanName = SecurityValidator.sanitizeString(name);

        if (!cleanName) {
            throw new ApiError(400, "Name is required");
        }

        const existingUser = await this.authRepository.findUserByEmail(cleanEmail);
        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);
        const newUser = await this.authRepository.createUser({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
        });

        const safeUser = sanitizeUserDTO(newUser);
        const token = generateToken({ id: safeUser.id });

        return { user: safeUser, token };
    }

    async signIn({ email, password }) {
        const cleanEmail = SecurityValidator.validateEmail(email);
        if (!password) {
            throw new ApiError(400, "Password is required");
        }

        const user = await this.authRepository.findUserByEmail(cleanEmail);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);
        if (!isPasswordSame) {
            throw new ApiError(401, "Invalid credentials");
        }

        const safeUser = sanitizeUserDTO(user);
        const token = generateToken({ id: safeUser.id });

        return { user: safeUser, token };
    }

    async forgotPassword({ email }) {
        const cleanEmail = SecurityValidator.validateEmail(email);

        const user = await this.authRepository.findUserByEmail(cleanEmail);
        if (!user) {
            throw new ApiError(404, "user not found");
        }

        const token = generateToken({ id: user.id, expiresIn: "30m" });
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        const reset = await this.authRepository.createPasswordReset({
            userId: user.id,
            token,
            expiresAt,
            used: false,
        });

        await sendEmail({
            to: cleanEmail,
            subject: "Reset Your My-Social Password",
            templateName: "passwordReset.html",
            variables: {
                name: user.name,
                resetLink: `${process.env.FRONTEND_URL}?token=${token}`,
            },
        });

        return reset;
    }

    async resetPassword({ token, newPassword, confirmPassword }) {
        if (!token) {
            throw new ApiError(400, "Missing token parameter");
        }
        const cleanPassword = SecurityValidator.validatePassword(newPassword);
        if (cleanPassword !== confirmPassword) {
            throw new ApiError(400, "Passwords do not match");
        }

        const resetRecord = await this.authRepository.findPasswordResetByToken(token);
        if (!resetRecord) {
            throw new ApiError(404, "Token not found");
        }

        if (Date.now() > resetRecord.expiresAt) {
            throw new ApiError(400, "Token is expired");
        }

        if (resetRecord.used) {
            throw new ApiError(400, "Token is already used");
        }

        const user = await this.authRepository.findUserById(resetRecord.userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);
        const updateUser = await this.authRepository.updateUserPassword(resetRecord.userId, hashedPassword);
        const updateReset = await this.authRepository.markPasswordResetUsed(token);

        const safeUser = sanitizeUserDTO(updateUser);

        return { user: safeUser, reset: updateReset };
    }
}

export const defaultAuthService = new AuthService();
