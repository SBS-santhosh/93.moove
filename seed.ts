import * as dotenv from "dotenv";
import path from "path";

// Load environment variables before importing auth
dotenv.config({ path: path.resolve(__dirname, "./.env") });

import { PrismaClient } from "@prisma/client";
import { Role } from "./src/lib/constants";
import { auth } from "./src/lib/auth";

const prisma = new PrismaClient();

const PASS = "password123";

async function main() {
    console.log("🚀 Starting Better Auth compatible data seeding (String IDs)...");

    // 1. Create Salles (Rooms)
    console.log("Creating rooms...");
    const salleA = await prisma.salle.create({ data: { name: "Studio Zen", capacity: 20, disponible: true } });
    const salleB = await prisma.salle.create({ data: { name: "Grande Salle Polyvalente", capacity: 60, disponible: true } });
    const salleC = await prisma.salle.create({ data: { name: "Espace Tatami", capacity: 15, disponible: true } });
    const salles = [salleA, salleB, salleC];

    // 2. Create Standard Role Users via Better Auth API
    console.log("Creating standard users via Better Auth API...");
    const rolesData = [
        { email: "admin@93moove.com", name: "Marc Admin", role: Role.ADMIN },
        { email: "prof@93moove.com", name: "Sarah Professeur", role: Role.PROFESSEUR },
        { email: "anim@93moove.com", name: "Lucas Animateur", role: Role.ANIMATEUR },
        { email: "adulte@93moove.com", name: "Julie Adhérente", role: Role.ADHERENT_ADULTE },
    ];

    const standardUsers = [];
    for (const r of rolesData) {
        console.log(`Creating ${r.role}: ${r.email}...`);
        try {
            const result = await auth.api.signUpEmail({
                body: {
                    email: r.email,
                    password: PASS,
                    name: r.name,
                }
            });
            
            if (!result) throw new Error("Sign up failed");

            // Update role manually and force verified status
            const u = await prisma.user.update({
                where: { email: r.email },
                data: { role: r.role, emailVerified: true }
            });
            standardUsers.push(u);
        } catch (e) {
            console.error(`Error creating standard user ${r.email}:`, e);
        }
    }

    // 3. Create 30 Dummy Users (Spam) via Better Auth API
    console.log("Generating 30 dummy users via Better Auth API...");
    const firstNames = ["Thomas", "Emma", "Julien", "Chloé", "Maxime", "Léa", "Antoine", "Manon", "Nicolas", "Sarah"];
    const lastNames = ["Dupont", "Martin", "Bernard", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent"];
    const dummyUsers = [];

    for (let i = 0; i < 30; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@demo.com`;
        const role = i % 10 === 0 ? Role.PROFESSEUR : Role.ADHERENT_ADULTE;

        try {
            await auth.api.signUpEmail({
                body: {
                    email,
                    password: PASS,
                    name: `${firstName} ${lastName}`,
                }
            });
            
            const u = await prisma.user.update({
                where: { email },
                data: { role, emailVerified: true }
            });
            dummyUsers.push(u);
        } catch (e) {
            // Ignore errors for dummy users
        }
    }

    // 4. Create Minor (Mineur) Users linked to Adults
    console.log("Creating minor users...");
    const adultUsers = dummyUsers.filter(u => u.role === Role.ADHERENT_ADULTE);
    if (adultUsers.length > 0) {
        for (let i = 0; i < 10; i++) {
            const parent = adultUsers[Math.floor(Math.random() * adultUsers.length)];
            await prisma.profilEnfant.create({
                data: {
                    nom: parent.name.split(" ")[1] || "Doe",
                    prenom: `Enfant_${i}`,
                    dateNaissance: new Date(2015, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
                    parentId: parent.id // parent.id is now a String
                }
            });
        }
    }

    // 5. Create 15 Sessions
    console.log("Generating 15 diverse sessions...");
    const baseProf = standardUsers.find(u => u.role === Role.PROFESSEUR);
    const professors = dummyUsers.filter(u => u.role === Role.PROFESSEUR);
    if (baseProf) professors.push(baseProf);

    if (professors.length > 0) {
        const sessionTitles = ["Yog'Art Flow", "Karaté Kidz", "Danse Urbaine", "Pilates Core", "Zumba Fun", "Méditation Guidée", "Stage de Cirque", "Théatre d'Impro"];
        const sessions = [];
        for (let i = 0; i < 15; i++) {
            const prof = professors[Math.floor(Math.random() * professors.length)];
            const salle = salles[Math.floor(Math.random() * salles.length)];
            const title = sessionTitles[Math.floor(Math.random() * sessionTitles.length)] + ` #${i + 1}`;
            
            const date = new Date();
            date.setDate(date.getDate() + (Math.floor(Math.random() * 14) - 2)); 
            date.setHours(9 + Math.floor(Math.random() * 10), 0, 0, 0);

            const s = await prisma.session.create({
                data: {
                    title,
                    type: i % 2 === 0 ? "cours" : "activite",
                    description: "Une super session pour bouger ensemble au 93Moove ! Venez motivés et avec une bouteille d'eau.",
                    date,
                    duree: 60 + (Math.floor(Math.random() * 3) * 30),
                    salleId: salle.id,
                    instructeurId: prof.id, // now String
                    capaciteMax: 10 + Math.floor(Math.random() * 20),
                    image: `https://picsum.photos/seed/${i + 300}/800/400`
                }
            });
            sessions.push(s);
        }

        // 6. Bulk Inscriptions (Enrollments)
        console.log("Populating inscriptions...");
        const registeredUsers = dummyUsers.filter(u => u.role === Role.ADHERENT_ADULTE);
        for (const session of sessions) {
            const numInscriptions = 2 + Math.floor(Math.random() * 5); 
            const selectedUsers = [...registeredUsers].sort(() => 0.5 - Math.random()).slice(0, numInscriptions);
            for (const user of selectedUsers) {
                try {
                    await prisma.inscription.create({
                        data: {
                            userId: user.id, // now String
                            sessionId: session.id
                        }
                    });
                } catch (e) {}
            }
        }
    }

    console.log("✅ Seeding completed! Database is aligned with Better Auth String IDs.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
