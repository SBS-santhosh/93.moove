"use client";

import Link from "next/link";

export default function ProposPage() {
    return (
        <div className="min-h-screen relative bg-gray-50/50 dark:bg-gray-950/50 overflow-hidden pt-20 pb-16">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-float" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

            <div className="container relative z-10 px-4 md:px-6 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                        Qui sommes-<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">nous ?</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        93Moove est plus qu&apos;une association, c&apos;est un véritable écosystème dédié au sport, à la culture, et à la création de liens sociaux forts.
                    </p>
                </div>

                {/* Content Cards */}
                <div className="space-y-12">
                    <div className="glass-card p-8 md:p-12 hover:-translate-y-1 transition duration-300">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notre Mission</h2>
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            Nous avons pour ambition de rendre la pratique sportive et culturelle accessible à toutes et tous. Nous proposons un accompagnement encadré par des professionnels et animateurs passionnés, tout en garantissant des tarifs adaptés grâce au quotient familial.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card p-8 hover:-translate-y-1 transition duration-300">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Une commmunauté engagée</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Des centaines d&apos;adhérents adultes et enfants participent chaque semaine à nos sessions pour apprendre, s&apos;épanouir et échanger.
                            </p>
                        </div>
                        
                        <div className="glass-card p-8 hover:-translate-y-1 transition duration-300">
                            <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Qualité et Diversité</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Cours, activités manuelles, matériel de pointe, nous sélectionnons le meilleur pour vos enfants et vous-mêmes !
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Prêt à démarrer l&apos;aventure avec nous ?</p>
                    <Link href="/inscription" className="inline-flex bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition duration-300">
                        S&apos;inscrire maintenant
                    </Link>
                </div>
            </div>
        </div>
    );
}