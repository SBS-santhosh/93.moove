import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@/lib/constants";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * Page Ajouter Utilisateur
 * Réservée aux administrateurs pour créer manuellement des comptes avec des rôles spécifiques.
 * Permet de vérifier que la gestion des rôles ("ADMIN", "PROFESSEUR", etc) fonctionne correctement.
 */
export default async function Page() {
    async function ajouterUser(formData: FormData) {
        "use server";
        const nom = formData.get("nom") as string;
        const prenom = formData.get("prenom") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const typeProfil = formData.get("typeprofil") as string;
        // Age is currently not in the schema, you might want to add it later
        // const age = Number(formData.get("age"));

        try {
            // Using Better Auth API to ensure the account is created correctly with hashed password
            await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name: `${nom} ${prenom}`.trim(),
                }
            });

            // Update role manually since signUpEmail only handles standard fields
            const finalRole = typeProfil === "Administrateur" ? Role.ADMIN : typeProfil === "Instructeur" ? Role.PROFESSEUR : Role.ADHERENT_ADULTE;
            
            await prisma.user.update({
                where: { email },
                data: { role: finalRole, emailVerified: true }
            });

            revalidatePath("/modifsession");
            redirect("/modifsession");
        } catch (error) {
            console.error("Failed to create user:", error);
            // In a real app, you'd show an error message to the user
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <form action={ajouterUser} className="w-full max-w-lg space-y-4 p-6 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Ajouter un Utilisateur</h2>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input name="prenom" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nom</label>
                        <input name="nom" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mot de Passe</label>
                    <input name="password" type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type de Profil</label>
                        <select name="typeprofil" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="Utilisateur">
                            <option value="Utilisateur">Utilisateur</option>
                            <option value="Instructeur">Instructeur</option>
                            <option value="Administrateur">Administrateur</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Âge</label>
                        <input name="age" type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" defaultValue="25" />
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Créer l&apos;utilisateur
                    </button>
                    <Link href="/modifsession" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200">
                        Annuler
                    </Link>
                </div>
            </form>
        </div>
    );
}
