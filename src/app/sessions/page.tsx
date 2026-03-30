import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

/**
 * Page Liste des Sessions
 * Affiche toutes les sessions disponibles et validées.
 * Illustre le CRUD (Read) et permet la navigation vers les détails d'une session.
 */
export default async function SessionsPage() {
    const sessions = await prisma.session.findMany({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: { statut: 'VALIDATED' as any },
        orderBy: { date: 'asc' },
        include: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            instructeur: true as any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _count: {
                select: { inscriptions: true }
            } as any
        }
    });

    const categories = [
        { id: 'all', name: 'Toutes les sessions' },
        { id: 'cours', name: 'Cours' },
        { id: 'activite', name: 'Activités' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-300/20 dark:bg-purple-900/20 blur-3xl mix-blend-multiply" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] rounded-full bg-indigo-300/20 dark:bg-indigo-900/20 blur-3xl mix-blend-multiply" />

            <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            Découvrez nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Sessions</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Trouvez et réservez les cours et activités qui vous correspondent.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-10 border-b border-gray-200 dark:border-gray-800 pb-6">
                    {categories.map((category) => (
                        <button 
                            key={category.id}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                                category.id === 'all' 
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md' 
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center glass-card">
                        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune session disponible</h3>
                        <p className="text-gray-500">Revenez plus tard pour découvrir nos nouvelles sessions.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sessions.map((session) => (
                            <Link href={`/sessions/${session.id}`} key={session.id} className="group outline-none">
                                <div className="glass-card flex flex-col h-full overflow-hidden hover:border-purple-300/50 dark:hover:border-purple-700/50 transition-all duration-300 bg-white/70 dark:bg-gray-900/70 cursor-pointer">
                                    <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {session.image && (
                                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${session.image})` }} />
                                        )}
                                        <div className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-full shadow-sm backdrop-blur-md ${
                                            session.type === 'cours' 
                                            ? 'bg-blue-500/90 text-white' 
                                            : 'bg-orange-500/90 text-white'
                                        }`}>
                                            {session.type}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-500" />
                                        
                                        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center space-x-1.5">
                                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span>{session.duree} min</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-grow relative">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                                            {session.title}
                                        </h2>
                                        
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {session.description || "Aucune description fournie pour cette session."}
                                        </p>
                                        
                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 uppercase font-semibold">Instructeur</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{(session as any).instructeur?.name || "Inconnu"}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center space-x-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    <span>{new Date(session.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5 text-sm font-medium">
                                                    <span className={`${
                                                        session.capaciteMax && (session as any)._count?.inscriptions >= session.capaciteMax 
                                                        ? 'text-red-500' 
                                                        : 'text-green-500'
                                                    }`}>
                                                        {(session as any)._count?.inscriptions || 0} / {session.capaciteMax || '∞'} inscrits
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}