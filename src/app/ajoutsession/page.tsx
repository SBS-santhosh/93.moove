import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

/**
 * Page de Création de Session (CRUD - Create)
 * Permet aux professeurs ou à l'administrateur de créer de nouvelles sessions.
 * Met en évidence l'association 1:1 vers 1:N (un Instructeur gère plusieurs Sessions).
 */
export default async function Page() {
    const authSession = await auth.api.getSession({
        headers: await headers()
    });

    const userRole = authSession?.user?.role || Role.ADHERENT_ADULTE;
    const isAdmin = userRole === Role.ADMIN;
    const currentUserId = authSession?.user?.id;

    // Only allow Admin, Professeur, Animateur
    if (![Role.ADMIN, Role.PROFESSEUR, Role.ANIMATEUR].includes(userRole as any)) {
        redirect("/sessions");
    }

    const instructors = await prisma.user.findMany({
        where: { role: Role.PROFESSEUR },
        orderBy: { name: 'asc' }
    });

    const salles = await prisma.salle.findMany({
        orderBy: { name: 'asc' }
    });

    async function ajouterSession(formData: FormData) {
        "use server";
        const session = await auth.api.getSession({
            headers: await headers()
        });
        
        const role = session?.user?.role;
        if (!role) return;

        const title = formData.get("title") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const dateStr = formData.get("date") as string;
        const timeStr = formData.get("time") as string;
        const duree = Number(formData.get("duree")) || 60;
        const capaciteMax = Number(formData.get("capaciteMax")) || null;
        
        // If admin, use selected instructor, otherwise use self
        const instructeurId = role === Role.ADMIN 
            ? (formData.get("instructeurId") as string) 
            : session.user.id;

        const salleId = formData.get("salleId") ? Number(formData.get("salleId")) : null;
        const image = formData.get("image") as string;

        // Combine date and time
        const combinedDate = new Date(`${dateStr}T${timeStr}`);

        await prisma.session.create({
            data: {
                title,
                type,
                description,
                date: combinedDate,
                duree,
                capaciteMax,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                instructeurId: instructeurId as any,
                salleId,
                image: image || null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                statut: (role === Role.ADMIN ? "VALIDATED" : "PENDING") as any,
            },
        });

        revalidatePath("/sessions");
        revalidatePath("/instructeurpanel");
        redirect(role === Role.ADMIN ? "/sessions" : "/instructeurpanel");
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
            <form action={ajouterSession} className="w-full max-w-2xl space-y-4 p-8 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Créer une nouvelle session</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre de la session</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de session</label>
                        <select
                            id="type"
                            name="type"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="cours">Cours</option>
                            <option value="activite">Activité</option>
                        </select>
                    </div>

                    {isAdmin ? (
                        <div>
                            <label htmlFor="instructeurId" className="block text-sm font-medium text-gray-700">Instructeur</label>
                            <select
                                id="instructeurId"
                                name="instructeurId"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="">Sélectionner un instructeur</option>
                                {instructors.map(inst => (
                                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instructeur</label>
                            <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 italic">
                                {authSession?.user?.name} (Auto-assigné)
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700">Heure</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="duree" className="block text-sm font-medium text-gray-700">Durée (minutes)</label>
                        <input
                            type="number"
                            id="duree"
                            name="duree"
                            required
                            defaultValue="60"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="capaciteMax" className="block text-sm font-medium text-gray-700">Capacité Max</label>
                        <input
                            type="number"
                            id="capaciteMax"
                            name="capaciteMax"
                            placeholder="Optionnel"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="salleId" className="block text-sm font-medium text-gray-700">Salle</label>
                        <select
                            id="salleId"
                            name="salleId"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">Sélectionner une salle (Optionnel)</option>
                            {salles.map(s => (
                                <option key={s.id} value={s.id}>{s.name} (Capacité: {s.capacity})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL de l&apos;image</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            placeholder="https://..."
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                {!isAdmin && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm italic">
                        Note : Votre session sera créée en attente de validation par l&apos;administration.
                    </div>
                )}

                <div className="flex justify-between pt-6">
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                    >
                        Enregistrer la session
                    </button>
                    <Link href="/sessions" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200">
                        Annuler
                    </Link>
                </div>
            </form>
        </div>
    );
}
