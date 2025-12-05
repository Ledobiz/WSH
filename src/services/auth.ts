import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, User as Auth } from "firebase/auth";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

const formatFirebaseError = (err) => {
  const raw = err && err.code ? (err.code.split('/')[1] || '') : (err && err.message ? err.message : 'Error');
  return raw
    .toString()
    .replace(/[-_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

const signup = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        /**
         * User would contain the following:
         * uid,
         * name,
         * email,
         * phoneNumber, - This may not have a value so treat accordingly
         * photoURL
         */
    }
    catch (error) {
        console.error("Error signing up:", error);
        toast.error(formatFirebaseError(error));
    }
}

const login = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log("Error logging in using email & password:", error);
        toast.error(formatFirebaseError(error));
    }
}

const logout = () => {
  signOut(auth);
  toast.success("Logged out successfully");
}

const signinWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;
    } catch (error) {
        console.log("Error signing in using Google SSO:", error);
        toast.error(formatFirebaseError(error));
    }
}


export { signup, login, logout };