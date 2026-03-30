import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        modelName: "AuthSession", // Mapping to avoid collision with standard "Session" model
    },
    user: {
        modelName: "User",
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
    plugins: [
        admin()
    ]
});
