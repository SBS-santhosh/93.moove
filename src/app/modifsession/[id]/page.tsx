import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
const prisma = new PrismaClient();

/**
 * Page Modification de Session (CRUD - Update)
 * Interface dédiée à la mise à jour des informations spécifiques d'une session (date, durée, description, statut).
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sessionId = Number(id);
    const session = await prisma.session.findUnique({
        where: { id: sessionId },
    });

    if (!session) {
        return <div className="p-10 text-center text-xl">Session introuvable</div>;
    }

    async function updateSession(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        const type = formData.get("type") as string;
        const date = formData.get("date") as string;
        const duree = Number(formData.get("duree")) || 60;
        const description = formData.get("description") as string;
        const capaciteMax = Number(formData.get("capaciteMax")) || null;
        let image = formData.get("image") as string;
        if (!image || image.trim() === "") image = ""; // or null if we handle null

        await prisma.session.update({
            where: { id: sessionId },
            data: {
                title,
                type,
                date: new Date(date),
                duree: duree,
                description,
                image: image !== "" ? image : null,
                capaciteMax: capaciteMax ? capaciteMax : null,
            },
        });

        revalidatePath("/sessions");
        revalidatePath(`/sessions/${sessionId}`);
        redirect("/sessions");
    }

    return (
        <div className="min-h-[85vh] bg-gray-50 dark:bg-gray-950 p-6 flex justify-center items-center py-20 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-indigo-200/40 via-purple-100/10 to-transparent dark:from-indigo-900/30 dark:via-purple-900/10 mix-blend-multiply blur-3xl z-0" />

            <form action={updateSession} className="w-full max-w-2xl space-y-6 p-8 relative z-10 glass-card bg-white/80 dark:bg-gray-900/80 shadow-2xl">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Gérer la session</h2>
                    <p className="text-sm text-gray-500 mt-1">Modifiez les informations, la date et la photo de présentation de la session.</p>
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Titre de la session</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={session.title}
                        required
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Type de session</label>
                        <select
                            id="type"
                            name="type"
                            defaultValue={session.type}
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                        >
                            <option value="cours">Cours régulier</option>
                            <option value="activite">Activité ponctuelle</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date et heure</label>
                        <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            defaultValue={session.date.toISOString().slice(0, 16)}
                            required
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="duree" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Durée (en minutes)</label>
                        <input
                            type="number"
                            id="duree"
                            name="duree"
                            defaultValue={session.duree}
                            required
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                        />
                    </div>
                    <div>
                        <label htmlFor="capaciteMax" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Capacité Max (Optionnel)</label>
                        <input
                            type="number"
                            id="capaciteMax"
                            name="capaciteMax"
                            defaultValue={session.capaciteMax || ""}
                            className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                        />
                    </div>
                </div>

                {/* IMAGE UPLOAD FIELD */}
                <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">URL de la photo (Optionnel)</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        defaultValue={session.image || ""}
                        placeholder="https://exemple.com/photo.jpg"
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                    />
                    <p className="text-xs text-gray-500 mt-2">Permet à l&apos;Admin d&apos;insérer une image pour représenter la session sur les galeries.</p>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={session.description || ""}
                        className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
                    />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <Link href="/sessions" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-bold rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition focus:outline-none">
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition focus:outline-none hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    >
                        Mettre à jour la session
                    </button>
                </div>
            </form>
        </div>
    );
}
