import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative mt-20 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="flex items-center group">
                            <span className="self-center text-3xl font-extrabold whitespace-nowrap">
                                <span className="text-pink-500 group-hover:text-pink-400 transition-colors">9</span>
                                <span className="text-purple-500 group-hover:text-purple-400 transition-colors">3</span>
                                <span className="text-blue-500 group-hover:text-blue-400 transition-colors">Moove</span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                            Association d&apos;activités sportives, manuelles et culturelles pour tous les âges. Engagez-vous dans une vie plus active et créative.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Ressources</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/sessions" className="hover:underline hover:text-purple-500 transition-colors">Sessions</Link>
                                </li>
                                <li>
                                    <Link href="/propos" className="hover:underline hover:text-purple-500 transition-colors">À propos</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Légal</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <a href="#" className="hover:underline hover:text-purple-500 transition-colors">Politique de confidentialité</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:underline hover:text-purple-500 transition-colors">T&Cs</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-800 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2026 <Link href="/" className="hover:underline">93Moove™</Link>. Tous droits réservés.
                    </span>
                </div>
            </div>
        </footer>
    );
}
