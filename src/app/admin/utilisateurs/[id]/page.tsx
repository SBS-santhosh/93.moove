import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@/lib/constants";

const prisma = new PrismaClient();

/**
 * Page d'Édition d'Utilisateur (CRUD - Update)
 * Permet à l'administrateur de modifier le nom, l'email et le rôle d'un utilisateur existant.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur introuvable</h2>
                    <p className="text-gray-500 mb-6">Cet utilisateur n&apos;existe pas ou a été supprimé.</p>
                    <Link href="/modifsession" className="bg-purple-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-purple-700 transition">
                        Retour au panneau
                    </Link>
                </div>
            </div>
        );
    }

    async function updateUser(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const role = formData.get("role") as string;

        await prisma.user.update({
            where: { id },
            data: { name, email, role },
        });

        revalidatePath("/modifsession");
        redirect("/modifsession");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-purple-200/40 via-indigo-100/10 to-transparent mix-blend-multiply blur-3xl z-0 pointer-events-none" />

            <form
                action={updateUser}
                className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black uppercase shadow-inner">
                            {user.name?.[0] || "?"}
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold">Modifier l&apos;utilisateur</h1>
                            <p className="text-purple-200 text-sm mt-0.5">ID : <span className="font-mono">{user.id.slice(0, 16)}…</span></p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={user.name}
                            required
                            className="block w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:border-purple-400 transition-all font-medium"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                            Adresse e-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            defaultValue={user.email}
                            required
                            className="block w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:border-purple-400 transition-all font-medium"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-1">
                            Rôle
                        </label>
                        <select
                            id="role"
                            name="role"
                            defaultValue={user.role}
                            className="block w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 bg-gray-50 focus:outline-none focus:border-purple-400 transition-all font-medium"
                        >
                            {Object.values(Role).map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Info Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                            Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                        {user.banned && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-red-100 text-red-600 rounded-full">
                                🚫 Banni
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 flex justify-between items-center border-t border-gray-100 pt-6">
                    <Link
                        href="/modifsession"
                        className="inline-flex items-center space-x-2 px-5 py-2.5 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Annuler</span>
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:-translate-y-0.5 hover:shadow-purple-300 transition-all text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Sauvegarder</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
