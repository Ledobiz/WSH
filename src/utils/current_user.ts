import { cookies } from "next/headers"
import { cache } from "react"
import { redirect } from "next/navigation"
import { getUserFromSession } from "./session";
import { loginUrl } from "./url";

type User = Exclude<
    Awaited<ReturnType<typeof getUserFromSession>>,
    undefined | null
>

function _getCurrentUser(options?: {
    redirectIfNotFound?: true
}): Promise<User | null>

async function _getCurrentUser({ redirectIfNotFound = false } = {}) {
    const user = await getUserFromSession(await cookies());

    if (user == null) {
        if (redirectIfNotFound) return redirect(loginUrl);
        return null;
    }

    return user;
}

export const currentUser = cache(_getCurrentUser);