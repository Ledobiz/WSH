'use client'

import { signinWithGoogle } from "@/src/services/google";

const GoogleLoginButton = () => {
    const loginWithGoogle = async () => {
        const googleUser = await signinWithGoogle();
        console.log(googleUser);
    }

    return (
        <div className="social-login-wrap">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                <span
                    onClick={loginWithGoogle}
                    className="btn btn-md btn-gray rounded-3 border-2 flex-fill"
                >
                    SignIn with
                    <i className="bi bi-google text-red ms-2" />
                </span>
            </div>
        </div>
    )
}
export default GoogleLoginButton