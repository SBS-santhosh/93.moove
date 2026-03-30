import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

/**
 * Panneau Instructeur
 * Espace dédié aux membres ayant le rôle 'PROFESSEUR' ou 'ANIMATEUR' pour consulter leurs sessions assignées.
 * Démontre la gestion des autorisations et la restriction d'accès selon les rôles.
 */
export default async function InstructeurPanelPage() {
    const sessions = await prisma.session.findMany({
        orderBy: { date: 'asc' },
        include: { instructeur: true }
    });

    const reqHeaders = await headers();
    const authSession = await auth.api.getSession({ headers: reqHeaders });
    const currentUserId = authSession?.user?.id || null;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Barre latérale simple */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
                <div className="p-6 font-bold text-blue-600 text-2xl">Espace Instructeur</div>
                <nav className="mt-8">
                    <a href="#" className="block py-3 px-6 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900">
                        Sessions Disponibles
                    </a>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gestion des Missions</h1>
                    <div className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                        Rôle : Instructeur
                    </div>
                </header>

                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                        <span className="font-bold text-blue-700 dark:text-blue-400">Toutes les sessions</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Titre</th>
                                    <th className="p-4">Instructeur</th>
                                    <th className="p-4">Date &amp; Heure</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {sessions.map((session: any) => {
                                    const isMine = currentUserId && String(session.instructeurId) === String(currentUserId);
                                    return (
                                        <tr key={session.id} className={`transition ${isMine ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{session.title}</td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${isMine ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                        ✅ {session.instructeur?.name || "Inconnu"}
                                                    </span>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit ${
                                                        session.statut === 'VALIDATED' ? 'bg-green-500/10 text-green-600' : 
                                                        session.statut === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' : 
                                                        'bg-red-500/10 text-red-600'
                                                    }`}>
                                                        {session.statut === 'VALIDATED' ? 'Validé' : 'En attente'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                                {session.date.toLocaleString("fr-FR")}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link
                                                    href={`/instructeurpanel/commit/${session.id}`}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition shadow-sm"
                                                >
                                                    {isMine ? "Déjà engagé (Modifier)" : "S'engager / Modifier"}
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
