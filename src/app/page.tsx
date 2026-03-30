"use client";

import Link from "next/link";

/**
 * Page d'accueil (Home Page)
 * Présente l'association 93Moove au public et invite à la création de compte ou consultation des sessions.
 */
export default function Home() {
    return (
        <div className="flex flex-col w-full overflow-hidden">
            {/* Hero Section */}
            <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
                {/* Background Details */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-purple-50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-900 opacity-80" />
                
                {/* Floating Elements (Decorative) */}
                <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float dark:bg-purple-900/40" />
                <div className="absolute top-1/3 right-10 w-72 h-72 bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float dark:bg-pink-900/40" style={{ animationDelay: '2s' }} />
                <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float dark:bg-blue-900/40" style={{ animationDelay: '4s' }} />

                <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center mx-auto">
                    <div className="inline-flex items-center rounded-full border border-purple-200/50 dark:border-purple-800/50 bg-purple-50/50 dark:bg-purple-900/20 px-3 py-1 text-sm text-purple-600 dark:text-purple-300 backdrop-blur-md mb-8 animate-pulse-soft">
                        <span className="flex h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 mr-2"></span>
                        Les inscriptions 2026 sont ouvertes
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl text-gray-900 dark:text-white drop-shadow-sm">
                        Bienvenue chez <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">93Moove</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        L&apos;association de référence pour vos activités sportives, créatives et culturelles. Rejoignez-nous pour bouger, créer et partager !
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link 
                            href="/sessions" 
                            className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center group"
                        >
                            Découvrir nos sessions
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </Link>
                        <Link 
                            href="/inscription" 
                            className="bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-lg flex items-center justify-center backdrop-blur-sm"
                        >
                            Rejoindre l&apos;association
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features/News Section */}
            <section className="relative w-full py-24 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 md:px-6 max-w-screen-xl">
                    <div className="flex flex-col items-center justify-center text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Actualités & Nouveautés</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6"></div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Restez à jour sur les derniers événements, les nouvelles sessions et la vie de l&apos;association 93Moove.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="glass-card overflow-hidden group">
                            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Événement</span>
                                    <span className="text-sm text-gray-500">Aujourd&apos;hui</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Gala de fin d&apos;année</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                    Rejoignez-nous pour célébrer la fin de la saison avec des démonstrations de tous nos groupes. Une soirée inoubliable en perspective !
                                </p>
                                <a href="#" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center">
                                    Lire la suite
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </a>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="glass-card overflow-hidden group">
                            <div className="h-48 bg-gradient-to-br from-pink-500 to-rose-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400">Nouveauté</span>
                                    <span className="text-sm text-gray-500">Il y a 2 jours</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Nouveau cours de Yoga</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                    Détendez-vous avec notre nouveau professeur certifié. Sessions disponibles tous les mardis et jeudis soirs. Places limitées.
                                </p>
                                <a href="#" className="font-semibold text-pink-600 dark:text-pink-400 hover:underline inline-flex items-center">
                                    Lire la suite
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </a>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-card overflow-hidden group">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-900">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Information</span>
                                    <span className="text-sm text-gray-500">La semaine dernière</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Calcul du Quotient Familial</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                    N&apos;oubliez pas de mettre à jour vos justificatifs pour bénéficier du tarif adapté à votre situation pour la rentrée.
                                </p>
                                <a href="#" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                                    Lire la suite
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="relative w-full py-20 bg-gray-900 border-t border-gray-800">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Prêt à nous rejoindre ?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Créez votre compte en quelques secondes et inscrivez-vous à vos premières sessions dès aujourd&apos;hui.
                    </p>
                    <Link href="/inscription" className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-1 transition-all duration-300">
                        Créer un compte
                    </Link>
                </div>
            </section>
        </div>
    );
}