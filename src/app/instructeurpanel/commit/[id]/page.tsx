import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export default async function CommitSessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const sessionId = Number(id);
    const sessionObj = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { instructeur: true }
    });

    if (!sessionObj) {
        return <div className="p-10 text-center">Session introuvable</div>;
    }

    async function commitToSession() {
        "use server";
        const reqHeaders = await headers();
        const authSession = await auth.api.getSession({ headers: reqHeaders });
        
        if (!authSession?.user?.id) {
            redirect("/connexion");
        }

        await prisma.session.update({
            where: { id: sessionId },
            data: {
                instructeurId: authSession.user.id as any,
                statut: "PENDING" as any, // Newly assigned instructor needs approval
            },
        });

        revalidatePath("/sessions");
        revalidatePath("/instructeurpanel");
        redirect("/instructeurpanel");
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-blue-600 text-white">
                    <h2 className="text-xl font-bold font-geist-sans uppercase tracking-wider">S&apos;engager sur la session</h2>
                    <p className="mt-1 opacity-80 text-sm">{sessionObj.title}</p>
                </div>

                <form action={commitToSession} className="p-6 space-y-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2 text-sm">
                        <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">Détails de la session</p>
                        <p className="dark:text-white"><strong>Date &amp; Heure:</strong> {sessionObj.date.toLocaleString("fr-FR")}</p>
                        <p className="dark:text-white"><strong>Instructeur Actuel:</strong> {sessionObj.instructeur?.name || "Aucun"}</p>
                    </div>

                    <div className="flex flex-col space-y-3 pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md"
                        >
                            Confirmer mon engagement
                        </button>
                        <Link
                            href="/instructeurpanel"
                            className="w-full text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
                        >
                            Annuler et revenir
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
