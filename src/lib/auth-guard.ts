import { getUserFromSession } from "@/src/utils/jwt";

// Server-side identity checks for server actions and route handlers. Never trust
// a userId passed from the browser — always derive it from the session cookie.

export class AuthError extends Error {
    constructor(message = "You must be signed in to do that.") {
        super(message);
        this.name = "AuthError";
    }
}

export const requireUser = async () => {
    const user = await getUserFromSession();
    if (!user) throw new AuthError();
    return user;
};

export const requireAdmin = async () => {
    const user = await requireUser();
    if (user.role !== "admin") throw new AuthError("You are not allowed to do that.");
    return user;
};
