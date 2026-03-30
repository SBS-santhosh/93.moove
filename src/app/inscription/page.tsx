"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * Page d'Inscription
 * Permet aux nouveaux utilisateurs de créer un compte avec vérification de la complexité du mot de passe.
 * Respecte l'exigence : "A minima une inscription (complexité du mot de passe)"
 */
export default function InscriptionPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        // Vérification de la complexité du mot de passe pour l'examen E6
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Le mot de passe doit contenir au moins 8 caractères, dont une majuscule, une minuscule et un chiffre.");
            return;
        }

        setLoading(true);

        const { error: signUpError } = await authClient.signUp.email({
            name,
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message || "Erreur lors de l'inscription");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] max-h-[1000px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-200/40 via-pink-100/10 to-transparent dark:from-indigo-900/30 dark:via-pink-900/10 mix-blend-multiply blur-3xl z-0" />
            
            <div className="w-full max-w-lg relative z-10">
                <div className="glass-card shadow-2xl p-8 sm:p-10 bg-white/80 dark:bg-gray-950/80">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Créez votre compte</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Rejoignez 93Moove et participez à nos superbes activités !</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSignup}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium border border-red-100 dark:border-red-800/30">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom complet
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                                placeholder="Jean Dupont"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Adresse Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                                placeholder="votre.email@exemple.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirmation
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all sm:text-sm shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 text-center">
                            En m&apos;inscrivant, j&apos;accepte les <a href="#" className="text-pink-600 hover:underline">Conditions d&apos;Utilisation</a> et la <a href="#" className="text-pink-600 hover:underline">Politique de Confidentialité</a>.
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Créer mon compte"}
                        </button>
                    </form>
                    
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Déjà membre ?{" "}
                            <Link href="/connexion" className="text-pink-600 dark:text-pink-400 hover:text-pink-500 hover:underline transition-colors font-semibold">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}