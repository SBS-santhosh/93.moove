import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

/**
 * Page Détails d'une Session
 * Affiche les informations complètes d'une session et permet l'inscription des adultes et de leurs enfants.
 */
export default async function SessionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sessionDetail = await prisma.session.findUnique({
        where: { id: parseInt(id) },
        include: {
            instructeur: true,
            salle: true,
            _count: {
                select: { inscriptions: true }
            }
        }
    });

    if (!sessionDetail) {
        notFound();
    }

    const authSession = await auth.api.getSession({
        headers: await headers()
    });

    // Récupérer les données de l'utilisateur (enfants + inscriptions existantes pour cette session)
    const userData = authSession?.user?.id ? await prisma.user.findUnique({
        where: { id: authSession.user.id },
        include: {
            enfants: true,
            inscriptions: {
                where: { sessionId: sessionDetail.id }
            }
        }
    }) : null;

    const isFull = sessionDetail.capaciteMax && sessionDetail._count.inscriptions >= sessionDetail.capaciteMax;

    // Détermine si un participant spécifique (soit l'utilisateur, soit un enfant) est déjà inscrit
    const checkEnrollment = (participantId?: number) => {
        if (!userData) return false;
        if (participantId) {
            return userData.inscriptions.some(i => i.enfantId === participantId);
        }
        return userData.inscriptions.some(i => i.enfantId === null);
    };

    async function enrollAction(formData: FormData) {
        "use server";
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        if (!session?.user?.id) return;

        const participantId = formData.get("participantId") as string; // 'self' or enfantId string
        const enfantId = participantId === 'self' ? null : parseInt(participantId);

        try {
            await prisma.inscription.create({
                data: {
                    userId: session.user.id,
                    sessionId: sessionDetail!.id,
                    enfantId: enfantId as any
                } as any
            });
            revalidatePath(`/sessions/${id}`);
            revalidatePath(`/profil`);
        } catch (e) {
            console.error("Enrollment failed:", e);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950/30 pb-20">
            {/* Header Banner */}
            <div className={`relative w-full h-80 overflow-hidden ${sessionDetail.image ? '' : 'bg-gradient-to-r from-purple-800 to-indigo-900'}`}>
                {sessionDetail.image ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${sessionDetail.image})` }} />
                ) : (
                    <div className="absolute inset-0 bg-black/30 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]" />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-50/30 dark:from-gray-950/30 to-transparent z-10" />
                
                <div className="absolute inset-0 flex items-end pb-12 z-20">
                    <div className="container mx-auto px-4 md:px-6 max-w-5xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className={`px-4 py-1.5 text-xs font-bold uppercase rounded-full shadow-md backdrop-blur-md ${
                                sessionDetail.type === 'cours' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-orange-500 text-white'
                            }`}>
                                {sessionDetail.type}
                            </span>
                            <span className="bg-white/20 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {sessionDetail.duree} minutes
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md mb-2">{sessionDetail.title}</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 max-w-5xl -mt-8 relative z-10 flex flex-col md:flex-row gap-8">
                
                {/* Main Content Area */}
                <div className="flex-grow space-y-8">
                    {/* Concept Card */}
                    <div className="glass-card p-8 bg-white dark:bg-gray-900 border-t-4 border-t-purple-500">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">À propos de cette séance</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                            {sessionDetail.description || "Aucune description détaillée n'a été fournie pour cette session."}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="glass-card p-6 bg-white dark:bg-gray-900 flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Instructeur</h3>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{sessionDetail.instructeur.name}</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 bg-white dark:bg-gray-900 flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Salle & Lieu</h3>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">{sessionDetail.salle ? sessionDetail.salle.name : "Non specifiée"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Sticky Area */}
                <div className="w-full md:w-[350px] flex-shrink-0">
                    <div className="sticky top-28 glass-card bg-white dark:bg-gray-900 p-8 shadow-xl">
                        <div className="text-center mb-8">
                            <p className="text-gray-500 font-semibold uppercase tracking-widest text-sm mb-2">Réservation</p>
                            <div className="flex flex-col space-y-1 mt-6 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{new Date(sessionDetail.date).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="text-gray-600 dark:text-gray-400">Heure</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{new Date(sessionDetail.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-600 dark:text-gray-400">Places réservées</span>
                                    <span className="font-bold">{sessionDetail._count.inscriptions} / {sessionDetail.capaciteMax || '∞'}</span>
                                </div>
                                {sessionDetail.capaciteMax && (
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (sessionDetail._count.inscriptions / sessionDetail.capaciteMax) * 100)}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!authSession ? (
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-4">Vous devez être connecté pour vous inscrire.</p>
                                <Link href="/connexion" className="block w-full text-center bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    Se connecter
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center border-b border-gray-100 dark:border-gray-800 pb-2">Choisir un profil</h4>
                                
                                {/* Self Enrollment */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">Moi-même</span>
                                        {checkEnrollment() ? (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Inscrit</span>
                                        ) : isFull ? (
                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Complet</span>
                                        ) : null}
                                    </div>
                                    {!checkEnrollment() && !isFull && (
                                        <form action={enrollAction}>
                                            <input type="hidden" name="participantId" value="self" />
                                            <button type="submit" className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:opacity-80 transition-opacity">
                                                M&apos;inscrire
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Children Enrollment */}
                                {userData?.enfants && userData.enfants.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        {userData.enfants.map(enfant => (
                                            <div key={enfant.id} className="flex flex-col space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{enfant.prenom}</span>
                                                    {checkEnrollment(enfant.id) ? (
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Inscrit</span>
                                                    ) : isFull ? (
                                                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tight">Complet</span>
                                                    ) : null}
                                                </div>
                                                {!checkEnrollment(enfant.id) && !isFull && (
                                                    <form action={enrollAction}>
                                                        <input type="hidden" name="participantId" value={enfant.id.toString()} />
                                                        <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold py-2 rounded-lg hover:from-purple-400 hover:to-indigo-400 transition-all">
                                                            Inscrire {enfant.prenom}
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {userData?.enfants && userData.enfants.length === 0 && (
                                    <div className="text-center py-2">
                                        <p className="text-[10px] text-gray-500 italic">Aucun enfant enregistré sur votre profil.</p>
                                        <Link href="/profil" className="text-[10px] text-purple-500 hover:underline font-bold">Ajouter un enfant</Link>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="mt-6 text-center text-xs text-gray-500 leading-tight">
                            L&apos;annulation est gratuite jusqu&apos;à 24h avant le début de la séance. Vous pouvez gérer vos inscriptions depuis votre Espace Profil.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
