import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

/**
 * Page de Profil Utilisateur
 * Permet de gérer ses informations, ses enfants et de voir ses inscriptions.
 */
export default async function ProfilPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        redirect("/connexion");
    }

    // Récupérer les données de l'utilisateur avec ses enfants et inscriptions
    const userData = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            enfants: {
                orderBy: { prenom: 'asc' }
            },
            inscriptions: {
                include: {
                    session: {
                        include: {
                            instructeur: true,
                            salle: true
                        }
                    },
                    enfant: true
                },
                orderBy: {
                    session: {
                        date: 'desc'
                    }
                }
            }
        }
    });

    if (!userData) {
        redirect("/");
    }

    // --- Server Actions ---
    
    async function addEnfant(formData: FormData) {
        "use server";
        const nom = formData.get("nom") as string;
        const prenom = formData.get("prenom") as string;
        const dateNaissanceStr = formData.get("dateNaissance") as string;
        
        if (!nom || !prenom || !dateNaissanceStr) return;

        await prisma.profilEnfant.create({
            data: {
                nom,
                prenom,
                dateNaissance: new Date(dateNaissanceStr),
                parentId: session!.user.id
            }
        });

        revalidatePath("/profil");
    }

    async function removeEnfant(enfantId: number) {
        "use server";
        // Verify ownership
        const enfant = await prisma.profilEnfant.findUnique({
            where: { id: enfantId }
        });

        if (enfant?.parentId === session!.user.id) {
            await prisma.profilEnfant.delete({
                where: { id: enfantId }
            });
            revalidatePath("/profil");
        }
    }

    async function cancelInscription(inscriptionId: number) {
        "use server";
        // Verify ownership
        const inscription = await prisma.inscription.findUnique({
            where: { id: inscriptionId }
        });

        if (inscription?.userId === session!.user.id) {
            await prisma.inscription.delete({
                where: { id: inscriptionId }
            });
            revalidatePath("/profil");
            revalidatePath("/sessions");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950/30 pb-20">
            {/* Header Profil */}
            <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500">
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50/30 dark:from-gray-950/30 to-transparent" />
                
                <div className="container mx-auto px-4 md:px-6 max-w-6xl h-full flex items-end pb-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                            {userData.name.charAt(0)}
                        </div>
                        <div className="text-white">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg">{userData.name}</h1>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20">
                                    {userData.role}
                                </span>
                                <span className="text-white/80 text-sm font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    {userData.email}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-6xl -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Colonne de Gauche : Gestion des Enfants */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-card p-6 bg-white dark:bg-gray-900 shadow-xl border-t-4 border-purple-500">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                Mes Enfants
                            </h2>
                            
                            {userData.enfants.length === 0 ? (
                                <p className="text-sm text-gray-500 italic mb-6">Aucun profil enfant enregistré.</p>
                            ) : (
                                <div className="space-y-4 mb-8">
                                    {userData.enfants.map(enfant => (
                                        <div key={enfant.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-900/30 transition-all">
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{enfant.prenom} {enfant.nom}</p>
                                                <p className="text-xs text-gray-500">{new Date(enfant.dateNaissance).toLocaleDateString("fr-FR")}</p>
                                            </div>
                                            <form action={async () => { "use server"; await removeEnfant(enfant.id); }}>
                                                <button type="submit" className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </form>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Ajouter un profil</h3>
                                <form action={addEnfant} className="space-y-3">
                                    <input name="prenom" placeholder="Prénom" required className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-purple-500 outline-none" />
                                    <input name="nom" placeholder="Nom" required className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-purple-500 outline-none" />
                                    <input name="dateNaissance" type="date" required className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 focus:ring-2 focus:ring-purple-500 outline-none" />
                                    <button type="submit" className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                        Enregistrer l&apos;enfant
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Quotient Familial Status */}
                        <div className="glass-card p-6 bg-white dark:bg-gray-900 shadow-xl border-t-4 border-indigo-500">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Quotient Familial
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Votre statut actuel de facturation basé sur vos revenus.</p>
                            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Statut</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                    userData.quotientStatut === 'validated' ? 'bg-green-500 text-white' : 
                                    userData.quotientStatut === 'pending' ? 'bg-orange-500 text-white' : 'bg-gray-500 text-white'
                                }`}>
                                    {userData.quotientStatut || "Non soumis"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Colonne de Droite : Inscriptions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8 bg-white dark:bg-gray-900 shadow-xl min-h-[500px]">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
                                <svg className="w-6 h-6 mr-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Mes Inscriptions
                            </h2>
                            
                            {userData.inscriptions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-700 mb-4">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">Vous n&apos;avez pas encore d&apos;inscriptions actives.</p>
                                    <a href="/sessions" className="mt-4 text-purple-600 font-bold hover:underline">Découvrir les sessions</a>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {userData.inscriptions.map(insc => (
                                        <div key={insc.id} className="relative group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-800 transition-all p-5 shadow-sm hover:shadow-md">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Session Info */}
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${insc.session.type === 'cours' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {insc.session.type}
                                                        </span>
                                                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Réf: #93M-0{insc.sessionId}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors uppercase tracking-tight">
                                                        {insc.session.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4 mt-3">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                            {new Date(insc.session.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' })} à {new Date(insc.session.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <svg className="w-4 h-4 mr-1.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                            {insc.session.salle?.name || "Lieu à confirmer"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Who is attending */}
                                                <div className="flex flex-col md:items-end justify-center">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Participant</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ring-2 ring-white dark:ring-gray-900 ${insc.enfant ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'}`}>
                                                            {insc.enfant ? insc.enfant.prenom.charAt(0) : userData.name.charAt(0)}
                                                        </div>
                                                        <span className="font-bold text-gray-900 dark:text-white">
                                                            {insc.enfant ? `${insc.enfant.prenom} (Enfant)` : "Moi-même"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Action Overlay in Hover */}
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <form action={async () => { "use server"; await cancelInscription(insc.id); }}>
                                                    <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20" title="Annuler l'inscription">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
