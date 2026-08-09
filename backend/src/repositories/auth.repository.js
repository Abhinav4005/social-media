import { prisma } from "../lib/prisma.js";

/**
 * Auth Repository handling user authentication and password reset database persistence.
 * Adheres to SRP & DIP.
 */
export class AuthRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async findUserByEmail(email) {
        return await this.db.user.findUnique({ where: { email } });
    }

    async findUserById(id) {
        return await this.db.user.findUnique({ where: { id } });
    }

    async createUser(data) {
        return await this.db.user.create({ data });
    }

    async updateUserPassword(userId, hashedPassword) {
        return await this.db.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
    }

    async createPasswordReset(data) {
        return await this.db.passwordReset.create({ data });
    }

    async findPasswordResetByToken(token) {
        return await this.db.passwordReset.findUnique({ where: { token } });
    }

    async markPasswordResetUsed(token) {
        return await this.db.passwordReset.update({
            where: { token },
            data: {
                usedAt: new Date(),
                used: true,
            }
        });
    }
}

export const defaultAuthRepository = new AuthRepository();
