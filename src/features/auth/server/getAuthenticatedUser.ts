import { auth } from "../../../../auth";

export async function getAuthenticatedUser() {
    const session = await auth();

    if (!session?.user?.id) {
        return null;
    }

    return {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
    };
}
