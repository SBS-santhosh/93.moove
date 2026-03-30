import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { auth } from "../src/lib/auth";
import { PrismaClient } from "@prisma/client";
import { Role } from "../src/lib/constants";

const prisma = new PrismaClient();

async function setupAdmin() {
    const email = "admin@93moove.com";
    const password = "password123";
    const name = "Admin";

    console.log(`Checking if user ${email} exists...`);

    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log("User not found. Creating new account via Better Auth...");
        try {
            // signUpEmail handles password hashing automatically
            const result = await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                }
            });
            console.log("Account created successfully.");
        } catch (error) {
            console.error("Error creating account:", error);
            process.exit(1);
        }
    } else {
        console.log("User already exists. Updating password and ensuring ADMIN role...");
        // If user exists, we can force update the password
        await auth.api.setUserPassword({
            body: {
                userId: user.id.toString(),
                newPassword: password
            }
        });
    }

    console.log("Promoting user to ADMIN role...");
    await prisma.user.update({
        where: { email },
        data: {
            role: Role.ADMIN
        }
    });

    console.log(`Done! You can now log in with:
Email: ${email}
Password: ${password}
`);
}

setupAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
