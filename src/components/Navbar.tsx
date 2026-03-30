"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/");
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 glass border-b border-gray-200/40 dark:border-gray-800/40">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-1 group">
                    <span className="self-center text-2xl font-extrabold whitespace-nowrap tracking-tighter">
                        <span className="text-pink-500 group-hover:text-pink-400 transition-colors drop-shadow-sm">9</span>
                        <span className="text-purple-500 group-hover:text-purple-400 transition-colors drop-shadow-sm">3</span>
                        <span className="text-blue-500 group-hover:text-blue-400 transition-colors drop-shadow-sm">Moove</span>
                    </span>
                </Link>
                
                <div className="flex md:order-2 space-x-3 md:space-x-4">
                    {!isPending && !session ? (
                        <>
                            <Link href="/connexion" className="text-gray-700 dark:text-gray-200 hover:text-purple-500 font-medium rounded-xl text-sm px-4 py-2 text-center transition-all bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                                Connexion
                            </Link>
                            <Link href="/inscription" className="text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 font-semibold rounded-xl text-sm px-5 py-2 text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all hidden sm:block">
                                S&apos;inscrire
                            </Link>
                        </>
                    ) : !isPending && session ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                                {session.user.name}
                            </span>
                            <button onClick={handleSignOut} className="text-red-500 hover:text-red-600 font-medium rounded-xl text-sm px-4 py-2 text-center transition-all bg-red-50/50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-800/30">
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="w-24 h-9 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    )}

                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        type="button" 
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-xl md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-gray-600 transition-colors"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                        </svg>
                    </button>
                </div>
                
                <div className={`${isOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`}>
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-2xl bg-white/80 dark:bg-gray-900/80 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:border-gray-700 backdrop-blur-md">
                        <li>
                            <Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-purple-100 md:hover:bg-transparent md:hover:text-purple-600 md:p-0 md:dark:hover:text-purple-400 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition-colors">
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link href="/sessions" className="block py-2 px-3 text-gray-900 rounded hover:bg-purple-100 md:hover:bg-transparent md:hover:text-purple-600 md:p-0 md:dark:hover:text-purple-400 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition-colors">
                                Sessions
                            </Link>
                        </li>
                        <li>
                            <Link href="/propos" className="block py-2 px-3 text-gray-900 rounded hover:bg-purple-100 md:hover:bg-transparent md:hover:text-purple-600 md:p-0 md:dark:hover:text-purple-400 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition-colors">
                                À propos
                            </Link>
                        </li>
                        {session && (
                            <>
                                <li>
                                    <Link href="/profil" className="block sm:hidden py-2 px-3 text-gray-900 rounded hover:bg-purple-100 md:hover:bg-transparent md:hover:text-purple-600 md:p-0 md:dark:hover:text-purple-400 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent transition-colors">
                                        Mon Profil
                                    </Link>
                                </li>
                                {((session.user as unknown) as { role: string }).role === 'ADMIN' && (
                                    <li>
                                        <Link href="/modifsession" className="block py-2 px-3 text-red-600 dark:text-red-400 font-bold rounded hover:bg-red-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 md:dark:hover:text-red-300 dark:hover:bg-gray-700 md:dark:hover:bg-transparent transition-colors">
                                            ⚙️ Administration
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
