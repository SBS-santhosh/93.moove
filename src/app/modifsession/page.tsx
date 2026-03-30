import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Role } from "@/lib/constants";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

/**
 * Dashboard Administration / Gestion
 * Centralise les actions d'administration : gestion des rôles utilisateurs, approbation (statut), édition et suppression de sessions.
 * Couvre les cas (Update, Delete) du CRUD exigés pour les Sessions et Utilisateurs.
 */
export default async function Page() {
    const users = await prisma.user.findMany({
        orderBy: { name: 'asc' }
    });
    
    const sessions = await prisma.session.findMany({
        orderBy: { date: 'asc' },
        include: { 
            instructeur: true,
            _count: { select: { inscriptions: true } }
        }
    }) as any[];

    const validatedInstructors = users.filter((u) => u.role === Role.PROFESSEUR || u.role === Role.ANIMATEUR);
    const pendingSessions = sessions.filter(s => s.statut === "PENDING");
    const validatedSessions = sessions.filter(s => s.statut === "VALIDATED");

    // --- Server Actions ---

    async function updateSessionStatus(formData: FormData) {
        "use server";
        const sessionId = Number(formData.get("sessionId"));
        const newStatus = formData.get("status") as string;
        await prisma.session.update({
            where: { id: sessionId },
            data: { statut: newStatus } as any
        });
        revalidatePath("/modifsession");
        revalidatePath("/sessions");
    }

    async function assignInstructor(formData: FormData) {
        "use server";
        const sessionId = Number(formData.get("sessionId"));
        const instructorId = formData.get("instructorId") as string;
        if (!sessionId || !instructorId) return;
        await prisma.session.update({
            where: { id: sessionId },
            data: { instructeurId: instructorId } as any
        });
        revalidatePath("/modifsession");
    }

    async function updateUserRole(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        const newRole = formData.get("role") as string;
        if (!userId || !newRole) return;
        await prisma.user.update({
            where: { id: userId as any },
            data: { role: newRole }
        });
        revalidatePath("/modifsession");
    }

    async function resetUserPassword(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        const newPassword = formData.get("newPassword") as string;
        if (!userId || !newPassword) return;
        try {
            await auth.api.setUserPassword({
                body: { userId, newPassword }
            });
            revalidatePath("/modifsession");
        } catch (e) {
            console.error("Password reset error:", e);
        }
    }

    async function deleteUser(formData: FormData) {
        "use server";
        const userId = formData.get("userId") as string;
        await prisma.user.delete({
            where: { id: userId as any }
        });
        revalidatePath("/modifsession");
    }

    async function deleteSession(formData: FormData) {
        "use server";
        const sessionId = Number(formData.get("sessionId"));
        await prisma.session.delete({
            where: { id: sessionId }
        });
        revalidatePath("/modifsession");
        revalidatePath("/sessions");
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl sticky top-0 h-screen">
                <div className="p-8">
                    <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-3xl">93Moove</div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Admin Dashboard</p>
                </div>
                <nav className="mt-4 px-4 space-y-1">
                    <a href="#users" className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <span>Utilisateurs</span>
                    </a>
                    <a href="#pending" className="flex items-center justify-between py-3 px-4 text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium">
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Approbations</span>
                        </div>
                        {pendingSessions.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">{pendingSessions.length}</span>
                        )}
                    </a>
                    <a href="#sessions" className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span>Toutes les sessions</span>
                    </a>
                    <hr className="my-4 border-gray-100" />
                    <Link href="/ajoutsession" className="flex items-center space-x-3 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all font-bold shadow-lg shadow-purple-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        <span>Créer Session</span>
                    </Link>
                    <Link href="/ajoututilisateur" className="flex items-center space-x-3 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all font-bold shadow-lg shadow-emerald-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        <span>Créer Utilisateur</span>
                    </Link>
                </nav>
            </aside>

            <div className="flex-1 overflow-y-auto">
                <main className="p-8 space-y-10">
                    {/* Stats Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Vue d&apos;ensemble</h1>
                            <p className="text-gray-500">Gérez les membres, les instructeurs et les plannings.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 min-w-[160px]">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Membres</p>
                                    <h2 className="text-xl font-bold text-gray-900">{users.length}</h2>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 min-w-[160px]">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sessions Validées</p>
                                    <h2 className="text-xl font-bold text-gray-900">{validatedSessions.length}</h2>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Pending Approvals Section */}
                    {pendingSessions.length > 0 && (
                        <section id="pending" className="bg-white rounded-3xl shadow-sm border-2 border-yellow-200 overflow-hidden">
                            <div className="p-6 bg-yellow-50/50 border-b border-yellow-100 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-yellow-500 rounded-xl text-white">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    </div>
                                    <h3 className="font-black text-yellow-900 text-lg uppercase tracking-tight">Approbations Prioritaires</h3>
                                </div>
                                <span className="bg-yellow-200 text-yellow-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">{pendingSessions.length} demandes</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <tr>
                                            <th className="p-6">Détails Session</th>
                                            <th className="p-6">Instructeur Proposé</th>
                                            <th className="p-6">Date Prévue</th>
                                            <th className="p-6 text-center">Action Administrative</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pendingSessions.map((session) => (
                                            <tr key={session.id} className="hover:bg-yellow-50/30 transition-colors">
                                                <td className="p-6">
                                                    <div className="font-bold text-gray-900">{session.title}</div>
                                                    <div className="text-xs font-medium text-purple-500 uppercase mt-0.5 tracking-wider">{session.type}</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs uppercase">
                                                            {session.instructeur?.name?.[0]}
                                                        </div>
                                                        <span className="font-semibold text-gray-700">{session.instructeur?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="text-sm font-medium text-gray-600">{session.date.toLocaleDateString("fr-FR", { day: 'numeric', month: 'long' })}</div>
                                                    <div className="text-xs text-gray-400">{session.date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center space-x-3">
                                                        <form action={updateSessionStatus}>
                                                            <input type="hidden" name="sessionId" value={session.id} />
                                                            <input type="hidden" name="status" value="VALIDATED" />
                                                            <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition shadow-lg shadow-green-100">
                                                                Valider
                                                            </button>
                                                        </form>
                                                        <form action={deleteSession}>
                                                            <input type="hidden" name="sessionId" value={session.id} />
                                                            <button className="bg-white border-2 border-gray-100 hover:border-red-200 hover:text-red-600 text-gray-400 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition">
                                                                Refuser
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Users Section */}
                    <section id="users" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Gestion des Utilisateurs</h3>
                                <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{users.length} membres</span>
                            </div>
                            <Link
                                href="/ajoututilisateur"
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black rounded-xl shadow-md shadow-emerald-100 transition-all hover:-translate-y-0.5 uppercase tracking-widest"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                <span>Créer un utilisateur</span>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-6">Identité</th>
                                        <th className="p-6">Contact & ID</th>
                                        <th className="p-6 text-center">Rôle & Rang</th>
                                        <th className="p-6 text-center">Modifier MDP</th>
                                        <th className="p-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                                                        {user.name?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{user.name || "N/A"}</div>
                                                        <div className="text-[10px] text-gray-400 font-medium">Inscrit le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="text-sm font-medium text-gray-700">{user.email}</div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[120px]">{user.id}</div>
                                            </td>
                                            <td className="p-6">
                                                <form action={updateUserRole} className="flex justify-center items-center space-x-2">
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <select 
                                                        name="role" 
                                                        defaultValue={user.role} 
                                                        className="text-[10px] border-2 border-gray-100 rounded-xl p-2 bg-white outline-none focus:border-purple-300 transition-all font-black uppercase tracking-tighter min-w-[140px]"
                                                    >
                                                        {Object.values(Role).map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                    <button type="submit" className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all" title="Confirmer le rôle">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </button>
                                                </form>
                                            </td>
                                            {/* Password Reset column */}
                                            <td className="p-6">
                                                <form action={resetUserPassword} className="flex items-center space-x-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                                    <input type="hidden" name="userId" value={user.id} />
                                                    <input
                                                        name="newPassword"
                                                        type="text"
                                                        placeholder="Nouveau MDP"
                                                        className="text-[10px] border-none bg-transparent rounded-lg p-1.5 outline-none w-28 font-bold"
                                                        required
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="p-1.5 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg shadow-sm transition-all border border-gray-100"
                                                        title="Réinitialiser MDP"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                                    </button>
                                                </form>
                                            </td>

                                            {/* Edit + Delete column */}
                                            <td className="p-6">
                                                <div className="flex justify-center items-center space-x-2">
                                                    {/* Edit User */}
                                                    <Link
                                                        href={`/admin/utilisateurs/${user.id}`}
                                                        className="inline-flex items-center space-x-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"
                                                        title="Modifier l'utilisateur"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        <span>Éditer</span>
                                                    </Link>

                                                    {/* Delete User */}
                                                    <form action={deleteUser}>
                                                        <input type="hidden" name="userId" value={user.id} />
                                                        <button
                                                            disabled={user.role === Role.ADMIN}
                                                            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm disabled:opacity-20 disabled:cursor-not-allowed"
                                                            title="Supprimer l'utilisateur"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                            <span>Supprimer</span>
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* All Sessions Section */}
                    <section id="sessions" className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Catalogue des Sessions</h3>
                                <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{sessions.length} sessions</span>
                            </div>
                            <Link
                                href="/ajoutsession"
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-md shadow-purple-200 transition-all hover:-translate-y-0.5 uppercase tracking-widest"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                <span>Créer une session</span>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-6">Session</th>
                                        <th className="p-6">Instructeur Assigné</th>
                                        <th className="p-6">Inscrits</th>
                                        <th className="p-6">Statut</th>
                                        <th className="p-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {sessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-gray-900">{session.title}</div>
                                                <div className="text-xs text-gray-400">{session.date.toLocaleDateString("fr-FR")} à {session.date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                            <td className="p-6">
                                                <form action={assignInstructor} className="flex items-center space-x-2">
                                                    <input type="hidden" name="sessionId" value={session.id} />
                                                    <select name="instructorId" defaultValue={session.instructeurId || ""} className="text-xs border-2 border-gray-100 rounded-xl p-2 bg-white outline-none focus:border-purple-300 transition-all font-medium min-w-[150px]">
                                                        <option value="" disabled>Changer l&apos;instructeur</option>
                                                        {validatedInstructors.map(inst => (
                                                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                                                        ))}
                                                    </select>
                                                    <button type="submit" className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Mettre à jour">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </button>
                                                </form>
                                                {session.instructeurId && (
                                                    <div className="text-[10px] text-green-600 font-bold uppercase mt-1 flex items-center">
                                                        <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                                                        Actuel : {session.instructeur?.name}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <Link href={`/sessions/${session.id}`} className="group inline-flex items-center space-x-3 bg-gray-50 hover:bg-white border hover:border-purple-200 p-2 rounded-2xl transition-all cursor-pointer">
                                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                        {session._count.inscriptions}
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Inscrits</div>
                                                        <div className="text-[9px] font-bold text-purple-400 uppercase mt-0.5">Détails →</div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                    session.statut === 'VALIDATED' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                                }`}>
                                                    {session.statut === 'VALIDATED' ? 'Validé' : 'En attente'}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex justify-center space-x-2">
                                                    <Link href={`/modifsession/${session.id}`} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </Link>
                                                    <form action={deleteSession} className="flex">
                                                        <input type="hidden" name="sessionId" value={session.id} />
                                                        <button className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
