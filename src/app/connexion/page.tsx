"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Page de Connexion
 * Gère l'authentification des utilisateurs (adhérents, instructeurs, admins).
 * Respecte l'exigence : "A minima une connexion (authentification, mot de passe chiffré)"
 */
export default function ConnexionPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        });

        if (signInError) {
            setError(signInError.message || "Identifiants invalides");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] max-h-[1000px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-200/40 via-purple-100/10 to-transparent dark:from-indigo-900/30 dark:via-purple-900/10 mix-blend-multiply blur-3xl z-0" />
            
            <div className="w-full max-w-md relative z-10">
                <div className="glass-card shadow-2xl p-8 sm:p-10 bg-white/80 dark:bg-gray-950/80">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-4 group">
                            <span className="text-3xl font-extrabold tracking-tighter">
                                <span className="text-pink-500 group-hover:text-pink-400 transition-colors">9</span>
                                <span className="text-purple-500 group-hover:text-purple-400 transition-colors">3</span>
                                <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Moove</span>
                            </span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Heureux de vous revoir</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Connectez-vous pour accéder à votre espace adhérent</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium border border-red-100 dark:border-red-800/30">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Adresse Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                                placeholder="votre.email@exemple.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mot de passe
                                </label>
                                <a href="#" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors">
                                    Oublié ?
                                </a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Se connecter"}
                        </button>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Nouveau chez 93Moove ?{" "}
                            <Link href="/inscription" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 hover:underline transition-colors font-semibold">
                                S&apos;inscrire
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}